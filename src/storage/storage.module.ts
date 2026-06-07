import { Module } from '@nestjs/common';
import { LocalStorageProvider } from './local-storage.provider';
import { MinioStorageProvider } from './minio-storage.provider';
import { StorageService } from './storage.service';

@Module({
  providers: [
    LocalStorageProvider,
    MinioStorageProvider,
    {
      provide: StorageService,
      inject: [LocalStorageProvider, MinioStorageProvider],
      useFactory: (local: LocalStorageProvider, minio: MinioStorageProvider) => (process.env.STORAGE_DRIVER === 'minio' ? minio : local)
    }
  ],
  exports: [StorageService]
})
export class StorageModule {}
