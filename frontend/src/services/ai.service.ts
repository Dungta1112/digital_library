import { apiClient } from './api-client';
import type { AIChatMessage, AICitation } from '../types/ai';

interface AISearchResultItem {
  id: string;
  title: string;
  description?: string;
  abstract?: string;
  distance?: number;
  page?: number;
  pageNumber?: number;
}

interface AISearchResponse {
  query: string;
  answer: string;
  results?: AISearchResultItem[];
}

interface AIAskSource {
  document_id?: string;
  documentId?: string;
  title?: string;
  documentTitle?: string;
  page?: number;
  pageNumber?: number;
  chunk_index?: number;
  snippet?: string;
  textSnippet?: string;
  distance?: number;
}

interface AIAskResponse {
  query: string;
  answer: string;
  sources?: AIAskSource[];
  citations?: AIAskSource[];
}

export const AIService = {
  async sendMessage(
    message: string,
    contextDocId?: string,
    history?: AIChatMessage[],
    signal?: AbortSignal
  ): Promise<AIChatMessage> {
    if (contextDocId) {
      // Chế độ hỏi đáp theo tài liệu cụ thể: POST /api/v1/ai/ask
      const data = await apiClient.post<AIAskResponse>(
        '/ai/ask',
        {
          query: message,
          documentId: contextDocId,
          history: (history || [])
            .filter((m) => m.status !== 'error' && m.status !== 'canceled' && m.content)
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.content })),
        },
        { signal }
      );

      const rawSources = data.sources || data.citations || [];

      if (!data.answer?.trim()) {
        throw new Error('Máy chủ AI không trả về nội dung câu trả lời.');
      }

      const citations: AICitation[] = rawSources
        .filter((item) => Boolean((item.document_id || item.documentId) && (item.title || item.documentTitle)))
        .map((item, idx) => {
        const docId = item.document_id || item.documentId;
        const pageNumber = typeof item.page === 'number' ? item.page : typeof item.pageNumber === 'number' ? item.pageNumber : undefined;

        return {
          id: `${docId}:${item.chunk_index ?? idx}`,
          documentId: docId!,
          documentTitle: (item.title || item.documentTitle)!,
          pageNumber,
          textSnippet: item.snippet || item.textSnippet || '',
        };
      });

      return {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
        status: 'success',
        citations: citations.length > 0 ? citations : undefined,
      };
    }

    // Chế độ tìm kiếm / hỏi đáp toàn thư viện: POST /api/v1/ai/search
    const data = await apiClient.post<AISearchResponse>(
      '/ai/search',
      {
        query: message,
      },
      { signal }
    );

    if (!data.answer?.trim()) {
      throw new Error('Máy chủ AI không trả về nội dung câu trả lời.');
    }

    const citations: AICitation[] = (data.results || [])
      .filter((result) => Boolean(result.id && result.title))
      .map((r, idx) => {
      const pageNumber = typeof r.page === 'number' ? r.page : typeof r.pageNumber === 'number' ? r.pageNumber : undefined;

      return {
        id: r.id || `search-res-${idx}`,
        documentId: r.id,
        documentTitle: r.title,
        pageNumber,
        textSnippet: r.description || r.abstract || '',
      };
    });

    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      role: 'assistant',
      content: data.answer,
      timestamp: new Date().toISOString(),
      status: 'success',
      citations: citations.length > 0 ? citations : undefined,
    };
  },
};
