import { apiClient } from './api-client';
import type { User, AuthResponse } from '../types/auth';

interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role?: User['role'];
  roles?: Array<string | { code?: string; role?: { code?: string } }>;
}

interface ApiAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
}

function normalizeApiUser(user: ApiUser): User {
  let role: User['role'] = 'STUDENT';

  if (user.role) {
    role = user.role;
  } else if (user.roles && user.roles.length > 0) {
    const firstRole = user.roles[0];
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
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    role,
  };
}

export const AuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiAuthResponse>('/auth/login', {
      email: email.trim(),
      password,
    });

    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: normalizeApiUser(response.user),
    };
  },

  async register(email: string, password: string, fullName: string): Promise<User> {
    const response = await apiClient.post<ApiUser>('/auth/register', {
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      role: 'STUDENT',
    });

    return normalizeApiUser(response);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.warn('Lỗi khi gọi API đăng xuất:', e);
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiUser>('/users/me');
    return normalizeApiUser(response);
  },
};
