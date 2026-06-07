import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { ok } from '../common/response/api-response';
import { AdminManagementService } from './admin-management.service';
import { AssignRolesDto, SearchUsersDto, UpdateAccountStatusDto } from './dto/admin-management.dto';

@ApiTags('AdminManagement')
@ApiProtected()
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('admin/users')
export class AdminManagementController {
  constructor(private readonly service: AdminManagementService) {}

  @Get()
  async search(@Query() query: SearchUsersDto) {
    return ok(await this.service.search(query));
  }

  @Get(':userId')
  async detail(@Param('userId') userId: string) {
    return ok(await this.service.detail(userId));
  }

  @Patch(':userId')
  async updateStatus(@CurrentUser() user: RequestUser, @Param('userId') userId: string, @Body() dto: UpdateAccountStatusDto) {
    return ok(await this.service.updateStatus(user.id, userId, dto));
  }

  @Post(':userId/lock')
  async lock(@CurrentUser() user: RequestUser, @Param('userId') userId: string) {
    return ok(await this.service.setStatus(user.id, userId, 'LOCKED'));
  }

  @Post(':userId/unlock')
  async unlock(@CurrentUser() user: RequestUser, @Param('userId') userId: string) {
    return ok(await this.service.setStatus(user.id, userId, 'ACTIVE'));
  }

  @Put(':userId/roles')
  async roles(@CurrentUser() user: RequestUser, @Param('userId') userId: string, @Body() dto: AssignRolesDto) {
    return ok(await this.service.assignRoles(user.id, userId, dto));
  }
}
