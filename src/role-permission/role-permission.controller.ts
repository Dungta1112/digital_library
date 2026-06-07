import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ok } from '../common/response/api-response';
import { RolePermissionService } from './role-permission.service';

@ApiTags('RolePermission')
@UseGuards(JwtAuthGuard)
@Controller()
export class RolePermissionController {
  constructor(private readonly service: RolePermissionService) {}

  @Get('roles')
  async roles() {
    return ok(await this.service.listRoles());
  }

  @Get('permissions')
  async permissions() {
    return ok(await this.service.listPermissions());
  }
}
