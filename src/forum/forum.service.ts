import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, CreateForumPostDto, CreateForumReportDto, UpdateForumPostDto } from './dto/forum.dto';

@Injectable()
export class ForumService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.forumPost.findMany({ where: { deletedAt: null }, include: { comments: true } });
  }

  detail(postId: string) {
    return this.prisma.forumPost.findUnique({ where: { id: postId }, include: { comments: true } });
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
    return this.prisma.forumComment.create({ data: { postId, authorId, content: dto.content } });
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

    async deleteComment(userId: string, commentId: string) {
        const comment = await this.prisma.forumComment.findUnique({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.authorId !== userId) throw new ForbiddenException('Only author can delete');
        return this.prisma.forumComment.update({ where: { id: commentId }, data: { deletedAt: new Date() } });
    }

    async acceptAnswer(userId: string, postId: string, commentId: string) {
        await this.ensureAuthor(userId, postId);
        return this.prisma.forumComment.update({ where: { id: commentId }, data: { isAccepted: true } });
    }
}
