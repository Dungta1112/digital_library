import { Module } from '@nestjs/common';
import { AuditLogModule } from '../common/audit/audit-log.module';
import { AdminManagementController } from './admin-management.controller';
import { AdminManagementService } from './admin-management.service';

@Module({
  imports: [AuditLogModule],
  controllers: [AdminManagementController],
  providers: [AdminManagementService]
})
export class AdminManagementModule {}
