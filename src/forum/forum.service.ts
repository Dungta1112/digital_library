import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, CreateForumPostDto, CreateForumReportDto, UpdateForumPostDto } from './dto/forum.dto';

const authorInclude = {
    author: { select: { id: true, fullName: true, roles: { select: { role: { select: { code: true } } } } } }
};

const postInclude = {
    ...authorInclude,
    comments: { where: { deletedAt: null }, include: authorInclude, orderBy: { createdAt: 'asc' as const } }
};

@Injectable()
export class ForumService {
    constructor(private readonly prisma: PrismaService) { }

    private roleOf(user: any): string {
        return user?.roles?.[0]?.role?.code ?? 'STUDENT';
    }

    private mapComment(comment: any) {
        return {
            id: comment.id,
            postId: comment.postId,
            authorName: comment.author?.fullName ?? 'Người dùng ẩn danh',
            authorRole: this.roleOf(comment.author),
            content: comment.content,
            createdAt: comment.createdAt,
            isAccepted: comment.isAccepted,
            likes: 0
        };
    }

    private mapPost(post: any) {
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            status: post.status,
            authorName: post.author?.fullName ?? 'Người dùng ẩn danh',
            authorRole: this.roleOf(post.author),
            category: 'GENERAL',
            tags: [],
            createdAt: post.createdAt,
            likes: 0,
            commentsCount: post.comments?.length ?? 0,
            comments: (post.comments ?? []).map((comment: any) => this.mapComment(comment))
        };
    }

    async list() {
        const posts = await this.prisma.forumPost.findMany({ where: { deletedAt: null }, include: postInclude });
        return posts.map((post) => this.mapPost(post));
    }

    async detail(postId: string) {
        const post = await this.prisma.forumPost.findUnique({ where: { id: postId }, include: postInclude });
        return post ? this.mapPost(post) : null;
    }

    createPost(authorId: string, dto: CreateForumPostDto) {
        return this.prisma.forumPost.create({ data: { authorId, ...dto } });
    }

    async updatePost(authorId: string, postId: string, dto: UpdateForumPostDto) {
        await this.ensureAuthor(authorId, postId);
        return this.prisma.forumPost.update({ where: { id: postId }, data: dto });
    }

    async deletePost(authorId: string, postId: string) {
        await this.ensureAuthor(authorId, postId);
        return this.prisma.forumPost.update({ where: { id: postId }, data: { deletedAt: new Date(), status: 'DELETED' } });
    }

    async comment(authorId: string, postId: string, dto: CreateCommentDto) {
        const post = await this.prisma.forumPost.findUnique({ where: { id: postId } });
        if (!post || post.status === 'LOCKED') {
            throw new ForbiddenException('Post is not open for comments');
        }
        const comment = await this.prisma.forumComment.create({
            data: { postId, authorId, content: dto.content },
            include: authorInclude
        });
        return this.mapComment(comment);
    }

    report(reporterId: string, dto: CreateForumReportDto) {
        return this.prisma.forumReport.create({
            data: {
                reporterId,
                reason: dto.reason,
                description: dto.description,
                postId: dto.targetType === 'POST' ? dto.targetId : undefined,
                commentId: dto.targetType === 'COMMENT' ? dto.targetId : undefined
            }
        });
    }

    private async ensureAuthor(authorId: string, postId: string) {
        const post = await this.prisma.forumPost.findUnique({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        if (post.authorId !== authorId) {
            throw new ForbiddenException('Only the author can modify this post');
        }
    }
    async updateComment(userId: string, commentId: string, content: string) {
        const comment = await this.prisma.forumComment.findUnique({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.authorId !== userId) throw new ForbiddenException('Only author can edit');
        return this.prisma.forumComment.update({ where: { id: commentId }, data: { content } });
    }

    async deleteComment(userId: string, commentId: string, permissions: string[] = []) {
        const comment = await this.prisma.forumComment.findUnique({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comment not found');
        const isModerator = permissions.includes('forum.moderate');
        if (comment.authorId !== userId && !isModerator) throw new ForbiddenException('Only author or moderator can delete');
        return this.prisma.forumComment.update({ where: { id: commentId }, data: { deletedAt: new Date() } });
    }

    async acceptAnswer(userId: string, postId: string, commentId: string) {
        await this.ensureAuthor(userId, postId);
        return this.prisma.forumComment.update({ where: { id: commentId }, data: { isAccepted: true } });
    }
}