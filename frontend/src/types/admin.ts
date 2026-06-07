export interface SystemStats {
  totalUsers: number;
  totalDocuments: number;
  totalGroups: number;
  activeUsersToday: number;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedAt: string;
}

export interface AdminDocRecord {
  id: string;
  title: string;
  author: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AdminForumPost {
  id: string;
  title: string;
  authorName: string;
  contentSnippet: string;
  createdAt: string;
  status: 'ACTIVE' | 'LOCKED' | 'DELETED';
  reportsCount: number;
}

export interface AdminReport {
  id: string;
  reporterName: string;
  targetType: 'POST' | 'COMMENT' | 'USER';
  targetId: string;
  reason: string;
  createdAt: string;
  status: 'PENDING' | 'RESOLVED' | 'IGNORED';
}

export interface SystemConfigParam {
  key: string;
  group: 'GENERAL' | 'SECURITY' | 'LIBRARY';
  label: string;
  value: string | boolean | number;
  type: 'text' | 'boolean' | 'number';
}
