import { Injectable } from '@nestjs/common';
import { AuditLogService } from '../common/audit/audit-log.service';
import { CacheInvalidationService } from '../cache/cache-invalidation.service';
import { PrismaService } from '../prisma/prisma.service';
import { HandleReportDto, RejectDocumentDto } from './dto/content-management.dto';

@Injectable()
export class ContentManagementService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditLogService, private readonly cache: CacheInvalidationService) {}

  pendingDocuments() {
    return this.prisma.document.findMany({ where: { status: 'PENDING_REVIEW' }, include: { files: true, owner: true } });
  }

  async approveDocument(actorId: string, documentId: string) {
    const document = await this.prisma.document.update({ where: { id: documentId }, data: { status: 'APPROVED', approvedById: actorId, approvedAt: new Date() } });
    await this.prisma.documentReview.create({ data: { documentId, reviewerId: actorId, status: 'APPROVED' } });
    await this.audit.record({ actorId, action: 'DOCUMENT_APPROVE', targetType: 'document', targetId: documentId });
    await this.cache.invalidateDocumentViews();
    return document;
  }

  async rejectDocument(actorId: string, documentId: string, dto: RejectDocumentDto) {
    const document = await this.prisma.document.update({ where: { id: documentId }, data: { status: 'REJECTED', rejectionReason: dto.reason } });
    await this.prisma.documentReview.create({ data: { documentId, reviewerId: actorId, status: 'REJECTED', reason: dto.reason } });
    await this.audit.record({ actorId, action: 'DOCUMENT_REJECT', targetType: 'document', targetId: documentId, metadata: { reason: dto.reason } });
    return document;
  }

  async deleteForumPost(actorId: string, postId: string) {
    await this.prisma.forumPost.update({ where: { id: postId }, data: { deletedAt: new Date(), status: 'DELETED' } });
    await this.logModeration(actorId, 'forum_post', postId, 'DELETE');
    await this.audit.record({ actorId, action: 'CONTENT_DELETE', targetType: 'forum_post', targetId: postId });
  }

  async deleteForumComment(actorId: string, commentId: string) {
    await this.prisma.forumComment.update({ where: { id: commentId }, data: { deletedAt: new Date() } });
    await this.logModeration(actorId, 'forum_comment', commentId, 'DELETE');
    await this.audit.record({ actorId, action: 'CONTENT_DELETE', targetType: 'forum_comment', targetId: commentId });
  }

  async lockTopic(actorId: string, postId: string) {
    const post = await this.prisma.forumPost.update({ where: { id: postId }, data: { status: 'LOCKED', lockedById: actorId, lockedAt: new Date() } });
    await this.logModeration(actorId, 'forum_post', postId, 'LOCK');
    return post;
  }

  async reports() {
    const [documentReports, forumReports] = await Promise.all([
      this.prisma.documentReport.findMany(),
      this.prisma.forumReport.findMany()
    ]);
    return { documentReports, forumReports };
  }

  async handleReport(actorId: string, reportId: string, dto: HandleReportDto) {
    const documentReport = await this.prisma.documentReport.findUnique({ where: { id: reportId } });
    if (documentReport) {
      const report = await this.prisma.documentReport.update({ where: { id: reportId }, data: { status: dto.status, resolutionNote: dto.resolutionNote, handledById: actorId } });
      await this.audit.record({ actorId, action: 'REPORT_HANDLE', targetType: 'document_report', targetId: reportId });
      return report;
    }
    const report = await this.prisma.forumReport.update({ where: { id: reportId }, data: { status: dto.status, resolutionNote: dto.resolutionNote, handledById: actorId } });
    await this.audit.record({ actorId, action: 'REPORT_HANDLE', targetType: 'forum_report', targetId: reportId });
    return report;
  }

  private logModeration(moderatorId: string, targetType: string, targetId: string, action: string) {
    return this.prisma.contentModerationLog.create({ data: { moderatorId, targetType, targetId, action } });
  }
}
