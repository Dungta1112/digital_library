import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuditLogService } from '../common/audit/audit-log.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService, StoreFileInput } from '../storage/storage.service';
import { CreateLecturerDocumentDto, UpdateLecturerDocumentDto } from './dto/lecturer-document.dto';

@Injectable()
export class LecturerDocumentManagementService {
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService, private readonly audit: AuditLogService) {}

  list(ownerId: string) {
    return this.prisma.document.findMany({ where: { ownerId }, include: { files: true, reviews: true } });
  }

  async upload(ownerId: string, dto: CreateLecturerDocumentDto, file?: StoreFileInput) {
    const document = await this.prisma.document.create({
      data: { ownerId, title: dto.title, description: dto.description, categoryId: dto.categoryId, metadata: (dto.metadata ?? {}) as Prisma.InputJsonValue, status: 'PENDING_REVIEW' }
    });
    if (file) {
      const stored = await this.storage.store(file);
      await this.prisma.documentFile.create({
        data: {
          documentId: document.id,
          storageProvider: stored.provider,
          bucket: stored.bucket,
          objectKey: stored.objectKey,
          originalName: stored.originalName,
          mimeType: stored.mimeType,
          sizeBytes: stored.sizeBytes
        }
      });
    }
    await this.audit.record({ actorId: ownerId, action: 'DOCUMENT_UPLOAD', targetType: 'document', targetId: document.id });
    return document;
  }

  async update(ownerId: string, documentId: string, dto: UpdateLecturerDocumentDto) {
    await this.ensureOwner(ownerId, documentId);
    return this.prisma.document.update({
      where: { id: documentId },
      data: {
        title: dto.title,
        description: dto.description,
        metadata: dto.metadata === undefined ? undefined : (dto.metadata as Prisma.InputJsonValue)
      }
    });
  }

  async hide(ownerId: string, documentId: string) {
    await this.ensureOwner(ownerId, documentId);
    return this.prisma.document.update({ where: { id: documentId }, data: { status: 'HIDDEN' } });
  }

  async delete(ownerId: string, documentId: string) {
    await this.ensureOwner(ownerId, documentId);
    return this.prisma.document.update({ where: { id: documentId }, data: { status: 'DELETED', deletedAt: new Date() } });
  }

  private async ensureOwner(ownerId: string, documentId: string) {
    const document = await this.prisma.document.findUniqueOrThrow({ where: { id: documentId } });
    if (document.ownerId !== ownerId) {
      throw new ForbiddenException('Only owner can manage this document');
    }
  }
}
