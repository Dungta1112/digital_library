import { apiClient } from './api.client';
import type { Document, LibraryFilter, PaginatedResult } from '../types/library';

export const LibraryService = {
  async getCategories(): Promise<{id: string, name: string}[]> {
    try {
      const res = await apiClient.get<any, any>('/categories');
      return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getDocuments(filter: LibraryFilter, page: number = 1, limit: number = 10): Promise<PaginatedResult<Document>> {
    const params = new URLSearchParams();
    if (filter.query) params.append('q', filter.query);
    if (filter.category) params.append('categoryId', filter.category);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    // Assume backend returns pagination meta in res.meta and items in res.items
    // or just an array. We map it to our PaginatedResult format.
    const res = await apiClient.get<any, any>(`/documents?${params.toString()}`);
    
    // If backend already matches PaginatedResult
    if (res && 'data' in res && 'totalPages' in res) {
       return res;
    }
    
    // If backend returns { items, meta: { total, page, limit, totalPages } }
    if (res && 'items' in res) {
      return {
        data: res.items,
        total: res.meta?.total || res.items.length,
        page: res.meta?.page || page,
        limit: res.meta?.limit || limit,
        totalPages: res.meta?.totalPages || 1
      };
    }

    // Fallback if backend returns an array directly
    const items = Array.isArray(res) ? res : [];
    return {
      data: items,
      total: items.length,
      page,
      limit,
      totalPages: 1
    };
  },
  
  async getDocumentById(id: string): Promise<Document | null> {
    try {
      const res = await apiClient.get<any, Document>(`/documents/${id}`);
      return res;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
};
