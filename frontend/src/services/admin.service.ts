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

interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  status?: AdminUserRecord['status'];
  createdAt?: string;
  roles?: Array<{ role?: { code?: string }; code?: string }>;
}

interface ApiDocument {
  id: string;
  title: string;
  createdAt: string;
  status: AdminDocRecord['status'];
  owner?: { fullName?: string; email?: string };
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
  async getStats(): Promise<SystemStats> {
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
      };
    } catch (e) {
      console.error('Lỗi khi tải thống kê tổng quan:', e);
      return { totalUsers: 0, totalDocuments: 0, totalGroups: 0, activeUsersToday: 0 };
    }
  },

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

        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: roleCode,
          status: user.status || 'ACTIVE',
          joinedAt: user.createdAt || new Date().toISOString(),
        };
      });
    } catch (e) {
      console.error('Lỗi khi tải danh sách người dùng:', e);
      return [];
    }
  },

  async toggleUserStatus(userId: string, currentStatus: string): Promise<void> {
    const action = currentStatus === 'ACTIVE' ? 'lock' : 'unlock';
    await apiClient.post(`/admin/users/${userId}/${action}`);
  },

  async updateUserRole(userId: string, newRoleCode: string): Promise<void> {
    const roles = await apiClient.get<ListResponse<{ id: string; code: string }>>('/roles');
    const targetRole = unwrapItems(roles).find((role) => role.code === newRoleCode);
    if (!targetRole) throw new Error(`Không tìm thấy quyền ${newRoleCode}`);
    await apiClient.put(`/admin/users/${userId}/roles`, { roleIds: [targetRole.id] });
  },

  async getPendingDocs(): Promise<AdminDocRecord[]> {
    try {
      const response = await apiClient.get<ListResponse<ApiDocument>>('/content/documents/pending');
      return unwrapItems(response).map((document) => ({
        id: document.id,
        title: document.title,
        author: document.owner?.fullName || 'Chưa rõ tác giả',
        uploadedBy: document.owner?.email || '',
        uploadedAt: document.createdAt,
        status: document.status,
      }));
    } catch (e) {
      console.error('Lỗi khi tải danh sách tài liệu chờ duyệt:', e);
      return [];
    }
  },

  async reviewDoc(
    docId: string,
    action: 'APPROVE' | 'REJECT',
    reason?: string
  ): Promise<void> {
    if (action === 'APPROVE') {
      await apiClient.post(`/content/documents/${docId}/approve`);
    } else {
      await apiClient.post(`/content/documents/${docId}/reject`, {
        reason: reason || 'Nội dung không phù hợp với tiêu chuẩn',
      });
    }
  },

  async getForumPosts(): Promise<AdminForumPost[]> {
    try {
      const response = await apiClient.get<ListResponse<ApiForumPost>>('/forum/posts');
      return unwrapItems(response).map((post) => ({
        id: post.id,
        title: post.title,
        authorName: post.author?.fullName || 'Người dùng',
        contentSnippet: (post.content || '').substring(0, 100),
        createdAt: post.createdAt,
        status: post.status || 'ACTIVE',
        reportsCount: post._count?.reports || 0,
      }));
    } catch (e) {
      console.error('Lỗi khi tải bài viết diễn đàn cho quản trị:', e);
      return [];
    }
  },

  async moderatePost(postId: string, action: 'DELETE' | 'LOCK'): Promise<void> {
    if (action === 'DELETE') {
      await apiClient.delete(`/content/forum/posts/${postId}`);
    } else {
      await apiClient.post(`/content/forum/posts/${postId}/lock`);
    }
  },

  async getReports(): Promise<AdminReport[]> {
    try {
      const response = await apiClient.get<{ documentReports?: ApiReport[]; forumReports?: ApiReport[] }>(
        '/content/reports'
      );
      const documentReports = (response.documentReports || []).map((report) => ({
        id: report.id,
        reporterName: report.reporter?.fullName || report.reporterId || 'Người dùng',
        targetType: 'DOCUMENT' as const,
        targetId: report.documentId || '',
        reason: report.reason,
        createdAt: report.createdAt,
        status: report.status,
      }));
      const forumReports = (response.forumReports || []).map((report) => ({
        id: report.id,
        reporterName: report.reporter?.fullName || report.reporterId || 'Người dùng',
        targetType: report.postId ? ('POST' as const) : ('COMMENT' as const),
        targetId: report.postId || report.commentId || '',
        reason: report.reason,
        createdAt: report.createdAt,
        status: report.status,
      }));
      return [...documentReports, ...forumReports];
    } catch (e) {
      console.error('Lỗi khi tải danh sách báo cáo vi phạm:', e);
      return [];
    }
  },

  async processReport(reportId: string, action: 'RESOLVE' | 'IGNORE'): Promise<void> {
    await apiClient.post(`/content/reports/${reportId}/handle`, {
      status: action === 'RESOLVE' ? 'RESOLVED' : 'REJECTED',
      resolutionNote: 'Đã xử lý từ trang Quản trị',
    });
  },

  async getSystemConfigs(): Promise<SystemConfigParam[]> {
    try {
      const response = await apiClient.get<ListResponse<ApiConfig>>('/system-configs');
      return unwrapItems(response).map((config) => ({
        key: config.key,
        group: (config.key.split('.')[0]?.toUpperCase() || 'GENERAL') as SystemConfigParam['group'],
        label: config.description || config.key,
        value:
          typeof config.value === 'object' ? JSON.stringify(config.value) : String(config.value),
        type:
          typeof config.value === 'boolean'
            ? 'boolean'
            : typeof config.value === 'number'
              ? 'number'
              : 'text',
      }));
    } catch (e) {
      console.error('Lỗi khi tải cấu hình hệ thống:', e);
      return [];
    }
  },

  async updateSystemConfig(key: string, value: SystemConfigParam['value']): Promise<void> {
    await apiClient.put('/system-configs', { key, value });
  },
};
