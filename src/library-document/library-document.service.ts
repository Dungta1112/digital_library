import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditLogService } from '../common/audit/audit-log.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateDocumentReportDto, RateDocumentDto } from './dto/document-action.dto';
import { DocumentQueryDto } from './dto/document-query.dto';

@Injectable()
export class LibraryDocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly audit: AuditLogService
  ) {}

  async search(query: DocumentQueryDto) {
    const where: any = {
      status: 'APPROVED',
      deletedAt: null,
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.q ? { OR: [{ title: { contains: query.q, mode: 'insensitive' } }, { description: { contains: query.q, mode: 'insensitive' } }] } : {})
    };
    const [items, total] = await Promise.all([
      this.prisma.document.findMany({ where, skip: (query.page - 1) * query.limit, take: query.limit, include: { files: true, category: true } }),
      this.prisma.document.count({ where })
    ]);
    return { items, total, page: query.page, limit: query.limit };
  }

  async detail(documentId: string) {
    const document = await this.prisma.document.findFirst({ where: { id: documentId, status: 'APPROVED', deletedAt: null }, include: { files: true, category: true } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    await this.prisma.document.update({ where: { id: documentId }, data: { viewCount: { increment: 1 } } });
    return document;
  }

  async read(documentId: string) {
    const document = await this.detail(documentId);
    const file = document.files[0];
    if (!file) {
      throw new NotFoundException('Document file not found');
    }
    return { url: await this.storage.getReadUrl(file.objectKey), documentId };
  }

  async download(userId: string, documentId: string) {
    const result = await this.read(documentId);
    await this.prisma.document.update({ where: { id: documentId }, data: { downloadCount: { increment: 1 } } });
    await this.audit.record({ actorId: userId, action: 'DOCUMENT_DOWNLOAD', targetType: 'document', targetId: documentId });
    return result;
  }

  async favorite(userId: string, documentId: string) {
    await this.ensureApproved(documentId);
    return this.prisma.documentFavorite.upsert({
      where: { userId_documentId: { userId, documentId } },
      update: {},
      create: { userId, documentId }
    });
  }

  async unfavorite(userId: string, documentId: string) {
    await this.prisma.documentFavorite.deleteMany({ where: { userId, documentId } });
  }

  async rate(userId: string, documentId: string, dto: RateDocumentDto) {
    await this.ensureApproved(documentId);
    return this.prisma.documentRating.upsert({
      where: { userId_documentId: { userId, documentId } },
      update: dto,
      create: { userId, documentId, ...dto }
    });
  }

  async report(userId: string, documentId: string, dto: CreateDocumentReportDto) {
    await this.ensureApproved(documentId);
    const report = await this.prisma.documentReport.create({ data: { reporterId: userId, documentId, ...dto } });
    await this.audit.record({ actorId: userId, action: 'DOCUMENT_REPORT', targetType: 'document', targetId: documentId, metadata: { reportId: report.id } });
    return report;
  }

  private async ensureApproved(documentId: string) {
    const document = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    if (document.status !== 'APPROVED') {
      throw new ForbiddenException('Document is not approved');
    }
  }
    async addNote(userId: string, documentId: string, content: string) {
        await this.ensureApproved(documentId);
        return this.prisma.documentNote.create({ data: { userId, documentId, content } });
    }

    async getNotes(userId: string, documentId: string) {
        return this.prisma.documentNote.findMany({ where: { userId, documentId } });
    }

    async deleteNote(userId: string, noteId: string) {
        const note = await this.prisma.documentNote.findUnique({ where: { id: noteId } });
        if (!note || note.userId !== userId) throw new ForbiddenException('Not allowed');
        return this.prisma.documentNote.delete({ where: { id: noteId } });
    }

    async addHistory(userId: string, documentId: string) {
        return this.prisma.documentHistory.create({ data: { userId, documentId } });
    }

    async getHistory(userId: string) {
        return this.prisma.documentHistory.findMany({
            where: { userId },
            include: { document: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}
