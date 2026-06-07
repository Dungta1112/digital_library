import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/cache.module';
import { AuditLogModule } from '../common/audit/audit-log.module';
import { ContentManagementController } from './content-management.controller';
import { ContentManagementService } from './content-management.service';

@Module({
  imports: [AuditLogModule, CacheModule],
  controllers: [ContentManagementController],
  providers: [ContentManagementService]
})
export class ContentManagementModule {}
