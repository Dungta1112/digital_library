import { apiClient, getErrorStatus } from './api-client';
import type { ForumPost, ForumComment, ForumCategory } from '../types/forum';

interface ApiForumAuthor {
  id?: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  roles?: Array<string | { code?: string; role?: { code?: string } }>;
}

interface ApiForumComment {
  id: string;
  postId?: string;
  authorId?: string;
  author?: ApiForumAuthor;
  authorName?: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  likes?: number;
}

interface ApiForumPost {
  id: string;
  title: string;
  content: string;
  category?: ForumCategory;
  authorId?: string;
  author?: ApiForumAuthor;
  authorName?: string;
  authorRole?: string;
  tags?: string[];
  createdAt: string;
  likes?: number;
  commentsCount?: number;
  _count?: { comments?: number; likes?: number };
  comments?: ApiForumComment[];
}

function extractRole(author?: ApiForumAuthor): string {
  if (author?.role) return author.role;
  if (author?.roles && author.roles.length > 0) {
    const r = author.roles[0];
    if (typeof r === 'string') return r;
    if (typeof r === 'object') {
      if ('role' in r && r.role?.code) return r.role.code;
      if ('code' in r && r.code) return r.code;
    }
  }
  return 'UNKNOWN';
}

export function normalizeComment(comment: ApiForumComment, postId: string): ForumComment {
  return {
    id: comment.id,
    postId: comment.postId || postId,
    authorId: comment.authorId || comment.author?.id,
    authorName: comment.authorName || comment.author?.fullName || 'Chưa cập nhật',
    authorRole: comment.authorRole || extractRole(comment.author),
    content: comment.content,
    createdAt: comment.createdAt || undefined,
    likes: comment.likes ?? 0,
  };
}

export function normalizePost(post: ApiForumPost): ForumPost {
  const authorName = post.authorName || post.author?.fullName || 'Chưa cập nhật';
  const authorRole = post.authorRole || extractRole(post.author);
  const commentsCount = post.commentsCount ?? post._count?.comments ?? post.comments?.length ?? 0;
  const comments = (post.comments || []).map((c) => normalizeComment(c, post.id));

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId || post.author?.id,
    authorName,
    authorRole,
    category: post.category || 'GENERAL',
    tags: post.tags || [],
    createdAt: post.createdAt || undefined,
    likes: post.likes ?? post._count?.likes ?? 0,
    commentsCount,
    comments,
  };
}

export const ForumService = {
  async getPosts(category?: string, signal?: AbortSignal): Promise<ForumPost[]> {
    const params: Record<string, string> = {};
    if (category && category !== 'All' && category !== 'Tất cả') {
      params.category = category;
    }

    const response = signal
      ? await apiClient.get<ApiForumPost[] | { items: ApiForumPost[] }>('/forum/posts', { params, signal })
      : await apiClient.get<ApiForumPost[] | { items: ApiForumPost[] }>('/forum/posts', { params });
    const items = Array.isArray(response) ? response : response?.items || [];
    return items.map(normalizePost);
  },

  async getPostById(id: string, signal?: AbortSignal): Promise<ForumPost | null> {
    try {
      const post = await apiClient.get<ApiForumPost>(`/forum/posts/${id}`, { signal });
      return post ? normalizePost(post) : null;
    } catch (error) {
      if (getErrorStatus(error) === 404) return null;
      throw error;
    }
  },

  async createPost(title: string, content: string, category: ForumCategory = 'GENERAL'): Promise<ForumPost> {
    const post = await apiClient.post<ApiForumPost>('/forum/posts', {
      title: title.trim(),
      content: content.trim(),
      category,
    });
    return normalizePost(post);
  },

  async createComment(postId: string, content: string): Promise<ForumComment> {
    const comment = await apiClient.post<ApiForumComment>(`/forum/posts/${postId}/comments`, {
      content: content.trim(),
    });
    return normalizeComment(comment, postId);
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/forum/posts/${postId}/comments/${commentId}`);
  },

  async deletePost(postId: string, useModerationEndpoint = false): Promise<void> {
    const path = useModerationEndpoint
      ? `/content/forum/posts/${postId}`
      : `/forum/posts/${postId}`;
    await apiClient.delete(path);
  },
};
