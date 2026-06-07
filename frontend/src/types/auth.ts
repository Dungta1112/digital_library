export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'LECTURER' | 'CONTENT_MANAGER' | 'ADMIN';
  avatarUrl?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
