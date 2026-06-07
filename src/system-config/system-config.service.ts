import { BadRequestException, Injectable } from '@nestjs/common';
import { AuditLogService } from '../common/audit/audit-log.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSystemConfigDto } from './dto/system-config.dto';

@Injectable()
export class SystemConfigService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditLogService) {}

  list() {
    return this.prisma.systemConfig.findMany();
  }

  async update(actorId: string, dto: UpdateSystemConfigDto) {
    this.validate(dto.configs);
    const updates = await Promise.all(
      Object.entries(dto.configs).map(([key, value]) =>
        this.prisma.systemConfig.upsert({
          where: { key },
          update: { value: value as never, updatedById: actorId },
          create: { key, value: value as never, updatedById: actorId }
        })
      )
    );
    await this.audit.record({ actorId, action: 'SYSTEM_CONFIG_UPDATE', targetType: 'system_config', metadata: dto.configs });
    return updates;
  }

  private validate(configs: Record<string, unknown>) {
    if ('upload.max_file_size_bytes' in configs && Number(configs['upload.max_file_size_bytes']) <= 0) {
      throw new BadRequestException('Max file size must be positive');
    }
    if ('upload.allowed_file_types' in configs && !Array.isArray(configs['upload.allowed_file_types'])) {
      throw new BadRequestException('Allowed file types must be an array');
    }
  }
}
