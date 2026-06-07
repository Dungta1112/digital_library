import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtService = new JwtService();
  constructor(private readonly configService: ConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string>; user?: unknown }>();
    const authHeader = request.headers.authorization ?? request.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication required');
    }
    try {
      const payload = await this.jwtService.verifyAsync(authHeader.slice(7), {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET') || process.env.JWT_ACCESS_SECRET
      });
      request.user = { id: payload.sub, roles: payload.roles, permissions: payload.permissions };
      return true;
    } catch (error: any) {
      console.error('JWT Verification Error:', error);
      throw new UnauthorizedException(`Invalid token: ${error.message}`);
    }
  }
}
