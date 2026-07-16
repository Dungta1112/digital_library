import { apiClient } from './api.client';
import { runWithMock } from './config';
import type { Document, LibraryFilter, PaginatedResult } from '../types/library';

type Category = { id: string; name: string };
type ApiDocumentList =
  | PaginatedResult<Document>
  | Document[]
  | {
      items: Document[];
      meta?: Partial<Omit<PaginatedResult<Document>, 'data'>>;
    };

async function loadMockDocuments(): Promise<Document[]> {
  const mockModule = await import('../mocks/library.json');
  return mockModule.default as Document[];
}

/**
 * Lọc dữ liệu giả ngay trên trình duyệt.
 * Khi cần thêm bộ lọc mới, chỉ cần mở rộng hàm này và LibraryFilter.
 */
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
        const response = await apiClient.get<unknown, Category[] | { data: Category[] }>('/categories');
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
          return response;
        }

        if (!Array.isArray(response) && 'items' in response) {
          return {
            data: response.items,
            total: response.meta?.total || response.items.length,
            page: response.meta?.page || page,
            limit: response.meta?.limit || limit,
            totalPages: response.meta?.totalPages || 1,
          };
        }

        const items = Array.isArray(response) ? response : [];
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
          return await apiClient.get<unknown, Document>(`/documents/${id}`);
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    );
  },
};
