import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto, UpdateProfileDto } from './dto/user-profile.dto';
import { toSafeUser } from './user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async current(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: { include: { role: true } } } });
    return toSafeUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({ where: { id: userId }, data: dto, include: { roles: { include: { role: true } } } });
    return toSafeUser(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new UnauthorizedException('Current password is invalid');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await bcrypt.hash(dto.newPassword, Number(process.env.BCRYPT_ROUNDS ?? 12)) }
    });
  }
}
