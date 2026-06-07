import { Module } from '@nestjs/common';
import { AuditLogModule } from '../common/audit/audit-log.module';
import { StorageModule } from '../storage/storage.module';
import { LecturerDocumentManagementController } from './lecturer-document-management.controller';
import { LecturerDocumentManagementService } from './lecturer-document-management.service';

@Module({
  imports: [StorageModule, AuditLogModule],
  controllers: [LecturerDocumentManagementController],
  providers: [LecturerDocumentManagementService]
})
export class LecturerDocumentManagementModule {}
