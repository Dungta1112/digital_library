import { apiClient } from './api-client';
import { toBackendUrl } from './config';
import type { Document, LibraryFilter, PaginatedResult } from '../types/library';

export type Category = { id: string; name: string };

export interface ApiDocumentFile {
  id?: string;
  objectKey?: string;
  originalName?: string;
  mimeType?: string;
  sizeBytes?: number;
  fileSize?: number;
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
  _count?: { favorites?: number; views?: number };
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

function getFileType(mimeType?: string, fileNameOrUrl?: string): 'pdf' | 'docx' | undefined {
  if (mimeType) {
    const low = mimeType.toLowerCase();
    if (low.includes('pdf')) return 'pdf';
    if (low.includes('wordprocessingml') || low.includes('docx') || low.includes('msword')) return 'docx';
  }
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

  const categoryId =
    typeof document.category === 'object' && document.category
      ? document.category.id
      : undefined;

  // Real authors only - do NOT invent placeholder strings
  const authors =
    document.authors ||
    document.metadata?.authors ||
    (document.author ? [document.author] : undefined);

  // Real publication year only - do NOT invent createdAt / current year
  const rawYear = document.publicationYear ?? document.metadata?.publicationYear;
  const year = typeof rawYear === 'number' && !isNaN(rawYear) && rawYear > 1000 ? rawYear : undefined;

  const file = document.files?.[0];
  const fileName = document.fileName || file?.originalName;
  const rawFileUrl = getPrimaryFileUrl(document);
  const fileUrl = rawFileUrl ? toBackendUrl(rawFileUrl) : '';
  const detectedFileType = document.fileType || getFileType(file?.mimeType, fileName || fileUrl);

  const fileSize = file?.sizeBytes || file?.fileSize;
  const saveCount = document.saveCount ?? document._count?.favorites;
  const downloadCount = document.downloadCount;
  const viewCount = document.viewCount ?? document._count?.views ?? 0;

  return {
    id: document.id,
    title: document.title,
    authors: authors && authors.length > 0 ? authors : undefined,
    ownerName: document.owner?.fullName || document.owner?.email,
    abstract: document.abstract || document.description || document.metadata?.abstract || 'Chưa có phần tóm tắt cho tài liệu này.',
    description: document.description || undefined,
    publicationYear: year,
    category,
    categoryId,
    keywords: document.keywords || document.metadata?.keywords || [],
    pdfUrl: fileUrl,
    fileName,
    fileType: detectedFileType,
    mimeType: file?.mimeType,
    fileSize,
    coverImageUrl: document.coverImageUrl ? toBackendUrl(document.coverImageUrl) : undefined,
    viewCount,
    saveCount,
    downloadCount,
    createdAt: document.createdAt,
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
    limit: number = 10,
    signal?: AbortSignal
  ): Promise<PaginatedResult<Document>> {
    const params: Record<string, string | number> = {
      page,
      limit,
    };
    if (filter.query) params.q = filter.query;
    if (filter.categoryId) params.categoryId = filter.categoryId;
    if (filter.category) params.categoryId = filter.category;

    const response = await apiClient.get<ApiDocumentList>('/documents', { params, signal });

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

  async getFavoriteDocuments(): Promise<Document[]> {
    try {
      const response = await apiClient.get<{ items?: ApiDocument[] } | ApiDocument[]>('/documents/me/favorites');
      const items = Array.isArray(response)
        ? response
        : response?.items && Array.isArray(response.items)
          ? response.items
          : [];
      return normalizeApiDocuments(items);
    } catch (e) {
      console.error('Lỗi tải danh sách tài liệu đã lưu:', e);
      return [];
    }
  },

  async favoriteDocument(id: string): Promise<void> {
    await apiClient.post(`/documents/${id}/favorite`);
  },

  async unfavoriteDocument(id: string): Promise<void> {
    await apiClient.delete(`/documents/${id}/favorite`);
  },

  async getDocumentReadUrl(document: Document, signal?: AbortSignal): Promise<string> {
    if (document.pdfUrl) {
      return document.pdfUrl;
    }

    const response = await apiClient.get<{ url: string; documentId?: string }>(
      `/documents/${document.id}/read`,
      { signal }
    );
    if (response?.url) {
      return toBackendUrl(response.url);
    }
    throw new Error('Không nhận được liên kết đọc từ máy chủ.');
  },

  async getDocumentDownloadUrl(documentId: string): Promise<string> {
    try {
      const response = await apiClient.get<{ url: string }>(`/documents/${documentId}/download`);
      if (response?.url) {
        return toBackendUrl(response.url);
      }
    } catch {
      // ignore
    }
    return toBackendUrl(`/api/v1/documents/${documentId}/download`);
  },
};

export const DocumentService = LibraryService;
