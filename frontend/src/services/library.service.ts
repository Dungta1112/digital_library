import { apiClient } from './api.client';
import { runWithMock, toBackendUrl } from './config';
import type { Document, LibraryFilter, PaginatedResult } from '../types/library';

type Category = { id: string; name: string };

interface ApiDocumentFile {
  id?: string;
  objectKey?: string;
  originalName?: string;
  mimeType?: string;
  url?: string;
  fileUrl?: string;
  downloadUrl?: string;
}

interface ApiDocument {
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

type ApiDocumentList =
  | PaginatedResult<ApiDocument>
  | ApiDocument[]
  | {
      items: ApiDocument[];
      meta?: Partial<Omit<PaginatedResult<ApiDocument>, 'data'>>;
    };

function toMockFileUrl(fileName: string) {
  return `/api/mock-files/book/${encodeURIComponent(fileName)}`;
}

function getFileType(fileNameOrUrl?: string): 'pdf' | 'docx' | undefined {
  const cleanValue = fileNameOrUrl?.split('?')[0].split('#')[0].toLowerCase() || '';
  if (cleanValue.endsWith('.docx')) return 'docx';
  if (cleanValue.endsWith('.pdf')) return 'pdf';
  return undefined;
}

function normalizeMockDocuments(documents: Document[]): Document[] {
  return documents.map((document) => {
    const currentUrl = document.pdfUrl || '';
    const fileUrl = document.fileName ? toMockFileUrl(document.fileName) : currentUrl;

    return {
      ...document,
      pdfUrl: fileUrl,
      fileType: document.fileType || getFileType(document.fileName || fileUrl),
    };
  });
}

function getPrimaryFileUrl(document: ApiDocument) {
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

function normalizeApiDocument(document: ApiDocument): Document {
  const category =
    typeof document.category === 'string'
      ? document.category
      : document.category?.name || 'Uncategorized';
  const authors =
    document.authors ||
    document.metadata?.authors ||
    (document.author ? [document.author] : undefined) ||
    (document.owner?.fullName ? [document.owner.fullName] : undefined) ||
    [];
  const year =
    document.publicationYear ||
    document.metadata?.publicationYear ||
    (document.createdAt ? new Date(document.createdAt).getFullYear() : new Date().getFullYear());
  const file = document.files?.[0];
  const fileName = document.fileName || file?.originalName;
  const fileUrl = toBackendUrl(getPrimaryFileUrl(document));

  return {
    id: document.id,
    title: document.title,
    authors,
    abstract: document.abstract || document.description || document.metadata?.abstract || '',
    publicationYear: year,
    category,
    keywords: document.keywords || document.metadata?.keywords || [],
    pdfUrl: fileUrl,
    fileName,
    fileType: document.fileType || getFileType(fileName || fileUrl),
    coverImageUrl: document.coverImageUrl,
    viewCount: document.viewCount || 0,
    saveCount: document.saveCount || document.downloadCount || 0,
  };
}

function normalizeApiDocuments(documents: ApiDocument[]) {
  return documents.map(normalizeApiDocument);
}

async function loadMockDocuments(): Promise<Document[]> {
  const mockModule = await import('../mocks/library.json');
  return normalizeMockDocuments(mockModule.default as Document[]);
}

function filterMockDocuments(documents: Document[], filter: LibraryFilter) {
  const query = filter.query?.trim().toLocaleLowerCase('vi') || '';

  return documents.filter((document) => {
    const matchesQuery =
      !query ||
      document.title.toLocaleLowerCase('vi').includes(query) ||
      document.authors.some((author) => author.toLocaleLowerCase('vi').includes(query)) ||
      document.keywords.some((keyword) => keyword.toLocaleLowerCase('vi').includes(query));
    const matchesCategory = !filter.category || document.category === filter.category;
    const matchesYear = !filter.year || document.publicationYear === filter.year;
    const matchesAuthor =
      !filter.author ||
      document.authors.some((author) =>
        author.toLocaleLowerCase('vi').includes(filter.author!.toLocaleLowerCase('vi'))
      );

    return matchesQuery && matchesCategory && matchesYear && matchesAuthor;
  });
}

export const LibraryService = {
  async getCategories(): Promise<Category[]> {
    return runWithMock(
      async () => {
        const documents = await loadMockDocuments();
        return Array.from(new Set(documents.map((document) => document.category))).map((name) => ({
          id: name,
          name,
        }));
      },
      async () => {
        const response = await apiClient.get<unknown, Category[] | { data: Category[] }>(
          '/categories'
        );
        return Array.isArray(response) ? response : response.data || [];
      }
    );
  },

  async getDocuments(
    filter: LibraryFilter,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<Document>> {
    return runWithMock(
      async () => {
        const documents = filterMockDocuments(await loadMockDocuments(), filter);
        const start = (page - 1) * limit;

        return {
          data: documents.slice(start, start + limit),
          total: documents.length,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(documents.length / limit)),
        };
      },
      async () => {
        const params = new URLSearchParams();
        if (filter.query) params.append('q', filter.query);
        if (filter.category) params.append('categoryId', filter.category);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const response = await apiClient.get<unknown, ApiDocumentList>(
          `/documents?${params.toString()}`
        );

        if (!Array.isArray(response) && 'data' in response && 'totalPages' in response) {
          const items = normalizeApiDocuments(response.data);
          return { ...response, data: items };
        }

        if (!Array.isArray(response) && 'items' in response) {
          const items = normalizeApiDocuments(response.items);
          return {
            data: items,
            total: response.meta?.total || items.length,
            page: response.meta?.page || page,
            limit: response.meta?.limit || limit,
            totalPages: response.meta?.totalPages || Math.max(1, Math.ceil(items.length / limit)),
          };
        }

        const items = Array.isArray(response) ? normalizeApiDocuments(response) : [];
        return { data: items, total: items.length, page, limit, totalPages: 1 };
      }
    );
  },

  async getDocumentById(id: string): Promise<Document | null> {
    return runWithMock(
      async () => {
        const documents = await loadMockDocuments();
        return documents.find((document) => document.id === id) || null;
      },
      async () => {
        try {
          const response = await apiClient.get<unknown, ApiDocument>(`/documents/${id}`);
          return normalizeApiDocument(response);
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    );
  },

  async getDocumentReadUrl(document: Document): Promise<string> {
    return runWithMock(
      () => document.pdfUrl,
      async () => {
        if (document.pdfUrl) {
          return document.pdfUrl;
        }

        const response = await apiClient.get<unknown, { url: string; documentId: string }>(
          `/documents/${document.id}/read`
        );
        return toBackendUrl(response.url);
      }
    );
  },
};
