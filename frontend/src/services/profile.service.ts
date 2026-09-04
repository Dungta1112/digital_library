import { apiClient } from './api-client';
import type { User } from '@/types/auth';
import type { ReadingHistoryItem, LecturerDocumentItem, UpdateProfilePayload } from '@/types/profile';

interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role?: User['role'];
  roles?: Array<string | { code?: string; role?: { code?: string } }>;
}

function normalizeUser(raw: ApiUser): User {
  let role: User['role'] = 'STUDENT';
  if (raw.role) {
    role = raw.role;
  } else if (raw.roles && raw.roles.length > 0) {
    const firstRole = raw.roles[0];
    if (typeof firstRole === 'string') {
      role = firstRole as User['role'];
    } else if (firstRole && typeof firstRole === 'object') {
      if ('role' in firstRole && firstRole.role?.code) {
        role = firstRole.role.code as User['role'];
      } else if ('code' in firstRole && firstRole.code) {
        role = firstRole.code as User['role'];
      }
    }
  }

  return {
    id: raw.id,
    email: raw.email,
    fullName: raw.fullName,
    avatarUrl: raw.avatarUrl,
    role,
  };
}

export const ProfileService = {
  /**
   * Update current user profile (fullName, avatarUrl)
   */
  async updateProfile(data: UpdateProfilePayload): Promise<User> {
    const response = await apiClient.patch<ApiUser>('/users/me', data);
    return normalizeUser(response);
  },

  /**
   * Fetch current user's reading history
   */
  async getReadingHistory(signal?: AbortSignal): Promise<ReadingHistoryItem[]> {
    try {
      const response = await apiClient.get<ReadingHistoryItem[] | { items?: ReadingHistoryItem[]; data?: ReadingHistoryItem[] }>(
        '/documents/me/history',
        { signal }
      );
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.items)) {
        return response.items;
      }
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      console.error('Lỗi khi tải lịch sử đọc:', error);
      throw error;
    }
  },

  /**
   * Fetch lecturer/admin uploaded documents
   */
  async getLecturerDocuments(signal?: AbortSignal): Promise<LecturerDocumentItem[]> {
    try {
      const response = await apiClient.get<LecturerDocumentItem[] | { items?: LecturerDocumentItem[]; data?: LecturerDocumentItem[] }>(
        '/lecturer/documents',
        { signal }
      );
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.items)) {
        return response.items;
      }
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      console.error('Lỗi khi tải danh sách tài liệu giảng viên:', error);
      throw error;
    }
  },

  /**
   * Delete a lecturer document
   */
  async deleteLecturerDocument(documentId: string): Promise<void> {
    await apiClient.delete(`/lecturer/documents/${documentId}`);
  },

  /**
   * Hide a lecturer document
   */
  async hideLecturerDocument(documentId: string): Promise<void> {
    await apiClient.post(`/lecturer/documents/${documentId}/hide`);
  },
};
