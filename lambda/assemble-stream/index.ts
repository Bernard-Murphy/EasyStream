/**
 * EasyStream Lambda - Assemble uploaded clips into larger stream files.
 *
 * - Download clips from Storj (S3 compatible)
 * - Concatenate them in order into parts of max STREAM_LENGTH_MB (by total clip size)
 * - Upload assembled parts back to Storj
 * - Delete original clips
 *
 * Notes:
 * - This lambda expects ffmpeg to be available in the runtime (either baked in or via a Lambda Layer).
 *   You can override with FFMPEG_PATH env var (default: "ffmpeg").
 * - Storj is used via AWS SDK v2 with the provided config requirement (no forcePathStyle/signatureVersion).
 */

import AWS from "aws-sdk";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import { spawn } from "child_process";

AWS.config.update({
  region: process.env.REGION || "us-east-1",
});

export const s3 = new AWS.S3({
  endpoint: process.env.STORJ_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORJ_SECRET_ACCESS_ID!,
    secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY!,
  },
}); // do not use s3ForcePathStyle or signatureVersion

export type AssembleRequest = {
  streamUuid: string;

  /**
   * Provide EITHER clipKeys OR clipUrls. Order matters: concatenation is done in the order provided.
   */
  clipKeys?: string[];
  clipUrls?: string[];

  /**
   * Optional sizes (MB) parallel to the clip list; if omitted, lambda will HEAD each object.
   */
  clipSizesMb?: number[];

  /**
   * Max size (MB) of each assembled output file.
   * Defaults to env STREAM_LENGTH or 250.
   */
  streamLengthMb?: number;

  /**
   * Where to write outputs in the bucket.
   * Default: streams/:streamUuid/assembled
   */
  outputPrefix?: string;

  /**
   * Delete original clips after successful assembly.
   * Default: true
   */
  deleteClips?: boolean;
};

export type AssemblePlan = {
  streamUuid: string;
  groups: Array<{
    partIndex: number;
    clipKeys: string[];
    totalMb: number;
  }>;
};

export function buildAssemblePlan(req: AssembleRequest): AssemblePlan {
  const clipKeys = req.clipKeys ?? [];
  const clipSizesMb = req.clipSizesMb ?? [];
  const streamLengthMb =
    req.streamLengthMb ?? Number(process.env.STREAM_LENGTH ?? 250);

  const groups: AssemblePlan["groups"] = [];
  let current: string[] = [];
  let total = 0;
  let partIndex = 0;

  for (let i = 0; i < clipKeys.length; i++) {
    const key = clipKeys[i];
    const mb = clipSizesMb[i] ?? 0;

    if (current.length > 0 && total + mb > streamLengthMb) {
      groups.push({ partIndex, clipKeys: current, totalMb: total });
      partIndex += 1;
      current = [];
      total = 0;
    }

    current.push(key);
    total += mb;
  }

  if (current.length > 0) {
    groups.push({ partIndex, clipKeys: current, totalMb: total });
  }

  return { streamUuid: req.streamUuid, groups };
}

