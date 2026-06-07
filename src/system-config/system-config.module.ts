import { Module } from '@nestjs/common';
import { AuditLogModule } from '../common/audit/audit-log.module';
import { SystemConfigController } from './system-config.controller';
import { SystemConfigService } from './system-config.service';

@Module({
  imports: [AuditLogModule],
  controllers: [SystemConfigController],
  providers: [SystemConfigService]
})
export class SystemConfigModule {}
