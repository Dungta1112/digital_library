import { apiClient } from './api.client';
import type { ForumPost, ForumComment } from '../types/forum';

export const ForumService = {
  async getPosts(category?: string): Promise<ForumPost[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') {
      params.append('category', category);
    }
    const res = await apiClient.get<any, any>(`/forum/posts?${params.toString()}`);
    // Backend may return an array directly or { items: [] }
    if (Array.isArray(res)) return res;
    if (res && 'items' in res) return res.items;
    return [];
  },

  async getPostById(id: string): Promise<ForumPost | null> {
    try {
      const res = await apiClient.get<any, ForumPost>(`/forum/posts/${id}`);
      return res;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async createPost(title: string, content: string): Promise<ForumPost> {
    const res = await apiClient.post<any, ForumPost>('/forum/posts', { title, content });
    return res;
  },

  async createComment(postId: string, content: string): Promise<ForumComment> {
    const res = await apiClient.post<any, ForumComment>(`/forum/posts/${postId}/comments`, { content });
    return res;
  }
};