export type AssembleResult = {
  streamUuid: string;
  assembled: Array<{
    partIndex: number;
    key: string;
    url: string;
    totalMb: number;
  }>;
  deletedClipKeys: string[];
  plan: AssemblePlan;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function extractKeyFromUrl(url: string): string | null {
  // For Storj: ${STORJ_ENDPOINT}/${STORJ_BUCKET}/${key}
  const endpoint = process.env.STORJ_ENDPOINT;
  const bucket = process.env.STORJ_BUCKET;
  if (!endpoint || !bucket) return null;
  const base = `${endpoint.replace(/\/$/, "")}/${bucket}/`;
  if (!url.startsWith(base)) return null;
  return url.slice(base.length);
}

async function headSizeMb(bucket: string, key: string): Promise<number> {
  const head = await s3.headObject({ Bucket: bucket, Key: key }).promise();
  return (head.ContentLength ?? 0) / (1024 * 1024);
}

async function downloadToFile(bucket: string, key: string, outPath: string) {
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await new Promise<void>((resolve, reject) => {
    const rs = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
    const ws = fsSync.createWriteStream(outPath);
    rs.on("error", reject);
    ws.on("error", reject);
    ws.on("finish", () => resolve());
    rs.pipe(ws);
  });
}

async function uploadFile(bucket: string, key: string, filePath: string) {
  await s3
    .upload({
      Bucket: bucket,
      Key: key,
      Body: fsSync.createReadStream(filePath),
      ContentType: "video/webm",
    })
    .promise();
}

async function runFfmpegConcat(listPath: string, outPath: string) {
  const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
  await new Promise<void>((resolve, reject) => {
    const p = spawn(
      ffmpegPath,
      [
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        listPath,
        "-c",
        "copy",
        outPath,
      ],
      { stdio: ["ignore", "pipe", "pipe"] }
    );
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", reject);
    p.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg failed (${code}): ${stderr.slice(-2000)}`));
    });
  });
}

// AWS Lambda handler
export async function handler(event: AssembleRequest): Promise<AssembleResult> {
  const bucket = requireEnv("STORJ_BUCKET");

  const clipKeys =
    event.clipKeys ??
    (event.clipUrls ?? [])
      .map((u) => extractKeyFromUrl(u))
      .filter((k): k is string => !!k);

  if (clipKeys.length === 0) {
    return {
      streamUuid: event.streamUuid,
      assembled: [],
      deletedClipKeys: [],
      plan: { streamUuid: event.streamUuid, groups: [] },
    };
  }

  const clipSizesMb =
    event.clipSizesMb && event.clipSizesMb.length === clipKeys.length
      ? event.clipSizesMb
      : await Promise.all(clipKeys.map((k) => headSizeMb(bucket, k)));

  const plan = buildAssemblePlan({
    ...event,
    clipKeys,
    clipSizesMb,
    streamLengthMb:
      event.streamLengthMb ?? Number(process.env.STREAM_LENGTH ?? 250),
  });

  const outputPrefix =
    event.outputPrefix ?? `streams/${event.streamUuid}/assembled`;
  const tmpRoot = path.join(
    "/tmp",
    "easystream-lambda",
    event.streamUuid,
    `${Date.now()}`
  );
  await fs.mkdir(tmpRoot, { recursive: true });

  const assembled: AssembleResult["assembled"] = [];

  for (const group of plan.groups) {
    const partKey = `${outputPrefix}/${group.partIndex}-${randomUUID()}.webm`;
    const outPath = path.join(tmpRoot, `part-${group.partIndex}.webm`);
    const listPath = path.join(tmpRoot, `concat-${group.partIndex}.txt`);

    const localInputs: string[] = [];

    for (const key of group.clipKeys) {
      const localPath = path.join(tmpRoot, "clips", key.replace(/\//g, "_"));
      await downloadToFile(bucket, key, localPath);
      localInputs.push(localPath);
    }

    const concatList =
      localInputs.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join("\n") +
      "\n";
    await fs.writeFile(listPath, concatList);

    await runFfmpegConcat(listPath, outPath);
    await uploadFile(bucket, partKey, outPath);

    const endpoint = requireEnv("STORJ_ENDPOINT").replace(/\/$/, "");
    const url = `${endpoint}/${bucket}/${partKey}`;
    assembled.push({
      partIndex: group.partIndex,
      key: partKey,
      url,
      totalMb: group.totalMb,
    });
  }

  const deletedClipKeys: string[] = [];
  if (event.deleteClips !== false) {
    const toDelete = clipKeys.map((Key) => ({ Key }));
    // delete in batches of 1000
    for (let i = 0; i < toDelete.length; i += 1000) {
      const batch = toDelete.slice(i, i + 1000);
      await s3
        .deleteObjects({ Bucket: bucket, Delete: { Objects: batch } })
        .promise();
    }
    deletedClipKeys.push(...clipKeys);
  }

  return { streamUuid: event.streamUuid, assembled, deletedClipKeys, plan };
}
