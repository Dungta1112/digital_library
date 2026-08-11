import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AiService {
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL ?? 'http://localhost:8000';

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly storage: StorageService
  ) {}

  async syncDocuments(documents: { id: string; title: string; description: string }[]) {
    const { data } = await firstValueFrom<AxiosResponse>(
      this.httpService.post(`${this.aiServiceUrl}/api/ai/sync-books`, documents)
    );
    return data;
  }

  async searchDocuments(query: string, topK = 3) {
    const { data } = await firstValueFrom<AxiosResponse>(
      this.httpService.post(`${this.aiServiceUrl}/api/ai/search-books`, { query, top_k: topK })
    );
    return data;
  }

  async ingestDocument(user: RequestUser, documentId: string) {
    const document = await this.assertCanAccessDocument(user, documentId, { forIngest: true });
    const file = document.files[0];
    if (!file) {
      throw new NotFoundException('Document file not found');
    }
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.mimeType)) {
      throw new BadRequestException('Chỉ hỗ trợ ingest file PDF và DOCX');
    }

    const buffer = await this.storage.getBuffer(file.objectKey);
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(buffer)], { type: file.mimeType }), file.originalName);
    form.append('document_id', document.id);
    form.append('title', document.title);

    return this.proxy(this.httpService.post(`${this.aiServiceUrl}/api/ai/ingest-document`, form));
  }

  async getIngestStatus(documentId: string) {
    return this.proxy(this.httpService.get(`${this.aiServiceUrl}/api/ai/ingest-status/${documentId}`));
  }

  async askDocument(user: RequestUser, query: string, documentId?: string, topK = 5) {
    if (documentId) {
      await this.assertCanAccessDocument(user, documentId);
    }
    return this.proxy(
      this.httpService.post(`${this.aiServiceUrl}/api/ai/ask-document`, {
        query,
        document_id: documentId ?? null,
        top_k: topK
      })
    );
  }

  /**
   * Kiểm tra quyền truy cập nội dung tài liệu:
   * - tồn tại và chưa xóa, nếu không: 404 (không lộ tồn tại);
   * - chưa APPROVED thì chỉ owner hoặc người có documents.approve thấy được;
   * - visibility khác PUBLIC thì chỉ owner hoặc documents.approve;
   * - ingest chỉ dành cho owner hoặc documents.approve.
   */
  private async assertCanAccessDocument(
    user: RequestUser,
    documentId: string,
    opts: { forIngest?: boolean } = {}
  ) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, deletedAt: null },
      include: { files: true }
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const isOwner = document.ownerId === user.id;
    const canModerate = user.permissions?.includes('documents.approve') ?? false;

    if (document.status !== 'APPROVED' && !isOwner && !canModerate) {
      throw new NotFoundException('Document not found');
    }
    if (document.visibility !== 'PUBLIC' && !isOwner && !canModerate) {
      throw new ForbiddenException('Không có quyền truy cập tài liệu này');
    }
    if (opts.forIngest && !isOwner && !canModerate) {
      throw new ForbiddenException('Chỉ chủ tài liệu hoặc quản trị nội dung được ingest tài liệu');
    }
    return document;
  }

  private async proxy(request: ReturnType<HttpService['post']>) {
    try {
      const { data } = await firstValueFrom<AxiosResponse>(request);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      if (axiosError.response) {
        throw new HttpException(
          axiosError.response.data?.detail ?? axiosError.response.data ?? 'AI service error',
          axiosError.response.status
        );
      }
      throw error;
    }
  }
}
