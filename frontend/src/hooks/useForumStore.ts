'use client';

import { create } from 'zustand';
import { ForumService } from '@/services/forum.service';
import { ForumPost } from '@/types/forum';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface PostReactionState {
  myReaction?: ReactionType;
  counts: Record<ReactionType, number>;
  total: number;
}

interface ForumState {
  posts: ForumPost[];
  loading: boolean;
  error: string | null;
  // Reactions local storage mapping
  reactions: Record<string, PostReactionState>;
  // Active drafts
  drafts: { title: string; content: string };
  
  // Actions
  fetchPosts: (category?: string) => Promise<void>;
  createPost: (title: string, content: string, category?: string) => Promise<ForumPost | null>;
  deletePost: (postId: string) => Promise<boolean>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  
  // Local Reaction toggle action (Optimistic UI)
  setReaction: (postId: string, reaction: ReactionType | undefined) => void;
  
  // Draft Actions
  saveDraft: (title: string, content: string) => void;
  clearDraft: () => void;
  loadDraft: () => void;
}

export const useForumStore = create<ForumState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  reactions: {},
  drafts: { title: '', content: '' },

  fetchPosts: async (category) => {
    set({ loading: true, error: null });
    try {
      const posts = await ForumService.getPosts(category);
      
      // Initialize reactions randomly/mock if not present in localStorage to make it lively
      const storedReactions = typeof window !== 'undefined' ? localStorage.getItem('forum_reactions_v1') : null;
      const localReactions = storedReactions ? JSON.parse(storedReactions) : {};
      
      const newReactions = { ...localReactions };
      posts.forEach(post => {
        if (!newReactions[post.id]) {
          // Generate a base count using the post.likes count
          const baseLikes = post.likes || 0;
          newReactions[post.id] = {
            myReaction: undefined,
            counts: {
              like: baseLikes > 0 ? Math.ceil(baseLikes * 0.6) : 0,
              love: baseLikes > 0 ? Math.floor(baseLikes * 0.3) : 0,
              haha: 0,
              wow: baseLikes > 0 ? Math.floor(baseLikes * 0.1) : 0,
              sad: 0,
              angry: 0,
            },
            total: baseLikes
          };
        }
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('forum_reactions_v1', JSON.stringify(newReactions));
      }
      set({ posts, reactions: newReactions, loading: false });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Lỗi khi tải bài viết', loading: false });
    }
  },

  createPost: async (title, content, category) => {
    set({ loading: true, error: null });
    try {
      const newPost = await ForumService.createPost(title, content, category);
      
      // Initialize reactions for new post
      const updatedReactions = { ...get().reactions };
      updatedReactions[newPost.id] = {
        myReaction: undefined,
        counts: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        total: 0
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('forum_reactions_v1', JSON.stringify(updatedReactions));
      }
      
      set(state => ({
        posts: [newPost, ...state.posts],
        reactions: updatedReactions,
        loading: false
      }));
      
      get().clearDraft();
      return newPost;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Lỗi khi tạo bài viết', loading: false });
      return null;
    }
  },

  deletePost: async (postId) => {
    try {
      await ForumService.getPostById(postId);
      
      set(state => ({
        posts: state.posts.filter(p => p.id !== postId)
      }));
      return true;
    } catch (err) {
      console.error('Delete post error:', err);
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

  setReaction: (postId, reaction) => {
    const currentReactions = { ...get().reactions };
    const postReaction = currentReactions[postId] || {
      myReaction: undefined,
      counts: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      total: 0
    };

    const previousMyReaction = postReaction.myReaction;
    
    // Copy the counts
    const updatedCounts = { ...postReaction.counts };
    
    // Decrement previous reaction count if it existed
    if (previousMyReaction) {
      updatedCounts[previousMyReaction] = Math.max(0, updatedCounts[previousMyReaction] - 1);
    }
    
    // Increment new reaction count if provided
    if (reaction) {
      updatedCounts[reaction] = (updatedCounts[reaction] || 0) + 1;
    }
    
    // Calculate total
    const total = Object.values(updatedCounts).reduce((acc, curr) => acc + curr, 0);
    
    currentReactions[postId] = {
      myReaction: reaction,
      counts: updatedCounts,
      total
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('forum_reactions_v1', JSON.stringify(currentReactions));
    }
    
    // Update local state and optimistically adjust the post likes count
    set(state => ({
      reactions: currentReactions,
      posts: state.posts.map(post => {
        if (post.id === postId) {
          const diff = (reaction ? 1 : 0) - (previousMyReaction ? 1 : 0);
          return {
            ...post,
            likes: Math.max(0, post.likes + diff)
          };
        }
        return post;
      })
    }));
  },

  saveDraft: (title, content) => {
    const drafts = { title, content };
    set({ drafts });
    if (typeof window !== 'undefined') {
      localStorage.setItem('forum_post_draft', JSON.stringify(drafts));
    }
  },

  clearDraft: () => {
    set({ drafts: { title: '', content: '' } });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('forum_post_draft');
    }
  },

  loadDraft: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('forum_post_draft');
      if (stored) {
        set({ drafts: JSON.parse(stored) });
      }
    }
  }
}));
