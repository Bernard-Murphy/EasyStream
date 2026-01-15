import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { s3 } from '../s3/s3';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  constructor(private readonly config: ConfigService) {}

  makeKey(prefix: string, ext: string) {
    return `${prefix}/${Date.now()}-${randomUUID()}${ext}`;
  }

  getStorjUrlFromKey(key: string): string | null {
    const assetUrl = this.config.get<string>('STORJ_ASSET_URL');
    if (assetUrl) {
      return `${assetUrl.replace(/\/$/, '')}/${key}`;
    }
    const endpoint = this.config.get<string>('STORJ_ENDPOINT');
    const bucket = this.config.get<string>('STORJ_BUCKET');
    if (!endpoint || !bucket) {
      return null;
    }
    return `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`;
  }

  async putBuffer(params: {
    key: string;
    contentType: string;
    body: Buffer;
  }): Promise<{ url: string; key: string }> {
    const bucket = this.config.get<string>('STORJ_BUCKET');
    const endpoint = this.config.get<string>('STORJ_ENDPOINT');
    const accessKey = this.config.get<string>('STORJ_SECRET_ACCESS_ID');
    const secretKey = this.config.get<string>('STORJ_SECRET_ACCESS_KEY');

    if (bucket && endpoint && accessKey && secretKey) {
      await s3
        .putObject({
          Bucket: bucket,
          Key: params.key,
          Body: params.body,
          ContentType: params.contentType,
        })
        .promise();

      const url =
        this.getStorjUrlFromKey(params.key) ??
        `${endpoint.replace(/\/$/, '')}/${bucket}/${params.key}`;
      return { url, key: params.key };
    }

    const root = '/tmp/easystream-uploads';
    const filePath = path.join(root, params.key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, params.body);
    const url = `http://localhost:${this.config.get('API_PORT') ?? 4000}/uploads/${params.key}`;
    return { url, key: params.key };
  }

  async putFile(params: {
    key: string;
    contentType: string;
    filePath: string;
  }): Promise<{ url: string; key: string }> {
    const bucket = this.config.get<string>('STORJ_BUCKET');
    const endpoint = this.config.get<string>('STORJ_ENDPOINT');
    const accessKey = this.config.get<string>('STORJ_SECRET_ACCESS_ID');
    const secretKey = this.config.get<string>('STORJ_SECRET_ACCESS_KEY');

    if (bucket && endpoint && accessKey && secretKey) {
      await s3
        .upload({
          Bucket: bucket,
          Key: params.key,
          Body: fsSync.createReadStream(params.filePath),
          ContentType: params.contentType,
        })
        .promise();

      const url =
        this.getStorjUrlFromKey(params.key) ??
        `${endpoint.replace(/\/$/, '')}/${bucket}/${params.key}`;
      return { url, key: params.key };
    }

    const root = '/tmp/easystream-uploads';
    const outPath = path.join(root, params.key);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.copyFile(params.filePath, outPath);
    const url = `http://localhost:${this.config.get('API_PORT') ?? 4000}/uploads/${params.key}`;
    return { url, key: params.key };
  }

  getLocalPathFromKey(key: string) {
    return path.join('/tmp/easystream-uploads', key);
  }

  extractKeyFromUrl(url: string): string | null {
    // local fallback
    const marker = '/uploads/';
    const idx = url.indexOf(marker);
    if (idx >= 0) return url.slice(idx + marker.length);

    const endpoint = this.config.get<string>('STORJ_ENDPOINT');
    const bucket = this.config.get<string>('STORJ_BUCKET');
    const assetUrl = this.config.get<string>('STORJ_ASSET_URL');
    if (assetUrl) {
      const withoutSlash = assetUrl.replace(/\/$/, '');
      const prefix = `${withoutSlash}/`;
      if (url.startsWith(prefix)) return url.slice(prefix.length);
    }
    if (endpoint && bucket) {
      const base = `${endpoint.replace(/\/$/, '')}/${bucket}/`;
      if (url.startsWith(base)) return url.slice(base.length);
    }
    return null;
  }
}
