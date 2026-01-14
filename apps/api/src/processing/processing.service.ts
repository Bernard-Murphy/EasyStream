import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UploadsService } from '../uploads/uploads.service';
import { buildAssemblePlan } from './assemble-plan';
import { s3 } from '../s3/s3';
import { pubsub, TOPIC_STREAM_UPDATED } from '../common/graphql-pubsub';
import AWS from 'aws-sdk';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

@Injectable()
export class ProcessingService {
  private readonly logger = new Logger(ProcessingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly uploads: UploadsService,
    private readonly config: ConfigService,
  ) {}

  async processStreamToPast(streamUuid: string): Promise<void> {
    const stream = await this.prisma.stream.findUnique({ where: { uuid: streamUuid } });
    if (!stream) return;

    const clipUrls = stream.fileUrls ?? [];
    const streamLengthMb = Number(this.config.get('STREAM_LENGTH') ?? 250);

    const mode = String(this.config.get('ASSEMBLY_MODE') ?? 'local');
    const lambdaName = this.config.get<string>('ASSEMBLE_STREAM_LAMBDA_NAME') ?? '';

    if (mode === 'lambda' && lambdaName) {
      try {
        const assembledUrls = await this.assembleViaLambda({
          lambdaName,
          streamUuid,
          clipUrls,
          streamLengthMb,
        });
        const updated = await this.prisma.stream.update({
          where: { uuid: streamUuid },
          data: { status: 'past', fileUrls: assembledUrls },
        });
        await pubsub.publish(TOPIC_STREAM_UPDATED, { streamUpdated: updated });
        return;
      } catch (e: any) {
        this.logger.warn(
          `Lambda assembly failed; falling back to local: ${e?.message ?? e}`,
        );
      }
    }

    const clipSizesMb = await Promise.all(
      clipUrls.map(async (url) => {
        const key = this.uploads.extractKeyFromUrl(url);
        if (!key) return 0;
        const localPath = this.uploads.getLocalPathFromKey(key);

        // local fallback
        if (fsSync.existsSync(localPath)) {
          const st = await fs.stat(localPath);
          return st.size / (1024 * 1024);
        }

        // s3/storj
        const bucket = this.config.get<string>('STORJ_BUCKET');
        if (!bucket) return 0;
        const head = await s3.headObject({ Bucket: bucket, Key: key }).promise();
        return (head.ContentLength ?? 0) / (1024 * 1024);
      }),
    );

    const plan = buildAssemblePlan({
      streamUuid,
      clipUrls,
      clipSizesMb,
      streamLengthMb,
    });

    const assembledUrls: string[] = [];
    const tmpRoot = path.join('/tmp', 'easystream-processing', streamUuid, `${Date.now()}`);
    await fs.mkdir(tmpRoot, { recursive: true });

    for (const group of plan.groups) {
      const partKey = this.uploads.makeKey(`streams/${streamUuid}/assembled`, '.webm');
      const outPath = path.join(tmpRoot, `part-${group.partIndex}.webm`);

      const concatListPath = path.join(tmpRoot, `concat-${group.partIndex}.txt`);
      const inputs: string[] = [];

      for (const url of group.clipUrls) {
        const key = this.uploads.extractKeyFromUrl(url);
        if (!key) continue;

        const localPath = this.uploads.getLocalPathFromKey(key);
        if (fsSync.existsSync(localPath)) {
          inputs.push(localPath);
          continue;
        }

        // download from s3
        const bucket = this.config.get<string>('STORJ_BUCKET');
        if (!bucket) continue;
        const dlPath = path.join(tmpRoot, path.basename(key));
        await new Promise<void>((resolve, reject) => {
          const rs = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
          const ws = fsSync.createWriteStream(dlPath);
          rs.on('error', reject);
          ws.on('error', reject);
          ws.on('finish', () => resolve());
          rs.pipe(ws);
        });
        inputs.push(dlPath);
      }

      if (inputs.length === 0) continue;

      // ffmpeg concat (stream copy)
      const concatList = inputs.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n') + '\n';
      await fs.writeFile(concatListPath, concatList);

      await this.runFfmpegConcat(concatListPath, outPath);

      const uploaded = await this.uploads.putFile({
        key: partKey,
        contentType: 'video/webm',
        filePath: outPath,
      });
      assembledUrls.push(uploaded.url);
    }

    // Delete original clips (best-effort)
    await this.deleteClipsBestEffort(clipUrls);

    const updated = await this.prisma.stream.update({
      where: { uuid: streamUuid },
      data: {
        status: 'past',
        fileUrls: assembledUrls,
      },
    });

    // Notify all clients watching this stream that processing is complete.
    await pubsub.publish(TOPIC_STREAM_UPDATED, { streamUpdated: updated });
  }

  private async assembleViaLambda(params: {
    lambdaName: string;
    streamUuid: string;
    clipUrls: string[];
    streamLengthMb: number;
  }): Promise<string[]> {
    const lambda = new AWS.Lambda({
      region: this.config.get<string>('REGION') ?? 'us-east-1',
    });

    const invoke = await lambda
      .invoke({
        FunctionName: params.lambdaName,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
          streamUuid: params.streamUuid,
          clipUrls: params.clipUrls,
          streamLengthMb: params.streamLengthMb,
          deleteClips: true,
          outputPrefix: `streams/${params.streamUuid}/assembled`,
        }),
      })
      .promise();

    if (invoke.FunctionError) {
      throw new Error(`Lambda error: ${invoke.FunctionError}`);
    }
    const raw = invoke.Payload ? invoke.Payload.toString() : '';
    const parsed = raw ? JSON.parse(raw) : null;
    const assembled = (parsed?.assembled ?? []) as Array<{ url: string }>;
    return assembled.map((x) => x.url).filter(Boolean);
  }

  private async runFfmpegConcat(listPath: string, outPath: string) {
    await new Promise<void>((resolve, reject) => {
      const p = spawn('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outPath], {
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      let stderr = '';
      p.stderr.on('data', (d) => (stderr += d.toString()));
      p.on('error', reject);
      p.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg failed (${code}): ${stderr.slice(-2000)}`));
      });
    });
  }

  private async deleteClipsBestEffort(urls: string[]) {
    const bucket = this.config.get<string>('STORJ_BUCKET');
    const endpoint = this.config.get<string>('STORJ_ENDPOINT');
    const accessKey = this.config.get<string>('STORJ_SECRET_ACCESS_ID');
    const secretKey = this.config.get<string>('STORJ_SECRET_ACCESS_KEY');

    const keys: string[] = [];
    for (const url of urls) {
      const key = this.uploads.extractKeyFromUrl(url);
      if (key) keys.push(key);
    }

    // local delete
    for (const key of keys) {
      const p = this.uploads.getLocalPathFromKey(key);
      if (fsSync.existsSync(p)) {
        try {
          await fs.unlink(p);
        } catch {
          // ignore
        }
      }
    }

    // s3 delete
    if (bucket && endpoint && accessKey && secretKey && keys.length > 0) {
      try {
        await s3
          .deleteObjects({
            Bucket: bucket,
            Delete: { Objects: keys.map((Key) => ({ Key })) },
          })
          .promise();
      } catch (e) {
        this.logger.warn(`Failed deleting clips from s3: ${(e as any)?.message ?? e}`);
      }
    }
  }
}


