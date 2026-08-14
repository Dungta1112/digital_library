import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupCommentDto, CreateGroupPostDto, CreateStudyGroupDto, ShareGroupDocumentDto } from './dto/study-group.dto';

const groupInclude = {
    members: {
        where: { status: 'APPROVED' as const },
        include: { user: { select: { id: true, fullName: true } } }
    }
};

@Injectable()
export class StudyGroupService {
    constructor(private readonly prisma: PrismaService) { }

    private mapGroup(group: any, userId?: string) {
        const members = group.members ?? [];
        return {
            id: group.id,
            name: group.name,
            description: group.description ?? '',
            topic: group.visibility === 'PUBLIC' ? 'GENERAL' : 'PRIVATE',
            ownerId: group.ownerId,
            membersCount: members.length,
            isJoined: userId ? members.some((m: any) => m.userId === userId) : false,
            members: members.map((m: any) => ({
                id: m.userId,
                name: m.user?.fullName ?? 'Người dùng ẩn danh',
                role: m.role === 'OWNER' ? 'ADMIN' : 'MEMBER'
            }))
        };
    }

    async list(userId?: string) {
        const where = userId
            ? { isActive: true, OR: [{ visibility: 'PUBLIC' as const }, { members: { some: { userId, status: 'APPROVED' as const } } }] }
            : { isActive: true, visibility: 'PUBLIC' as const };
        const groups = await this.prisma.studyGroup.findMany({ where, include: groupInclude });
        return groups.map((group) => this.mapGroup(group, userId));
    }

    async detail(groupId: string, userId?: string) {
        const group = await this.prisma.studyGroup.findFirst({ where: { id: groupId, isActive: true }, include: groupInclude });
        return group ? this.mapGroup(group, userId) : null;
    }

    async posts(groupId: string, userId?: string) {
        await this.ensureCanRead(groupId, userId);
        const posts = await this.prisma.studyGroupPost.findMany({
            where: { groupId, deletedAt: null },
            include: { author: { select: { id: true, fullName: true } } },
            orderBy: { createdAt: 'asc' }
        });
        return posts.map((post) => ({
            id: post.id,
            groupId: post.groupId,
            senderId: post.authorId,
            senderName: post.author?.fullName ?? 'Người dùng ẩn danh',
            content: post.content,
            timestamp: post.createdAt
        }));
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

    async deleteGroup(userId: string, groupId: string, roles: string[] = []) {
        await this.ensureOwnerOrAdmin(userId, groupId, roles);
        return this.prisma.studyGroup.update({ where: { id: groupId }, data: { isActive: false } });
    }

    private async ensureCanRead(groupId: string, userId?: string) {
        const group = await this.prisma.studyGroup.findUniqueOrThrow({ where: { id: groupId } });
        if (group.visibility === 'PUBLIC') {
            return;
        }
        if (!userId) {
            throw new ForbiddenException('Study group membership required');
        }
        await this.ensureMember(userId, groupId);
    }

    private async ensureOwner(userId: string, groupId: string) {
        const group = await this.prisma.studyGroup.findUniqueOrThrow({ where: { id: groupId } });
        if (group.ownerId !== userId) {
            throw new ForbiddenException('Only group owner can perform this action');
        }
    }

    private async ensureOwnerOrAdmin(userId: string, groupId: string, roles: string[]) {
        const group = await this.prisma.studyGroup.findUniqueOrThrow({ where: { id: groupId } });
        if (group.ownerId !== userId && !roles.includes('ADMIN')) {
            throw new ForbiddenException('Only group owner or admin can perform this action');
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