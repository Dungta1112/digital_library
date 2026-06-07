import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ok } from '../common/response/api-response';
import { ChangePasswordDto, UpdateProfileDto } from './dto/user-profile.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiProtected()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: RequestUser) {
    return ok(await this.usersService.current(user.id));
  }

  @Patch('me')
  async updateProfile(@CurrentUser() user: RequestUser, @Body() dto: UpdateProfileDto) {
    return ok(await this.usersService.updateProfile(user.id, dto), 'Profile updated');
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(@CurrentUser() user: RequestUser, @Body() dto: ChangePasswordDto) {
    await this.usersService.changePassword(user.id, dto);
  }
}
