import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupCommentDto, CreateGroupPostDto, CreateStudyGroupDto, ShareGroupDocumentDto } from './dto/study-group.dto';

@Injectable()
export class StudyGroupService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId?: string) {
    if (!userId) {
      return this.prisma.studyGroup.findMany({
        where: { visibility: 'PUBLIC' },
        include: { members: true }
      });
    }
    return this.prisma.studyGroup.findMany({
      where: { OR: [{ visibility: 'PUBLIC' }, { members: { some: { userId, status: 'APPROVED' } } }] },
      include: { members: true }
    });
  }

  async create(ownerId: string, dto: CreateStudyGroupDto) {
    return this.prisma.studyGroup.create({
      data: {
        ownerId,
        ...dto,
        members: { create: { userId: ownerId, role: 'OWNER', status: 'APPROVED', joinedAt: new Date() } }
      }
    });
  }

  async join(userId: string, groupId: string) {
    const group = await this.prisma.studyGroup.findUniqueOrThrow({ where: { id: groupId } });
    const status = group.visibility === 'PUBLIC' ? 'APPROVED' : 'PENDING';
    return this.prisma.studyGroupMember.upsert({
      where: { groupId_userId: { groupId, userId } },
      update: { status },
      create: { groupId, userId, status, joinedAt: status === 'APPROVED' ? new Date() : null }
    });
  }

  async approveMember(ownerId: string, groupId: string, userId: string) {
    await this.ensureOwner(ownerId, groupId);
    return this.prisma.studyGroupMember.update({ where: { groupId_userId: { groupId, userId } }, data: { status: 'APPROVED', joinedAt: new Date() } });
  }

  async documents(userId: string, groupId: string) {
    await this.ensureMember(userId, groupId);
    return this.prisma.studyGroupDocument.findMany({ where: { groupId }, include: { document: { include: { files: true } } } });
  }

  async shareDocument(userId: string, groupId: string, dto: ShareGroupDocumentDto) {
    await this.ensureOwner(userId, groupId);
    return this.prisma.studyGroupDocument.upsert({
      where: { groupId_documentId: { groupId, documentId: dto.documentId } },
      update: {},
      create: { groupId, documentId: dto.documentId, sharedById: userId }
    });
  }

  async createPost(userId: string, groupId: string, dto: CreateGroupPostDto) {
    await this.ensureMember(userId, groupId);
    return this.prisma.studyGroupPost.create({ data: { groupId, authorId: userId, ...dto } });
  }

  async comment(userId: string, groupPostId: string, dto: CreateGroupCommentDto) {
    const post = await this.prisma.studyGroupPost.findUniqueOrThrow({ where: { id: groupPostId } });
    await this.ensureMember(userId, post.groupId);
    return this.prisma.studyGroupComment.create({ data: { groupPostId, authorId: userId, content: dto.content } });
  }

  private async ensureOwner(userId: string, groupId: string) {
    const group = await this.prisma.studyGroup.findUniqueOrThrow({ where: { id: groupId } });
    if (group.ownerId !== userId) {
      throw new ForbiddenException('Only group owner can perform this action');
    }
  }

  private async ensureMember(userId: string, groupId: string) {
    const membership = await this.prisma.studyGroupMember.findUnique({ where: { groupId_userId: { groupId, userId } } });
    if (!membership || membership.status !== 'APPROVED') {
      throw new ForbiddenException('Study group membership required');
    }
  }
    async leave(userId: string, groupId: string) {
        const group = await this.prisma.studyGroup.findUniqueOrThrow({ where: { id: groupId } });
        if (group.ownerId === userId) {
            throw new ForbiddenException('Owner cannot leave the group');
        }
        return this.prisma.studyGroupMember.update({
            where: { groupId_userId: { groupId, userId } },
            data: { status: 'REMOVED' }
        });
    }

    async removeMember(ownerId: string, groupId: string, userId: string) {
        await this.ensureOwner(ownerId, groupId);
        return this.prisma.studyGroupMember.update({
            where: { groupId_userId: { groupId, userId } },
            data: { status: 'REMOVED' }
        });
    }
}
