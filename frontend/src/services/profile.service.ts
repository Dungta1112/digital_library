import { apiClient } from './api.client';
import { runWithMock } from './config';
import type { User } from '../types/auth';
import type { Document } from '../types/library';
import type { ForumPost } from '../types/forum';

interface MockAccount extends User {
  password: string;
}

export interface PublicProfile {
  user: User;
  documents: Document[];
  forumPosts: ForumPost[];
}

export interface UpdateProfileInput {
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  interests?: string[];
}

async function loadMockAccounts() {
  const mockModule = await import('../mocks/auth.json');
  return structuredClone(mockModule.default) as MockAccount[];
}

async function loadMockDocuments() {
  const mockModule = await import('../mocks/library.json');
  return structuredClone(mockModule.default) as Document[];
}

async function loadMockPosts() {
  const mockModule = await import('../mocks/forum.json');
  return structuredClone(mockModule.default) as ForumPost[];
}

function getMockProfileOverrides(): Record<string, Partial<User>> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('mock_profile_overrides') || '{}');
  } catch {
    return {};
  }
}

function setMockProfileOverride(userId: string, value: Partial<User>) {
  if (typeof window === 'undefined') return;
  const overrides = getMockProfileOverrides();
  overrides[userId] = { ...(overrides[userId] || {}), ...value };
  localStorage.setItem('mock_profile_overrides', JSON.stringify(overrides));
}

function withoutPassword(account: MockAccount): User {
  const user = { ...account } as Partial<MockAccount>;
  delete user.password;
  return user as User;
}

function getCurrentMockUserId() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('access_token')?.replace('mock-token-', '') || '';
}

function assignMockDocuments(documents: Document[], userId: string) {
  const hash = Array.from(userId).reduce((total, char) => total + char.charCodeAt(0), 0);
  return documents
    .filter((_, index) => index % 5 === hash % 5 || index % 5 === (hash + 2) % 5)
    .slice(0, 6);
}

export const ProfileService = {
  async getPublicProfile(userId: string): Promise<PublicProfile | null> {
    return runWithMock(
      async () => {
        const accounts = await loadMockAccounts();
        const account = accounts.find((item) => item.id === userId);
        if (!account) return null;
        const user = {
          ...withoutPassword(account),
          ...(getMockProfileOverrides()[userId] || {}),
        };

        const [documents, posts] = await Promise.all([
          loadMockDocuments(),
          loadMockPosts(),
        ]);

        return {
          user,
          documents: assignMockDocuments(documents, userId),
          forumPosts: posts.filter((post) => post.authorId === userId),
        };
      },
      async () => {
        try {
          return await apiClient.get<unknown, PublicProfile>(`/users/${userId}/profile`);
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    );
  },

  async getMyProfile(): Promise<PublicProfile | null> {
    return runWithMock(
      async () => {
        const userId = getCurrentMockUserId();
        return userId ? this.getPublicProfile(userId) : null;
      },
      async () => {
        try {
          return await apiClient.get<unknown, PublicProfile>('/users/me/profile');
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    );
  },

  async updateMe(input: UpdateProfileInput): Promise<User> {
    return runWithMock(
      async () => {
        const accounts = await loadMockAccounts();
        const userId = getCurrentMockUserId();
        const account = accounts.find((item) => item.id === userId);
        if (!account) throw new Error('Không tìm thấy tài khoản demo');
        const updatedUser = { ...withoutPassword(account), ...input };
        setMockProfileOverride(userId, input);
        return updatedUser;
      },
      () => apiClient.patch<unknown, User>('/users/me', input)
    );
  },
};
