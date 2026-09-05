import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/services/api-client';
import { ForumService } from '@/services/forum.service';

describe('ForumService', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('sends a real category query', async () => {
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce([] as never);
    await ForumService.getPosts('QUESTIONS');
    expect(getSpy).toHaveBeenCalledWith('/forum/posts', { params: { category: 'QUESTIONS' } });
  });

  it('creates a post with the backend enum category', async () => {
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      id: 'post-1',
      title: 'Câu hỏi',
      content: 'Nội dung',
      category: 'QUESTIONS',
      createdAt: '2026-09-05T00:00:00Z',
    } as never);
    const created = await ForumService.createPost(' Câu hỏi ', ' Nội dung ', 'QUESTIONS');
    expect(postSpy).toHaveBeenCalledWith('/forum/posts', {
      title: 'Câu hỏi',
      content: 'Nội dung',
      category: 'QUESTIONS',
    });
    expect(created.category).toBe('QUESTIONS');
  });

  it('deletes through the normal or moderation endpoint', async () => {
    const deleteSpy = vi.spyOn(apiClient, 'delete').mockResolvedValue(undefined as never);
    await ForumService.deletePost('post-1');
    await ForumService.deletePost('post-2', true);
    expect(deleteSpy).toHaveBeenNthCalledWith(1, '/forum/posts/post-1');
    expect(deleteSpy).toHaveBeenNthCalledWith(2, '/content/forum/posts/post-2');
  });

  it('propagates list errors instead of returning an empty feed', async () => {
    const failure = new Error('Backend unavailable');
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce(failure);
    await expect(ForumService.getPosts()).rejects.toBe(failure);
  });
});
