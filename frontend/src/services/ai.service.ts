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

  async sendMessage(message: string, contextDocId?: string): Promise<AIChatMessage> {
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

    // Backend NestJS proxy sang ai_service: POST /api/v1/ai/search
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
