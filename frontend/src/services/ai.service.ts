import { apiClient } from './api.client';
import { config, fetchWithMock } from './config';
import type { AIChatMessage, AICitation } from '../types/ai';

interface AISearchResultItem {
  id: string;
  title: string;
  description: string;
  distance: number;
}

interface AISearchResponse {
  query: string;
  answer: string;
  results: AISearchResultItem[];
}

interface AIAskSource {
  document_id: string;
  title: string;
  page: number;
  chunk_index: number;
  snippet: string;
  distance: number;
}

interface AIAskResponse {
  query: string;
  answer: string;
  sources: AIAskSource[];
}

export const AIService = {
  async getInitialHistory(): Promise<AIChatMessage[]> {
    if (!config.USE_MOCKS) {
      // Backend chưa lưu lịch sử chat — bắt đầu với hội thoại trống.
      return [];
    }
    return fetchWithMock<AIChatMessage[]>(
      () => import('../mocks/ai.json').then(m => ({ default: m.default as AIChatMessage[] }))
    );
  },

  async sendMessage(message: string, contextDocId?: string, history?: AIChatMessage[]): Promise<AIChatMessage> {
    if (config.USE_MOCKS) {
      // simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `This is a simulated AI response to: "${message}". ${contextDocId ? 'I have analyzed document ID ' + contextDocId + ' to answer your question.' : 'I searched the general library corpus to formulate this answer.'}`,
        timestamp: new Date().toISOString(),
        citations: contextDocId ? [
          {
            id: 'cit1',
            documentId: contextDocId,
            documentTitle: 'Contextual Document Title',
            pageNumber: 1,
            textSnippet: 'This is a simulated text snippet demonstrating how the AI pulls exact quotes from the referenced material to support its claims.'
          }
        ] : [
          {
            id: 'cit2',
            documentId: '1',
            documentTitle: 'Machine Learning in Healthcare',
            pageNumber: 12,
            textSnippet: 'ML models have significantly improved diagnostic accuracy...'
          }
        ]
      };
    }

    if (contextDocId) {
      // Hỏi theo nội dung 1 tài liệu cụ thể: POST /api/v1/ai/ask (cần đăng nhập).
      // Citations là trích đoạn thật từ file kèm số trang chính xác.
      const data = (await apiClient.post('/ai/ask', {
        query: message,
        documentId: contextDocId,
        history: history?.slice(-6).map((m) => ({ role: m.role, content: m.content })),
      })) as unknown as AIAskResponse;

      const citations: AICitation[] = (data.sources ?? []).map((s) => ({
        id: `${s.document_id}:${s.chunk_index}`,
        documentId: s.document_id,
        documentTitle: s.title,
        pageNumber: s.page,
        textSnippet: s.snippet,
      }));

      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
        citations,
      };
    }

    // Không có tài liệu ngữ cảnh: tìm sách toàn thư viện như cũ.
    const data = (await apiClient.post('/ai/search', {
      query: message,
    })) as unknown as AISearchResponse;

    const citations: AICitation[] = (data.results ?? []).map((r) => ({
      id: r.id,
      documentId: r.id,
      documentTitle: r.title,
      pageNumber: 1,
      textSnippet: r.description,
    }));

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: data.answer,
      timestamp: new Date().toISOString(),
      citations,
    };
  }
};
