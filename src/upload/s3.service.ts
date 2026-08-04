import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface S3ServiceConfig {
  region?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  forcePathStyle?: boolean;
}

export class S3Service {
  private client: S3Client;

  constructor(cfg: S3ServiceConfig = {}) {
    const credentials = cfg.accessKeyId && cfg.secretAccessKey ? { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey } : undefined;

    this.client = new S3Client({
      region: cfg.region ?? 'us-east-1',
      endpoint: cfg.endpoint,
      credentials,
      forcePathStyle: cfg.forcePathStyle,
    } as any);
  }

  async putObject(bucket: string, key: string, body: Buffer | Uint8Array, contentType?: string) {
    const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType });
    await this.client.send(cmd);
  }

  async getSignedUrl(bucket: string, key: string, expiresSeconds = 3600) {
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(this.client, cmd, { expiresIn: expiresSeconds });
  }
}
