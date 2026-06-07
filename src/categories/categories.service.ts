import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.documentCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  }
}
