import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { created, ok } from '../common/response/api-response';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return created(await this.authService.register(dto), 'Account created');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return ok(await this.authService.login(dto), 'Logged in');
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return ok(await this.authService.refresh(dto), 'Token refreshed');
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentUser() user: RequestUser) {
    await this.authService.logout(user.id);
  }

  @Post('debug-token')
  async debugToken(@Body() dto: { token: string }) {
    try {
      const jwt = require('@nestjs/jwt');
      const service = new jwt.JwtService();
      const payload = await service.verifyAsync(dto.token, { secret: process.env.JWT_ACCESS_SECRET });
      return ok(payload, 'Valid');
    } catch (e: any) {
      return ok({ error: e.message, secretLength: process.env.JWT_ACCESS_SECRET?.length }, 'Invalid');
    }
  }
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dto: { email: string }) {
        return ok(await this.authService.forgotPassword(dto.email), 'Reset email sent');
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: { token: string; newPassword: string }) {
        return ok(await this.authService.resetPassword(dto.token, dto.newPassword), 'Password reset');
    }
}
