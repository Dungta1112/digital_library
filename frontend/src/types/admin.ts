export interface SystemStats {
  totalUsers: number;
  totalDocuments: number;
  totalGroups: number;
  activeUsersToday: number;
}

export interface RoleOption {
  id: string;
  code: string;
  name: string;
  description?: string | null;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'LOCKED' | 'DISABLED';
  joinedAt?: string;
  createdAt?: string;
}

export interface AdminDocRecord {
  id: string;
  title: string;
  author?: string;
  uploadedBy: string;
  uploadedAt?: string;
  uploadDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AdminForumPost {
  id: string;
  title: string;
  authorName: string;
  contentSnippet?: string;
  createdAt: string;
  status: 'ACTIVE' | 'LOCKED' | 'DELETED';
  reportsCount?: number;
}

export interface AdminReport {
  id: string;
  reporterName?: string;
  reportedBy?: string;
  targetType: 'DOCUMENT' | 'POST' | 'COMMENT' | 'USER';
  targetId: string;
  reason: string;
  createdAt: string;
  status: 'PENDING' | 'RESOLVED' | 'IGNORED' | 'REJECTED';
}

export interface SystemConfigParam {
  key: string;
  group?: 'GENERAL' | 'SECURITY' | 'LIBRARY';
  label?: string;
  description?: string;
  value: string;
  type?: 'text' | 'boolean' | 'number';
  updatedAt?: string;
}
