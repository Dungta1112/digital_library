import { apiClient } from './api-client';
import type {
  AdminDocRecord,
  AdminForumPost,
  AdminReport,
  AdminUserRecord,
  RoleOption,
  SystemConfigParam,
  SystemStats,
} from '../types/admin';

type ListResponse<T> = T[] | { items?: T[]; data?: T[] };

function unwrapItems<T>(response: ListResponse<T>): T[] {
  if (Array.isArray(response)) return response;
  if (response && 'data' in response && Array.isArray(response.data)) return response.data;
  if (response && 'items' in response && Array.isArray(response.items)) return response.items;
  return [];
}

export interface AdminDocumentItem {
  id: string;
  title: string;
  author: string;
  authors?: string[];
  categoryId?: string;
  categoryName: string;
  category?: { id?: string; name?: string };
  totalPages?: number;
  fileSizeMb?: number;
  description?: string;
  status: 'APPROVED' | 'PENDING' | 'PENDING_REVIEW' | 'REJECTED' | 'HIDDEN';
  createdAt: string;
  viewCount?: number;
  downloadCount?: number;
  files?: Array<{ id?: string; objectKey?: string; originalName?: string; sizeBytes?: number }>;
}

interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  status?: AdminUserRecord['status'];
  createdAt?: string;
  roles?: Array<{ roleId?: string; role?: { id?: string; code?: string; name?: string }; code?: string } | string>;
}

interface ApiDocument {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  status: string;
  categoryId?: string;
  category?: { id?: string; name?: string };
  metadata?: { authors?: string[]; publicationYear?: number; abstract?: string };
  owner?: { fullName?: string; email?: string };
  files?: Array<{ id?: string; objectKey?: string; originalName?: string; sizeBytes?: number }>;
  viewCount?: number;
  downloadCount?: number;
}

interface ApiForumPost {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  status?: AdminForumPost['status'];
  author?: { fullName?: string };
  _count?: { reports?: number };
}

interface ApiDocumentReport {
  id: string;
  documentId: string;
  reporterId?: string;
  reporter?: { fullName?: string };
  document?: { title?: string };
  reason: string;
  description?: string;
  createdAt: string;
  status: AdminReport['status'];
}

interface ApiForumReport {
  id: string;
  postId?: string;
  commentId?: string;
  reporterId?: string;
  reporter?: { fullName?: string };
  post?: { title?: string };
  reason: string;
  description?: string;
  createdAt: string;
  status: AdminReport['status'];
}

interface ApiReportsResponse {
  documentReports?: ApiDocumentReport[];
  forumReports?: ApiForumReport[];
}

interface ApiConfig {
  key: string;
  description?: string;
  value: unknown;
  updatedAt?: string;
}

export const SYSTEM_CONFIG_SCHEMA: Record<string, 'string' | 'number' | 'boolean' | 'array'> = {
  'upload.allowed_file_types': 'string',
  'upload.max_file_size_bytes': 'number',
  'ai.ollama_model': 'string',
  'ai.rate_limit_student': 'number',
  'ai.rate_limit_lecturer': 'number',
  'ai.rate_limit_admin': 'number',
  'ai.max_tokens': 'number',
  'system.maintenance_mode': 'boolean',
  'ai.allowed_doc_types': 'array',
  AUTH_ALLOW_REGISTRATION: 'boolean',
  MAINTENANCE_MODE: 'boolean',
  ENABLE_AI_FEATURES: 'boolean',
  ENABLE_REGISTRATION: 'boolean',
  ALLOW_PUBLIC_VIEW: 'boolean',
  MAX_UPLOAD_SIZE_MB: 'number',
  AUTH_MAX_FAILED_LOGINS: 'number',
  JWT_ACCESS_EXPIRES_IN: 'number',
  JWT_REFRESH_EXPIRES_IN: 'number',
  MAX_FILE_SIZE_MB: 'number',
  ALLOWED_FILE_EXTENSIONS: 'array',
  ALLOWED_FILE_TYPES: 'array',
  CORS_ORIGINS: 'array',
};

