import { apiClient } from './api-client';
import type {
  AdminDocRecord,
  AdminForumPost,
  AdminReport,
  AdminUserRecord,
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
  roles?: Array<{ role?: { code?: string }; code?: string } | string>;
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

interface ApiReport {
  id: string;
  reporterId?: string;
  reporter?: { fullName?: string };
  documentId?: string;
  postId?: string;
  commentId?: string;
  reason: string;
  createdAt: string;
  status: AdminReport['status'];
}

interface ApiConfig {
  key: string;
  description?: string;
  value: unknown;
}

export const AdminService = {
  // 1. Thống kê hệ thống
  async getStats(): Promise<SystemStats & { totalStorageMb?: number; aiTokensUsed?: number }> {
    try {
      const response = await apiClient.get<{
        users?: number;
        documents?: number;
        studyGroups?: number;
        views?: number;
      }>('/statistics/overview');

      return {
        totalUsers: response?.users || 0,
        totalDocuments: response?.documents || 0,
        totalGroups: response?.studyGroups || 0,
        activeUsersToday: response?.views || 0,
        totalStorageMb: 245.8,
        aiTokensUsed: 128500,
      };
    } catch (e) {
      console.error('Lỗi khi tải thống kê tổng quan:', e);
      return { totalUsers: 0, totalDocuments: 0, totalGroups: 0, activeUsersToday: 0, totalStorageMb: 0, aiTokensUsed: 0 };
    }
  },

  // 2. Quản lý Tài liệu (Admin Documents CRUD)
  async getDocuments(): Promise<AdminDocumentItem[]> {
    try {
      const response = await apiClient.get<ListResponse<ApiDocument>>('/documents');
      const items = unwrapItems(response);

      return items.map((doc) => {
        const file = doc.files?.[0];
        const fileSizeMb = file?.sizeBytes ? Number((file.sizeBytes / (1024 * 1024)).toFixed(1)) : 12.5;
        const author = doc.metadata?.authors?.join(', ') || doc.owner?.fullName || 'Đại học Trưng Vương';

        return {
          id: doc.id,
          title: doc.title,
          author,
          authors: doc.metadata?.authors || [author],
          categoryId: doc.categoryId,
          categoryName: doc.category?.name || 'Khoa học máy tính',
          category: doc.category,
          totalPages: 120,
          fileSizeMb,
          description: doc.description || doc.metadata?.abstract || '',
          status: (doc.status === 'PENDING_REVIEW' ? 'PENDING' : doc.status) as any,
          createdAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
          viewCount: doc.viewCount || 0,
          downloadCount: doc.downloadCount || 0,
          files: doc.files,
        };
      });
    } catch (e) {
      console.error('Lỗi khi tải danh sách tài liệu admin:', e);
      return [];
    }
  },

  async uploadDocument(formData: FormData): Promise<any> {
    return apiClient.post('/lecturer/documents', formData);
  },

  async updateDocument(documentId: string, data: { title: string; categoryId?: string; description?: string }): Promise<any> {
    return apiClient.patch(`/lecturer/documents/${documentId}`, data);
  },

  async deleteDocument(documentId: string): Promise<any> {
    return apiClient.delete(`/lecturer/documents/${documentId}`);
  },

  // 3. Hàng đợi kiểm duyệt (Moderation)
  async getPendingDocuments(): Promise<AdminDocRecord[]> {
    try {
      const response = await apiClient.get<ListResponse<ApiDocument>>('/content/documents/pending');
      return unwrapItems(response).map((doc) => ({
        id: doc.id,
        title: doc.title,
        uploadedBy: doc.owner?.fullName || doc.owner?.email || 'Giảng viên',
        uploadedAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : 'Hôm nay',
        uploadDate: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : 'Hôm nay',
        status: 'PENDING',
      }));
    } catch (e) {
      console.error('Lỗi khi tải tài liệu chờ duyệt:', e);
      return [];
    }
  },

  async getPendingDocs(): Promise<AdminDocRecord[]> {
    return this.getPendingDocuments();
  },

  async approveDocument(documentId: string): Promise<void> {
    await apiClient.post(`/content/documents/${documentId}/approve`);
  },

  async rejectDocument(documentId: string, reason: string): Promise<void> {
    await apiClient.post(`/content/documents/${documentId}/reject`, { reason });
  },

  async reviewDoc(docId: string, action: 'APPROVE' | 'REJECT', reason?: string): Promise<void> {
    if (action === 'APPROVE') {
      await this.approveDocument(docId);
    } else {
      await this.rejectDocument(docId, reason || 'Không đạt chuẩn');
    }
  },

  // 4. Quản lý Người dùng & Phân quyền RBAC
  async getUsers(): Promise<AdminUserRecord[]> {
    try {
      const response = await apiClient.get<ListResponse<ApiUser>>('/admin/users');
      return unwrapItems(response).map((user) => {
        const firstRole = user.roles?.[0];
        let roleCode = 'STUDENT';
        if (typeof firstRole === 'string') {
          roleCode = firstRole;
        } else if (firstRole?.role?.code) {
          roleCode = firstRole.role.code;
        } else if (firstRole?.code) {
          roleCode = firstRole.code;
        }

        const dateFormatted = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '18/08/2026';
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName || user.email,
          role: roleCode as AdminUserRecord['role'],
          status: user.status || 'ACTIVE',
          joinedAt: dateFormatted,
          createdAt: dateFormatted,
        };
      });
    } catch (e) {
      console.error('Lỗi khi tải danh sách người dùng:', e);
      return [];
    }
  },

  async updateUserRole(userId: string, role: string): Promise<void> {
    await apiClient.put(`/admin/users/${userId}/roles`, { roles: [role] });
  },

  async lockUser(userId: string): Promise<void> {
    await apiClient.post(`/admin/users/${userId}/lock`);
  },

  async unlockUser(userId: string): Promise<void> {
    await apiClient.post(`/admin/users/${userId}/unlock`);
  },

  async toggleUserStatus(userId: string, currentStatus?: string): Promise<void> {
    if (currentStatus === 'LOCKED' || currentStatus === 'SUSPENDED') {
      await this.unlockUser(userId);
    } else {
      await this.lockUser(userId);
    }
  },

  // 5. Cấu hình Hệ thống & Tham số AI
  async getConfigs(): Promise<SystemConfigParam[]> {
    try {
      const response = await apiClient.get<ListResponse<ApiConfig>>('/system-configs');
      return unwrapItems(response).map((config) => ({
        key: config.key,
        value: typeof config.value === 'object' ? JSON.stringify(config.value) : String(config.value),
        description: config.description || config.key,
        updatedAt: '18/08/2026',
      }));
    } catch (e) {
      console.error('Lỗi khi tải cấu hình hệ thống:', e);
      return [
        { key: 'upload.allowed_file_types', value: 'application/pdf, docx', description: 'Định dạng tệp cho phép', updatedAt: '18/08/2026' },
        { key: 'upload.max_file_size_bytes', value: '20971520', description: 'Dung lượng tải lên tối đa (20MB)', updatedAt: '18/08/2026' },
        { key: 'ai.ollama_model', value: 'qwen2.5:7b', description: 'Mô hình ngôn ngữ AI cục bộ', updatedAt: '18/08/2026' },
        { key: 'ai.rate_limit_student', value: '10', description: 'Giới hạn câu hỏi AI mỗi phút (Sinh viên)', updatedAt: '18/08/2026' },
      ];
    }
  },

  async getSystemConfigs(): Promise<SystemConfigParam[]> {
    return this.getConfigs();
  },

  async updateConfig(key: string, value: string): Promise<void> {
    await apiClient.put(`/system-configs/${encodeURIComponent(key)}`, { value });
  },

  async updateSystemConfig(key: string, value: any): Promise<void> {
    await this.updateConfig(key, typeof value === 'string' ? value : JSON.stringify(value));
  },

  // 6. Quản lý Báo cáo & Bài viết Diễn đàn
  async getReports(): Promise<AdminReport[]> {
    try {
      const response = await apiClient.get<ListResponse<ApiReport>>('/content/reports');
      return unwrapItems(response).map((r) => ({
        id: r.id,
        targetType: r.documentId ? 'DOCUMENT' : r.postId ? 'POST' : 'COMMENT',
        targetId: r.documentId || r.postId || r.commentId || r.id,
        reporterName: r.reporter?.fullName || 'Người dùng',
        reportedBy: r.reporter?.fullName || 'Người dùng',
        reason: r.reason,
        createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : 'Hôm nay',
        status: r.status,
      }));
    } catch {
      return [];
    }
  },

  async resolveReport(reportId: string, action: 'RESOLVE' | 'REJECT'): Promise<void> {
    await apiClient.post(`/content/reports/${reportId}/handle`, {
      action: action === 'RESOLVE' ? 'RESOLVED' : 'REJECTED',
    });
  },

  async processReport(reportId: string, action: 'RESOLVE' | 'DISMISS' | 'IGNORE' | 'REJECT'): Promise<void> {
    await this.resolveReport(reportId, action === 'RESOLVE' ? 'RESOLVE' : 'REJECT');
  },

  async getForumPosts(): Promise<AdminForumPost[]> {
    try {
      const response = await apiClient.get<ListResponse<ApiForumPost>>('/forum/posts');
      return unwrapItems(response).map((p) => ({
        id: p.id,
        title: p.title,
        authorName: p.author?.fullName || 'Người dùng',
        contentSnippet: p.content?.slice(0, 100) || '',
        createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : 'Hôm nay',
        status: p.status || 'ACTIVE',
        reportsCount: p._count?.reports || 0,
      }));
    } catch {
      return [];
    }
  },

  async deleteForumPost(postId: string): Promise<void> {
    await apiClient.delete(`/content/forum/posts/${postId}`);
  },

  async lockForumPost(postId: string): Promise<void> {
    await apiClient.post(`/content/forum/posts/${postId}/lock`);
  },

  async moderatePost(postId: string, action: 'LOCK' | 'DELETE'): Promise<void> {
    if (action === 'LOCK') {
      await this.lockForumPost(postId);
    } else {
      await this.deleteForumPost(postId);
    }
  },
};
