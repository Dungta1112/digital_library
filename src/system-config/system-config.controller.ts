import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { ok } from '../common/response/api-response';
import { UpdateSystemConfigDto } from './dto/system-config.dto';
import { SystemConfigService } from './system-config.service';

@ApiTags('SystemConfig')
@ApiProtected()
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('system-configs')
export class SystemConfigController {
  constructor(private readonly service: SystemConfigService) {}

  @Get()
  async list() {
    return ok(await this.service.list());
  }

  @Put()
  async update(@CurrentUser() user: RequestUser, @Body() dto: UpdateSystemConfigDto) {
    return ok(await this.service.update(user.id, dto));
  }
}
