import { apiClient } from './api.client';
import { runWithMock } from './config';
import type {
  AdminDocRecord,
  AdminForumPost,
  AdminReport,
  AdminUserRecord,
  SystemConfigParam,
  SystemStats,
} from '../types/admin';

interface AdminMockData {
  stats: SystemStats;
  users: AdminUserRecord[];
  pendingDocuments: AdminDocRecord[];
  forumPosts: AdminForumPost[];
  reports: AdminReport[];
  systemConfigs: SystemConfigParam[];
}

type ListResponse<T> = T[] | { items?: T[] };

let mockData: AdminMockData | null = null;

async function getMockData() {
  if (!mockData) {
    const mockModule = await import('../mocks/admin.json');
    // Giữ một bản sao trong bộ nhớ để thao tác duyệt/xóa có hiệu lực tới khi reload trang.
    mockData = structuredClone(mockModule.default) as AdminMockData;
  }
  return mockData;
}

function unwrapItems<T>(response: ListResponse<T>) {
  return Array.isArray(response) ? response : response.items || [];
}

interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  status?: AdminUserRecord['status'];
  createdAt?: string;
  roles?: Array<{ role?: { code?: string } }>;
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
    return runWithMock(
      async () => ({ ...(await getMockData()).stats }),
      async () => {
        const response = await apiClient.get<
          unknown,
          { users?: number; documents?: number; studyGroups?: number; views?: number }
        >('/statistics/overview');
        return {
          totalUsers: response.users || 0,
          totalDocuments: response.documents || 0,
          totalGroups: response.studyGroups || 0,
          activeUsersToday: response.views || 0,
        };
      }
    );
  },

  async getUsers(): Promise<AdminUserRecord[]> {
    return runWithMock(
      async () => [...(await getMockData()).users],
      async () => {
        const response = await apiClient.get<unknown, ListResponse<ApiUser>>('/admin/users');
        return unwrapItems(response).map((user) => ({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.roles?.[0]?.role?.code || 'STUDENT',
          status: user.status || 'ACTIVE',
          joinedAt: user.createdAt || new Date().toISOString(),
        }));
      }
    );
  },

  async toggleUserStatus(userId: string, currentStatus: string): Promise<void> {
    return runWithMock(
      async () => {
        const user = (await getMockData()).users.find((item) => item.id === userId);
        if (user) user.status = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      },
      async () => {
        const action = currentStatus === 'ACTIVE' ? 'lock' : 'unlock';
        await apiClient.post(`/admin/users/${userId}/${action}`);
      }
    );
  },

  async updateUserRole(userId: string, newRoleCode: string): Promise<void> {
    return runWithMock(
      async () => {
        const user = (await getMockData()).users.find((item) => item.id === userId);
        if (user) user.role = newRoleCode;
      },
      async () => {
        const roles = await apiClient.get<
          unknown,
          ListResponse<{ id: string; code: string }>
        >('/roles');
        const targetRole = unwrapItems(roles).find((role) => role.code === newRoleCode);
        if (!targetRole) throw new Error(`Không tìm thấy quyền ${newRoleCode}`);
        await apiClient.put(`/admin/users/${userId}/roles`, { roleIds: [targetRole.id] });
      }
    );
  },

  async getPendingDocs(): Promise<AdminDocRecord[]> {
    return runWithMock(
      async () => [...(await getMockData()).pendingDocuments],
      async () => {
        const response = await apiClient.get<
          unknown,
          ListResponse<ApiDocument>
        >('/content/documents/pending');
        return unwrapItems(response).map((document) => ({
          id: document.id,
          title: document.title,
          author: document.owner?.fullName || 'Unknown',
          uploadedBy: document.owner?.email || '',
          uploadedAt: document.createdAt,
          status: document.status,
        }));
      }
    );
  },

  async reviewDoc(
    docId: string,
    action: 'APPROVE' | 'REJECT',
    reason?: string
  ): Promise<void> {
    return runWithMock(
      async () => {
        const data = await getMockData();
        data.pendingDocuments = data.pendingDocuments.filter((document) => document.id !== docId);
      },
      async () => {
        if (action === 'APPROVE') {
          await apiClient.post(`/content/documents/${docId}/approve`);
        } else {
          await apiClient.post(`/content/documents/${docId}/reject`, {
            reason: reason || 'Not specified',
          });
        }
      }
    );
  },

  async getForumPosts(): Promise<AdminForumPost[]> {
    return runWithMock(
      async () => [...(await getMockData()).forumPosts],
      async () => {
        const response = await apiClient.get<
          unknown,
          ListResponse<ApiForumPost>
        >('/forum/posts');
        return unwrapItems(response).map((post) => ({
          id: post.id,
          title: post.title,
          authorName: post.author?.fullName || 'Unknown',
          contentSnippet: (post.content || '').substring(0, 100),
          createdAt: post.createdAt,
          status: post.status || 'ACTIVE',
          reportsCount: post._count?.reports || 0,
        }));
      }
    );
  },

  async moderatePost(postId: string, action: 'DELETE' | 'LOCK'): Promise<void> {
    return runWithMock(
      async () => {
        const data = await getMockData();
        if (action === 'DELETE') {
          data.forumPosts = data.forumPosts.filter((post) => post.id !== postId);
        } else {
          const post = data.forumPosts.find((item) => item.id === postId);
          if (post) post.status = 'LOCKED';
        }
      },
      async () => {
        if (action === 'DELETE') {
          await apiClient.delete(`/content/forum/posts/${postId}`);
        } else {
          await apiClient.post(`/content/forum/posts/${postId}/lock`);
        }
      }
    );
  },

  async getReports(): Promise<AdminReport[]> {
    return runWithMock(
      async () => [...(await getMockData()).reports],
      async () => {
        const response = await apiClient.get<
          unknown,
          { documentReports?: ApiReport[]; forumReports?: ApiReport[] }
        >('/content/reports');
        const documentReports = (response.documentReports || []).map((report) => ({
          id: report.id,
          reporterName: report.reporter?.fullName || report.reporterId || 'Unknown',
          targetType: 'DOCUMENT' as const,
          targetId: report.documentId || '',
          reason: report.reason,
          createdAt: report.createdAt,
          status: report.status,
        }));
        const forumReports = (response.forumReports || []).map((report) => ({
          id: report.id,
          reporterName: report.reporter?.fullName || report.reporterId || 'Unknown',
          targetType: report.postId ? ('POST' as const) : ('COMMENT' as const),
          targetId: report.postId || report.commentId || '',
          reason: report.reason,
          createdAt: report.createdAt,
          status: report.status,
        }));
        return [...documentReports, ...forumReports];
      }
    );
  },

  async processReport(reportId: string, action: 'RESOLVE' | 'IGNORE'): Promise<void> {
    return runWithMock(
      async () => {
        const data = await getMockData();
        data.reports = data.reports.filter((report) => report.id !== reportId);
      },
      async () => {
        await apiClient.post(`/content/reports/${reportId}/handle`, {
          status: action === 'RESOLVE' ? 'RESOLVED' : 'REJECTED',
          resolutionNote: 'Processed via Admin UI',
        });
      }
    );
  },

  async getSystemConfigs(): Promise<SystemConfigParam[]> {
    return runWithMock(
      async () => [...(await getMockData()).systemConfigs],
      async () => {
        const response = await apiClient.get<unknown, ListResponse<ApiConfig>>('/system-configs');
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
      }
    );
  },

  async updateSystemConfig(key: string, value: SystemConfigParam['value']): Promise<void> {
    return runWithMock(
      async () => {
        const config = (await getMockData()).systemConfigs.find((item) => item.key === key);
        if (config) config.value = value;
      },
      async () => {
        await apiClient.put('/system-configs', { key, value });
      }
    );
  },
};
