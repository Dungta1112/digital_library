import { apiClient } from './api.client';
import { runWithMock } from './config';
import type {
  CreateCommentInput,
  CreatePostInput,
  ForumComment,
  ForumPost,
} from '../types/forum';

let mockPosts: ForumPost[] | null = null;

async function getMockPosts() {
  if (!mockPosts) {
    const mockModule = await import('../mocks/forum.json');
    // Clone so creating mock posts/comments does not mutate the imported JSON module.
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
        if (!category || category === 'Tất cả') return [...posts];
        return posts.filter((post) => post.category === category);
      },
      async () => {
        const params = new URLSearchParams();
        if (category && category !== 'Tất cả') params.append('category', category);

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

  async createPost(input: CreatePostInput): Promise<ForumPost> {
    return runWithMock(
      async () => {
        const posts = await getMockPosts();
        const post: ForumPost = {
          id: createMockId('post'),
          title: input.title,
          content: input.content,
          authorName: 'Tài khoản Demo',
          authorRole: 'STUDENT',
          category: input.category,
          tags: input.tags,
          createdAt: new Date().toISOString(),
          likes: 0,
          views: 0,
          commentsCount: 0,
          attachments: input.attachments || [],
          comments: [],
        };
        posts.unshift(post);
        return post;
      },
      () => apiClient.post<unknown, ForumPost>('/forum/posts', input)
    );
  },

  async createComment(
    postId: string,
    input: CreateCommentInput
  ): Promise<ForumComment> {
    return runWithMock(
      async () => {
        const posts = await getMockPosts();
        const comment: ForumComment = {
          id: createMockId('comment'),
          postId,
          authorName: 'Tài khoản Demo',
          authorRole: 'STUDENT',
          content: input.content,
          createdAt: new Date().toISOString(),
          likes: 0,
          attachments: input.attachments || [],
        };
        const post = posts.find((item) => item.id === postId);
        if (post) {
          post.comments = [...(post.comments || []), comment];
          post.commentsCount = post.comments.length;
        }
        return comment;
      },
      () =>
        apiClient.post<unknown, ForumComment>(
          `/forum/posts/${postId}/comments`,
          input
        )
    );
  },
};
