import { apiClient } from './api.client';
import type { SystemStats, AdminUserRecord } from '../types/admin';

export const AdminService = {
  async getStats(): Promise<SystemStats> {
    const res = await apiClient.get<any, any>('/statistics/overview');
    return {
      totalUsers: res.users || 0,
      totalDocuments: res.documents || 0,
      totalGroups: res.studyGroups || 0,
      activeUsersToday: res.views || 0
    };
  },

  async getUsers(): Promise<AdminUserRecord[]> {
    const res = await apiClient.get<any, any>('/admin/users');
    const items = Array.isArray(res) ? res : (res?.items || []);
    return items.map((u: any) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.roles?.[0]?.role?.code || 'STUDENT',
      status: u.status || 'ACTIVE',
      joinedAt: u.createdAt || new Date().toISOString()
    }));
  },

  async toggleUserStatus(userId: string, currentStatus: string): Promise<void> {
    if (currentStatus === 'ACTIVE') {
      await apiClient.post(`/admin/users/${userId}/lock`);
    } else {
      await apiClient.post(`/admin/users/${userId}/unlock`);
    }
  },

  async updateUserRole(userId: string, newRoleCode: string): Promise<void> {
    // Backend expects roleIds (UUIDs), so we need to look up the role first
    try {
      const roles = await apiClient.get<any, any>('/roles');
      const roleList = Array.isArray(roles) ? roles : (roles?.items || []);
      const targetRole = roleList.find((r: any) => r.code === newRoleCode);
      if (targetRole) {
        await apiClient.put(`/admin/users/${userId}/roles`, { roleIds: [targetRole.id] });
      } else {
        console.error(`Role ${newRoleCode} not found in roles list`);
      }
    } catch (e) {
      console.error('Failed to update role:', e);
    }
  },

  async getPendingDocs(): Promise<any[]> {
    const res = await apiClient.get<any, any>('/content/documents/pending');
    const items = Array.isArray(res) ? res : (res?.items || []);
    return items.map((d: any) => ({
      id: d.id,
      title: d.title,
      author: d.owner?.fullName || 'Unknown',
      uploadedBy: d.owner?.email || '',
      uploadedAt: d.createdAt,
      status: d.status
    }));
  },

  async reviewDoc(docId: string, action: 'APPROVE' | 'REJECT', reason?: string): Promise<void> {
    if (action === 'APPROVE') {
      await apiClient.post(`/content/documents/${docId}/approve`);
    } else {
      await apiClient.post(`/content/documents/${docId}/reject`, { reason: reason || 'Not specified' });
    }
  },

  async getForumPosts(): Promise<any[]> {
    const res = await apiClient.get<any, any>('/forum/posts');
    const items = Array.isArray(res) ? res : (res?.items || []);
    return items.map((p: any) => ({
      id: p.id,
      title: p.title,
      authorName: p.author?.fullName || 'Unknown',
      contentSnippet: (p.content || '').substring(0, 100),
      createdAt: p.createdAt,
      status: p.status || 'PUBLISHED',
      reportsCount: p._count?.reports || 0
    }));
  },

  async moderatePost(postId: string, action: 'DELETE' | 'LOCK'): Promise<void> {
    if (action === 'DELETE') {
      await apiClient.delete(`/content/forum/posts/${postId}`);
    } else {
      await apiClient.post(`/content/forum/posts/${postId}/lock`);
    }
  },

  async getReports(): Promise<any[]> {
    const res = await apiClient.get<any, any>('/content/reports');
    // Backend returns { documentReports: [...], forumReports: [...] }
    const docReports = (res?.documentReports || []).map((r: any) => ({
      id: r.id,
      reporterName: r.reporter?.fullName || r.reporterId || 'Unknown',
      targetType: 'DOCUMENT' as const,
      targetId: r.documentId,
      reason: r.reason,
      createdAt: r.createdAt,
      status: r.status
    }));
    const forumReports = (res?.forumReports || []).map((r: any) => ({
      id: r.id,
      reporterName: r.reporter?.fullName || r.reporterId || 'Unknown',
      targetType: (r.postId ? 'POST' : 'COMMENT') as 'POST' | 'COMMENT',
      targetId: r.postId || r.commentId,
      reason: r.reason,
      createdAt: r.createdAt,
      status: r.status
    }));
    return [...docReports, ...forumReports];
  },

  async processReport(reportId: string, action: 'RESOLVE' | 'IGNORE'): Promise<void> {
    const mappedStatus = action === 'RESOLVE' ? 'RESOLVED' : 'REJECTED';
    await apiClient.post(`/content/reports/${reportId}/handle`, { 
      status: mappedStatus, 
      resolutionNote: 'Processed via Admin UI' 
    });
  },

  async getSystemConfigs(): Promise<any[]> {
    const res = await apiClient.get<any, any>('/system-configs');
    const items = Array.isArray(res) ? res : (res?.items || []);
    return items.map((c: any) => ({
      key: c.key,
      group: c.key.split('.')[0]?.toUpperCase() || 'GENERAL',
      label: c.description || c.key,
      value: typeof c.value === 'object' ? JSON.stringify(c.value) : c.value,
      type: typeof c.value === 'boolean' ? 'boolean' : (typeof c.value === 'number' ? 'number' : 'text')
    }));
  },

  async updateSystemConfig(key: string, value: any): Promise<void> {
    await apiClient.put('/system-configs', { key, value });
  }
};
