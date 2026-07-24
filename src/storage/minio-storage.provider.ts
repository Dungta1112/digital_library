import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { StorageService, StoreFileInput, StoredObject } from './storage.service';

@Injectable()
export class MinioStorageProvider implements StorageService {
  private readonly bucket = process.env.MINIO_BUCKET ?? 'documents';
  private readonly client = new Client({
    endPoint: process.env.MINIO_ENDPOINT ?? 'localhost',
    port: Number(process.env.MINIO_PORT ?? 9000),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin'
  });

  async store(input: StoreFileInput): Promise<StoredObject> {
    const objectKey = `${Date.now()}-${input.originalName}`;
    await this.client.putObject(this.bucket, objectKey, input.buffer, input.sizeBytes, { 'Content-Type': input.mimeType });
    return {
      provider: 'MINIO',
      bucket: this.bucket,
      objectKey,
      originalName: input.originalName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes
    };
  }

  async getReadUrl(objectKey: string): Promise<string> {
    return this.client.presignedGetObject(this.bucket, objectKey, 60 * 5);
  }

  async delete(objectKey: string): Promise<void> {
    await this.client.removeObject(this.bucket, objectKey);
  }
}
