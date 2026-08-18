import { apiClient } from './api-client';
import type { AIChatMessage, AICitation } from '../types/ai';

interface AISearchResultItem {
  id: string;
  title: string;
  description?: string;
  abstract?: string;
  distance?: number;
}

interface AISearchResponse {
  query: string;
  answer: string;
  results?: AISearchResultItem[];
}

interface AIAskSource {
  document_id: string;
  title: string;
  page: number;
  chunk_index: number;
  snippet: string;
  distance?: number;
}

interface AIAskResponse {
  query: string;
  answer: string;
  sources?: AIAskSource[];
}

export const AIService = {
  async getInitialHistory(): Promise<AIChatMessage[]> {
    // Trả về danh sách rỗng ban đầu khi bắt đầu phiên hội thoại mới
    return [];
  },

  async sendMessage(
    message: string,
    contextDocId?: string,
    history?: AIChatMessage[],
    signal?: AbortSignal
  ): Promise<AIChatMessage> {
    if (contextDocId) {
      // Hỏi đáp ngữ cảnh tài liệu cụ thể: POST /api/v1/ai/ask
      const data = await apiClient.post<AIAskResponse>(
        '/ai/ask',
        {
          query: message,
          documentId: contextDocId,
          history: history?.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        },
        { signal }
      );

      const citations: AICitation[] = (data.sources ?? []).map((s) => ({
        id: `${s.document_id}:${s.chunk_index}`,
        documentId: s.document_id,
        documentTitle: s.title,
        pageNumber: s.page,
        textSnippet: s.snippet,
      }));

      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'Trợ lý AI không tìm thấy nội dung phù hợp trong tài liệu này.',
        timestamp: new Date().toISOString(),
        citations,
      };
    }

    // Tìm kiếm / hỏi đáp toàn thư viện: POST /api/v1/ai/search
    const data = await apiClient.post<AISearchResponse>(
      '/ai/search',
      {
        query: message,
      },
      { signal }
    );

    const citations: AICitation[] = (data.results ?? []).map((r) => ({
      id: r.id,
      documentId: r.id,
      documentTitle: r.title,
      pageNumber: 1,
      textSnippet: r.description || r.abstract || '',
    }));

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: data.answer || 'Trợ lý AI đã xử lý xong yêu cầu của bạn.',
      timestamp: new Date().toISOString(),
      citations,
    };
  },
};
