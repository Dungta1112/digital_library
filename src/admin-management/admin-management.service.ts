import { Injectable } from '@nestjs/common';
import { AuditLogService } from '../common/audit/audit-log.service';
import { PrismaService } from '../prisma/prisma.service';
import { AssignRolesDto, SearchUsersDto, UpdateAccountStatusDto } from './dto/admin-management.dto';

@Injectable()
export class AdminManagementService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditLogService) {}

  async search(query: SearchUsersDto) {
    const where: any = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.q ? { OR: [{ email: { contains: query.q, mode: 'insensitive' } }, { fullName: { contains: query.q, mode: 'insensitive' } }] } : {})
    };
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip: (query.page - 1) * query.limit, take: query.limit, include: { roles: { include: { role: true } } } }),
      this.prisma.user.count({ where })
    ]);
    return { items, total, page: query.page, limit: query.limit };
  }

  detail(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, include: { roles: { include: { role: true } } } });
  }

  updateStatus(actorId: string, userId: string, dto: UpdateAccountStatusDto) {
    return this.setStatus(actorId, userId, dto.status);
  }

  async setStatus(actorId: string, userId: string, status: 'ACTIVE' | 'LOCKED' | 'DISABLED') {
    const user = await this.prisma.user.update({ where: { id: userId }, data: { status } });
    await this.audit.record({ actorId, action: status === 'LOCKED' ? 'ACCOUNT_LOCK' : 'ACCOUNT_UNLOCK', targetType: 'user', targetId: userId });
    return user;
  }

  async assignRoles(actorId: string, userId: string, dto: AssignRolesDto) {
    await this.prisma.userRole.deleteMany({ where: { userId } });
    await this.prisma.userRole.createMany({ data: dto.roleIds.map((roleId) => ({ userId, roleId, assignedById: actorId })) });
    await this.audit.record({ actorId, action: 'ROLE_ASSIGN', targetType: 'user', targetId: userId, metadata: { roleIds: dto.roleIds } });
    return this.detail(userId);
  }
}