export function parseConfigValue(key: string, raw: string): unknown {
  const trimmed = typeof raw === 'string' ? raw.trim() : String(raw);
  const schemaType = SYSTEM_CONFIG_SCHEMA[key] || 'string';

  switch (schemaType) {
    case 'boolean':
      return trimmed.toLowerCase() === 'true' || trimmed === '1';
    case 'number': {
      const num = Number(trimmed);
      return isNaN(num) ? raw : num;
    }
    case 'array':
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
      return [trimmed];
    case 'string':
    default:
      return raw;
  }
}

export const AdminService = {
  // 1. Thống kê hệ thống
  async getStats(signal?: AbortSignal): Promise<SystemStats> {
    const response = await apiClient.get<{
        users?: number;
        documents?: number;
        studyGroups?: number;
        views?: number;
    }>('/statistics/overview', { signal });

    return {
      totalUsers: response?.users ?? 0,
      totalDocuments: response?.documents ?? 0,
      totalGroups: response?.studyGroups ?? 0,
      activeUsersToday: response?.views ?? 0,
    };
  },

  // 2. Quản lý Tài liệu (Admin Documents CRUD)
  async getDocuments(): Promise<AdminDocumentItem[]> {
    const response = await apiClient.get<ListResponse<ApiDocument>>('/documents');
    const items = unwrapItems(response);

    return items.map((doc) => {
        const file = doc.files?.[0];
        const fileSizeMb = file?.sizeBytes ? Number((file.sizeBytes / (1024 * 1024)).toFixed(1)) : undefined;
        const author = doc.metadata?.authors?.join(', ') || doc.owner?.fullName || 'Chưa cập nhật';

        return {
          id: doc.id,
          title: doc.title,
          author,
          authors: doc.metadata?.authors,
          categoryId: doc.categoryId,
          categoryName: doc.category?.name || 'Chưa cập nhật',
          category: doc.category,
          fileSizeMb,
          description: doc.description || doc.metadata?.abstract || '',
          status: (doc.status === 'PENDING_REVIEW' ? 'PENDING' : doc.status) as 'APPROVED' | 'PENDING' | 'REJECTED',
          createdAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : '',
          viewCount: doc.viewCount ?? 0,
          downloadCount: doc.downloadCount ?? 0,
          files: doc.files,
        };
    });
  },

  async uploadDocument(formData: FormData): Promise<unknown> {
    return apiClient.post('/lecturer/documents', formData);
  },

  async updateDocument(documentId: string, data: { title?: string; categoryId?: string; description?: string }): Promise<unknown> {
    return apiClient.patch(`/lecturer/documents/${documentId}`, data);
  },

  async deleteDocument(documentId: string): Promise<unknown> {
    return apiClient.delete(`/lecturer/documents/${documentId}`);
  },

  // 3. Hàng đợi kiểm duyệt (Moderation)
  async getPendingDocuments(signal?: AbortSignal): Promise<AdminDocRecord[]> {
    const response = await apiClient.get<ListResponse<ApiDocument>>('/content/documents/pending', { signal });
    return unwrapItems(response).map((doc) => ({
        id: doc.id,
        title: doc.title,
        uploadedBy: doc.owner?.fullName || doc.owner?.email || 'Chưa cập nhật',
        uploadedAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : '',
        uploadDate: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : '',
        status: 'PENDING',
    }));
  },

  async approveDocument(documentId: string): Promise<void> {
    await apiClient.post(`/content/documents/${documentId}/approve`);
  },

  async rejectDocument(documentId: string, reason: string): Promise<void> {
    await apiClient.post(`/content/documents/${documentId}/reject`, { reason });
  },

  // 4. Quản lý Người dùng & Phân quyền RBAC
  async getRoles(): Promise<RoleOption[]> {
    const response = await apiClient.get<RoleOption[]>('/roles');
    return Array.isArray(response) ? response : [];
  },

  async getUsers(): Promise<AdminUserRecord[]> {
    const response = await apiClient.get<ListResponse<ApiUser>>('/admin/users');
    return unwrapItems(response).map((user) => {
        const firstRole = user.roles?.[0];
        let roleCode = 'UNKNOWN';
        if (typeof firstRole === 'string') {
          roleCode = firstRole;
        } else if (firstRole?.role?.code) {
          roleCode = firstRole.role.code;
        } else if (firstRole?.code) {
          roleCode = firstRole.code;
        }

        const dateFormatted = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '';
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName || user.email,
          role: roleCode,
          status: user.status || 'UNKNOWN',
          joinedAt: dateFormatted,
          createdAt: dateFormatted,
        };
    });
  },

  async updateUserRole(userId: string, roleId: string): Promise<void> {
    await apiClient.put(`/admin/users/${userId}/roles`, { roleIds: [roleId] });
  },

  async lockUser(userId: string): Promise<void> {
    await apiClient.post(`/admin/users/${userId}/lock`);
  },

  async unlockUser(userId: string): Promise<void> {
    await apiClient.post(`/admin/users/${userId}/unlock`);
  },

  // 5. Cấu hình Hệ thống & Tham số AI
  async getConfigs(): Promise<SystemConfigParam[]> {
    const response = await apiClient.get<ListResponse<ApiConfig>>('/system-configs');
    return unwrapItems(response).map((config) => ({
      key: config.key,
      value: typeof config.value === 'object' ? JSON.stringify(config.value) : String(config.value ?? ''),
      description: config.description || config.key,
      updatedAt: config.updatedAt ? new Date(config.updatedAt).toLocaleDateString('vi-VN') : undefined,
    }));
  },

  async updateConfig(key: string, value: string): Promise<void> {
    const parsedValue = parseConfigValue(key, value);
    await apiClient.put('/system-configs', {
      configs: { [key]: parsedValue },
    });
  },

  // 6. Quản lý Báo cáo & Bài viết Diễn đàn
  async getReports(): Promise<AdminReport[]> {
    const response = await apiClient.get<ApiReportsResponse>('/content/reports');
      const docReports: AdminReport[] = (response?.documentReports || []).map((r) => ({
        id: r.id,
        targetType: 'DOCUMENT',
        targetId: r.documentId,
        reporterName: r.reporter?.fullName || 'Chưa cập nhật',
        reportedBy: r.reporter?.fullName || 'Chưa cập nhật',
        reason: r.reason + (r.document?.title ? ` (Tài liệu: ${r.document.title})` : ''),
        createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '',
        status: r.status,
      }));

      const forumReports: AdminReport[] = (response?.forumReports || []).map((r) => ({
        id: r.id,
        targetType: r.commentId ? 'COMMENT' : 'POST',
        targetId: r.postId || r.commentId || r.id,
        reporterName: r.reporter?.fullName || 'Chưa cập nhật',
        reportedBy: r.reporter?.fullName || 'Chưa cập nhật',
        reason: r.reason + (r.post?.title ? ` (Bài viết: ${r.post.title})` : ''),
        createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '',
        status: r.status,
      }));

    return [...docReports, ...forumReports];
  },

  async resolveReport(reportId: string, status: 'RESOLVED' | 'REJECTED', resolutionNote: string): Promise<void> {
    const note = resolutionNote.trim();
    if (!note) throw new Error('Vui lòng nhập ghi chú xử lý báo cáo.');
    await apiClient.post(`/content/reports/${reportId}/handle`, {
      status,
      resolutionNote: note,
    });
  },

  async getForumPosts(): Promise<AdminForumPost[]> {
    const response = await apiClient.get<ListResponse<ApiForumPost>>('/forum/posts');
    return unwrapItems(response).map((p) => ({
        id: p.id,
        title: p.title,
        authorName: p.author?.fullName || 'Chưa cập nhật',
        contentSnippet: p.content?.slice(0, 100) || '',
        createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : '',
        status: p.status || 'UNKNOWN',
        reportsCount: p._count?.reports || 0,
    }));
  },

  async deleteForumPost(postId: string): Promise<void> {
    await apiClient.delete(`/content/forum/posts/${postId}`);
  },

  async lockForumPost(postId: string): Promise<void> {
    await apiClient.post(`/content/forum/posts/${postId}/lock`);
  },

};
