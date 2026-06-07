import { apiClient } from './api.client';
import type { User, AuthResponse } from '../types/auth';

export const AuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<any, any>('/auth/login', { email, password });
    if (res && res.user && res.user.roles) {
      res.user.role = res.user.roles[0] || 'STUDENT';
    }
    return res as AuthResponse;
  },
  
  async register(email: string, password: string, fullName: string): Promise<any> {
    const res = await apiClient.post('/auth/register', { email, password, fullName, role: 'STUDENT' });
    return res;
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<any, any>('/users/me');
    if (res && res.roles) {
      res.role = res.roles[0] || 'STUDENT';
    }
    return res as User;
  }
};
