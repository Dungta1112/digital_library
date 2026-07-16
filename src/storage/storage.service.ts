export interface StoredObject {
  provider: 'LOCAL' | 'MINIO';
  bucket?: string;
  objectKey: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface StoreFileInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export abstract class StorageService {
  abstract store(input: StoreFileInput): Promise<StoredObject>;
  abstract getReadUrl(objectKey: string): Promise<string>;
  abstract delete(objectKey: string): Promise<void>;
}
