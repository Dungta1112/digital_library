import { Injectable } from '@nestjs/common';
import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { StorageService, StoreFileInput, StoredObject } from './storage.service';

@Injectable()
export class LocalStorageProvider implements StorageService {
  private readonly root = process.env.LOCAL_STORAGE_PATH ?? './storage';

  async store(input: StoreFileInput): Promise<StoredObject> {
    await mkdir(this.root, { recursive: true });
    const objectKey = `${Date.now()}-${input.originalName}`;
    await writeFile(join(this.root, objectKey), input.buffer);
    return {
      provider: 'LOCAL',
      objectKey,
      originalName: input.originalName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes
    };
  }

  async getReadUrl(objectKey: string): Promise<string> {
    return `/storage/${objectKey}`;
  }

  async delete(objectKey: string): Promise<void> {
    await rm(join(this.root, objectKey), { force: true });
  }
}
