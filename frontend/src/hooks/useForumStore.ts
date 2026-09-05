'use client';

import { create } from 'zustand';
import { ForumService } from '@/services/forum.service';
import { ForumCategory, ForumPost } from '@/types/forum';

interface ForumState {
  posts: ForumPost[];
  loading: boolean;
  error: string | null;
  drafts: { title: string; content: string };
  
  // Actions
  fetchPosts: (category?: string) => Promise<void>;
  createPost: (title: string, content: string, category?: ForumCategory) => Promise<ForumPost | null>;
  deletePost: (postId: string, useModerationEndpoint?: boolean) => Promise<boolean>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  
  saveDraft: (userId: string, title: string, content: string) => void;
  clearDraft: (userId: string) => void;
  loadDraft: (userId: string) => void;
}

const draftKey = (userId: string) => `tvu_forum_feed_draft_${userId}`;

export const useForumStore = create<ForumState>((set) => ({
  posts: [],
  loading: false,
  error: null,
  drafts: { title: '', content: '' },

  fetchPosts: async (category) => {
    set({ loading: true, error: null });
    try {
      const posts = await ForumService.getPosts(category);
      set({ posts, loading: false });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Lỗi khi tải bài viết', loading: false });
    }
  },

  createPost: async (title, content, category) => {
    set({ loading: true, error: null });
    try {
      const newPost = await ForumService.createPost(title, content, category);
      set(state => ({
        posts: [newPost, ...state.posts],
        loading: false
      }));
      return newPost;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Lỗi khi tạo bài viết', loading: false });
      return null;
    }
  },

  deletePost: async (postId, useModerationEndpoint = false) => {
    set({ error: null });
    try {
      await ForumService.deletePost(postId, useModerationEndpoint);
      
      set(state => ({
        posts: state.posts.filter(p => p.id !== postId)
      }));
      return true;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Không thể xóa bài viết' });
      return false;
    }
  },

  addComment: async (postId, content) => {
    try {
      const newComment = await ForumService.createComment(postId, content);
      
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              commentsCount: post.commentsCount + 1,
              comments: [...(post.comments || []), newComment]
            };
          }
          return post;
        })
      }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Lỗi khi gửi bình luận' });
      throw err;
    }
  },

  deleteComment: async (postId, commentId) => {
    try {
      await ForumService.deleteComment(postId, commentId);
      
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              commentsCount: Math.max(0, post.commentsCount - 1),
              comments: (post.comments || []).filter(c => c.id !== commentId)
            };
          }
          return post;
        })
      }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Lỗi khi xóa bình luận' });
      throw err;
    }
  },

  saveDraft: (userId, title, content) => {
    const drafts = { title, content };
    set({ drafts });
    if (typeof window !== 'undefined') {
      localStorage.setItem(draftKey(userId), JSON.stringify(drafts));
    }
  },

  clearDraft: (userId) => {
    set({ drafts: { title: '', content: '' } });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(draftKey(userId));
    }
  },

  loadDraft: (userId) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(draftKey(userId));
        set({ drafts: stored ? JSON.parse(stored) : { title: '', content: '' } });
      } catch {
        set({ drafts: { title: '', content: '' } });
      }
    }
  }
}));
