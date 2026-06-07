import { Module } from '@nestjs/common';
import { AuditLogModule } from '../common/audit/audit-log.module';
import { StorageModule } from '../storage/storage.module';
import { LibraryDocumentController } from './library-document.controller';
import { LibraryDocumentService } from './library-document.service';

@Module({
  imports: [StorageModule, AuditLogModule],
  controllers: [LibraryDocumentController],
  providers: [LibraryDocumentService],
  exports: [LibraryDocumentService]
})
export class LibraryDocumentModule {}
