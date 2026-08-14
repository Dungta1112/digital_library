import { apiClient } from './api.client';
import { runWithMock } from './config';
import type { ForumPost, ForumComment } from '../types/forum';

let mockPosts: ForumPost[] | null = null;

async function getMockPosts() {
  if (!mockPosts) {
    const mockModule = await import('../mocks/forum.json');
    // Clone để các thao tác thêm bài/bình luận không sửa trực tiếp module JSON đã import.
    mockPosts = structuredClone(mockModule.default) as ForumPost[];
  }
  return mockPosts;
}

function createMockId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const ForumService = {
  async getPosts(category?: string): Promise<ForumPost[]> {
    return runWithMock(
      async () => {
        const posts = await getMockPosts();
        if (!category || category === 'All') return [...posts];
        return posts.filter((post) => post.category === category);
      },
      async () => {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);

        const response = await apiClient.get<
          unknown,
          ForumPost[] | { items: ForumPost[] }
        >(`/forum/posts?${params.toString()}`);
        return Array.isArray(response) ? response : response.items || [];
      }
    );
  },

  async getPostById(id: string): Promise<ForumPost | null> {
    return runWithMock(
      async () => {
        const posts = await getMockPosts();
        return posts.find((post) => post.id === id) || null;
      },
      async () => {
        try {
          return await apiClient.get<unknown, ForumPost>(`/forum/posts/${id}`);
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    );
  },

  async createPost(title: string, content: string): Promise<ForumPost> {
    return runWithMock(
      async () => {
        const posts = await getMockPosts();
        const post: ForumPost = {
          id: createMockId('post'),
          title,
          content,
          authorName: 'Tài khoản Demo',
          authorRole: 'STUDENT',
          category: 'General',
          tags: ['Demo'],
          createdAt: new Date().toISOString(),
          likes: 0,
          commentsCount: 0,
          comments: [],
        };
        posts.unshift(post);
        return post;
      },
      () => apiClient.post<unknown, ForumPost>('/forum/posts', { title, content })
    );
  },

  async createComment(postId: string, content: string): Promise<ForumComment> {
    return runWithMock(
      async () => {
        const posts = await getMockPosts();
        const comment: ForumComment = {
          id: createMockId('comment'),
          postId,
          authorName: 'Tài khoản Demo',
          authorRole: 'STUDENT',
          content,
          createdAt: new Date().toISOString(),
          likes: 0,
        };
        const post = posts.find((item) => item.id === postId);
        if (post) {
          post.comments = [...(post.comments || []), comment];
          post.commentsCount = post.comments.length;
        }
        return comment;
      },
      () =>
        apiClient.post<unknown, ForumComment>(`/forum/posts/${postId}/comments`, {
          content,
        })
    );
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    return runWithMock(
      async () => {
        const posts = await getMockPosts();
        const post = posts.find((item) => item.id === postId);
        if (post) {
          post.comments = (post.comments || []).filter((c) => c.id !== commentId);
          post.commentsCount = post.comments.length;
        }
      },
      () => apiClient.delete<unknown, void>(`/forum/posts/${postId}/comments/${commentId}`)
    );
  },
};