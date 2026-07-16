export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'LECTURER' | 'CONTENT_MANAGER' | 'ADMIN';
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  username?: string;
  interests?: string[];
  joinedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
