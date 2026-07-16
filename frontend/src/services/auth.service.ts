import { apiClient } from './api.client';
import { runWithMock } from './config';
import type { User, AuthResponse } from '../types/auth';

interface MockAccount extends User {
  password: string;
}

interface ApiUser extends Omit<User, 'role'> {
  role?: User['role'];
  roles?: User['role'][];
}

interface ApiAuthResponse extends Omit<AuthResponse, 'user'> {
  user: ApiUser;
}

let mockAccounts: MockAccount[] | null = null;

async function getMockAccounts() {
  if (!mockAccounts) {
    const mockModule = await import('../mocks/auth.json');
    mockAccounts = structuredClone(mockModule.default) as MockAccount[];
  }
  return mockAccounts;
}

function withoutPassword(account: MockAccount): User {
  const user = { ...account } as Partial<MockAccount>;
  delete user.password;
  return user as User;
}

function getMockProfileOverrides(): Record<string, Partial<User>> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('mock_profile_overrides') || '{}');
  } catch {
    return {};
  }
}

function normalizeApiUser(user: ApiUser): User {
  return {
    ...user,
    role: user.role || user.roles?.[0] || 'STUDENT',
  };
}

export const AuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return runWithMock(
      async () => {
        const account = (await getMockAccounts()).find(
          (item) => item.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (!account || account.password !== password) {
          throw new Error('Email hoặc mật khẩu demo không đúng');
        }

        return {
          accessToken: `mock-token-${account.id}`,
          refreshToken: `mock-refresh-${account.id}`,
          user: {
            ...withoutPassword(account),
            ...(getMockProfileOverrides()[account.id] || {}),
          },
        };
      },
      async () => {
        const response = await apiClient.post<unknown, ApiAuthResponse>('/auth/login', {
          email,
          password,
        });
        return { ...response, user: normalizeApiUser(response.user) };
      }
    );
  },

  async register(email: string, password: string, fullName: string): Promise<User> {
    return runWithMock(
      async () => {
        const accounts = await getMockAccounts();
        if (accounts.some((account) => account.email.toLowerCase() === email.toLowerCase())) {
          throw new Error('Email này đã tồn tại trong dữ liệu demo');
        }
        const account: MockAccount = {
          id: `demo-user-${Date.now()}`,
          email,
          password,
          fullName,
          role: 'STUDENT',
        };
        accounts.push(account);
        return {
          ...withoutPassword(account),
          ...(getMockProfileOverrides()[account.id] || {}),
        };
      },
      async () => {
        const response = await apiClient.post<unknown, ApiUser>('/auth/register', {
          email,
          password,
          fullName,
          role: 'STUDENT',
        });
        return normalizeApiUser(response);
      }
    );
  },

  async getCurrentUser(): Promise<User> {
    return runWithMock(
      async () => {
        // Token mock chứa id tài khoản để đăng nhập vẫn được khôi phục sau khi reload.
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const accountId = token?.replace('mock-token-', '');
        const account = (await getMockAccounts()).find((item) => item.id === accountId);
        if (!account) throw new Error('Phiên đăng nhập demo không hợp lệ');
        return withoutPassword(account);
      },
      async () => {
        const response = await apiClient.get<unknown, ApiUser>('/users/me');
        return normalizeApiUser(response);
      }
    );
  },
};
