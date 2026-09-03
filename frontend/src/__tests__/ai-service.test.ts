import { describe, it, expect, vi } from 'vitest';
import { AIService } from '../services/ai.service';
import { apiClient } from '../services/api-client';

describe('AIService Integrity & Error Handling', () => {
  it('sendMessage() should forward real citations from backend', async () => {
    const mockBackendAnswer = {
      answer: 'Giải tích 1 nghiên cứu về đạo hàm và tích phân.',
      citations: [
        {
          id: 'cit-1',
          documentId: 'doc-1',
          documentTitle: 'Giáo trình Giải tích 1',
          pageNumber: 42,
          textSnippet: 'Đạo hàm của hàm số tại một điểm...',
        },
      ],
    };

    vi.spyOn(apiClient, 'post').mockResolvedValueOnce(mockBackendAnswer as unknown as never);

    const response = await AIService.sendMessage('Học phần này gồm những gì?', 'doc-1');

    expect(response.role).toBe('assistant');
    expect(response.content).toContain('Giải tích 1 nghiên cứu');
    expect(response.citations).toHaveLength(1);
    expect(response.citations?.[0].pageNumber).toBe(42);
    expect(response.citations?.[0].documentTitle).toBe('Giáo trình Giải tích 1');
  });

  it('sendMessage() should throw real error when backend fails without producing mock fallback answers', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValueOnce(new Error('Dịch vụ AI đang bận'));

    await expect(AIService.sendMessage('Hello AI')).rejects.toThrow('Dịch vụ AI đang bận');
  });
});
