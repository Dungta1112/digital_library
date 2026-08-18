import { apiClient } from './api-client';
import { toBackendUrl } from './config';
import type { Document, LibraryFilter, PaginatedResult } from '../types/library';

export type Category = { id: string; name: string };

export interface ApiDocumentFile {
  id?: string;
  objectKey?: string;
  originalName?: string;
  mimeType?: string;
  url?: string;
  fileUrl?: string;
  downloadUrl?: string;
}

export interface ApiDocument {
  id: string;
  title: string;
  authors?: string[];
  author?: string;
  owner?: { fullName?: string; email?: string };
  description?: string | null;
  abstract?: string | null;
  publicationYear?: number;
  createdAt?: string;
  category?: string | { id?: string; name?: string };
  keywords?: string[];
  metadata?: {
    authors?: string[];
    keywords?: string[];
    publicationYear?: number;
    abstract?: string;
  } | null;
  files?: ApiDocumentFile[];
  pdfUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'docx';
  fileUrl?: string;
  downloadUrl?: string;
  coverImageUrl?: string;
  viewCount?: number;
  saveCount?: number;
  downloadCount?: number;
}

export type ApiDocumentList =
  | PaginatedResult<ApiDocument>
  | ApiDocument[]
  | {
      items: ApiDocument[];
      meta?: Partial<Omit<PaginatedResult<ApiDocument>, 'data'>>;
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };

function getFileType(fileNameOrUrl?: string): 'pdf' | 'docx' | undefined {
  const cleanValue = fileNameOrUrl?.split('?')[0].split('#')[0].toLowerCase() || '';
  if (cleanValue.endsWith('.docx')) return 'docx';
  if (cleanValue.endsWith('.pdf')) return 'pdf';
  return undefined;
}

function getPrimaryFileUrl(document: ApiDocument): string {
  const file = document.files?.[0];
  return (
    document.pdfUrl ||
    document.fileUrl ||
    document.downloadUrl ||
    file?.url ||
    file?.fileUrl ||
    file?.downloadUrl ||
    ''
  );
}

export function normalizeApiDocument(document: ApiDocument): Document {
  const category =
    typeof document.category === 'string'
      ? document.category
      : document.category?.name || 'Tài liệu chung';

  const authors =
    document.authors ||
    document.metadata?.authors ||
    (document.author ? [document.author] : undefined) ||
    (document.owner?.fullName ? [document.owner.fullName] : undefined) ||
    ['Tác giả cập nhật'];

  const year =
    document.publicationYear ||
    document.metadata?.publicationYear ||
    (document.createdAt ? new Date(document.createdAt).getFullYear() : new Date().getFullYear());

  const file = document.files?.[0];
  const fileName = document.fileName || file?.originalName;
  const rawFileUrl = getPrimaryFileUrl(document);
  const fileUrl = rawFileUrl ? toBackendUrl(rawFileUrl) : '';

  return {
    id: document.id,
    title: document.title,
    authors,
    abstract: document.abstract || document.description || document.metadata?.abstract || 'Chưa có phần tóm tắt cho tài liệu này.',
    publicationYear: year,
    category,
    keywords: document.keywords || document.metadata?.keywords || [],
    pdfUrl: fileUrl,
    fileName,
    fileType: document.fileType || getFileType(fileName || fileUrl),
    coverImageUrl: document.coverImageUrl ? toBackendUrl(document.coverImageUrl) : undefined,
    viewCount: document.viewCount || 0,
    saveCount: document.saveCount || document.downloadCount || 0,
  };
}

export function normalizeApiDocuments(documents: ApiDocument[]): Document[] {
  return documents.map(normalizeApiDocument);
}

export const LibraryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[] | { data: Category[] } | { items: Category[] }>('/categories');
      if (Array.isArray(response)) return response;
      if (response && 'data' in response && Array.isArray(response.data)) return response.data;
      if (response && 'items' in response && Array.isArray(response.items)) return response.items;
      return [];
    } catch (e) {
      console.error('Lỗi khi tải danh mục:', e);
      return [];
    }
  },

  async getDocuments(
    filter: LibraryFilter = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<Document>> {
    const params: Record<string, string | number> = {
      page,
      limit,
    };
    if (filter.query) params.q = filter.query;
    if (filter.category) params.categoryId = filter.category;

    const response = await apiClient.get<ApiDocumentList>('/documents', { params });

    if (!Array.isArray(response) && 'data' in response && Array.isArray(response.data)) {
      const items = normalizeApiDocuments(response.data);
      return {
        data: items,
        total: response.total ?? items.length,
        page: response.page ?? page,
        limit: response.limit ?? limit,
        totalPages: response.totalPages ?? Math.max(1, Math.ceil((response.total ?? items.length) / limit)),
      };
    }

    if (!Array.isArray(response) && 'items' in response && Array.isArray(response.items)) {
      const items = normalizeApiDocuments(response.items);
      const total = response.total ?? response.meta?.total ?? items.length;
      return {
        data: items,
        total,
        page: response.page ?? response.meta?.page ?? page,
        limit: response.limit ?? response.meta?.limit ?? limit,
        totalPages: response.totalPages ?? response.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit)),
      };
    }

    const items = Array.isArray(response) ? normalizeApiDocuments(response) : [];
    return {
      data: items,
      total: items.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(items.length / limit)),
    };
  },

  async getDocumentById(id: string): Promise<Document | null> {
    try {
      const response = await apiClient.get<ApiDocument>(`/documents/${id}`);
      return response ? normalizeApiDocument(response) : null;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin tài liệu ${id}:`, error);
      return null;
    }
  },

  async getDocumentReadUrl(document: Document): Promise<string> {
    if (document.pdfUrl) {
      return document.pdfUrl;
    }

    try {
      const response = await apiClient.get<{ url: string; documentId?: string }>(
        `/documents/${document.id}/read`
      );
      return toBackendUrl(response.url);
    } catch {
      return toBackendUrl(`/storage/documents/${document.id}.pdf`);
    }
  },
};

export const DocumentService = LibraryService;
