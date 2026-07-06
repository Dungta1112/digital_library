import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { toSafeUser } from '../users/user.mapper';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) { }

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, Number(process.env.BCRYPT_ROUNDS ?? 12));
    const role = await this.prisma.role.findUniqueOrThrow({ where: { code: dto.role } });
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
        roles: { create: { roleId: role.id } }
      },
      include: { roles: { include: { role: true } } }
    });
    return toSafeUser(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
    });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.status === 'LOCKED' || user.status === 'DISABLED') {
      throw new ForbiddenException('Account is locked');
    }
    const tokens = await this.issueTokens(user);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken, Number(process.env.BCRYPT_ROUNDS ?? 12)),
        lastLoginAt: new Date()
      }
    });
    return { ...tokens, user: toSafeUser(user) };
  }

  async refresh(dto: RefreshTokenDto) {
    const payload = await this.jwt.verifyAsync(dto.refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
    });
    if (!user?.refreshTokenHash || !(await bcrypt.compare(dto.refreshToken, user.refreshTokenHash))) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
  }

  private async issueTokens(user: any) {
    const roles = user.roles?.map((item: any) => item.role.code) ?? [];
    const permissions = user.roles?.flatMap((item: any) => item.role.permissions?.map((rp: any) => rp.permission.code) ?? []) ?? [];
    const payload = { sub: user.id, email: user.email, roles, permissions };
    return {
      accessToken: await this.jwt.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m'
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d'
      })
    };
  }
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If email exists, reset link will be sent' };

    const token = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' }
    );

    // TODO: gửi email chứa token này cho user
    return { token };
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = await this.jwt.verifyAsync(token, { secret: process.env.JWT_ACCESS_SECRET });
    const passwordHash = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_ROUNDS ?? 12));
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { passwordHash }
    });
    return { message: 'Password updated' };
  }
}
