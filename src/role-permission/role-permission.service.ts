import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolePermissionService {
  constructor(private readonly prisma: PrismaService) {}

  listRoles() {
    return this.prisma.role.findMany({ include: { permissions: { include: { permission: true } } } });
  }

  listPermissions() {
    return this.prisma.permission.findMany();
  }
}
