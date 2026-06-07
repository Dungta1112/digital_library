import { fetchWithMock } from './config';
import type { AIChatMessage } from '../types/ai';

export const AIService = {
  async getInitialHistory(): Promise<AIChatMessage[]> {
    return fetchWithMock<AIChatMessage[]>(
      () => import('../mocks/ai.json').then(m => ({ default: m.default as AIChatMessage[] }))
    );
  },
  
  async sendMessage(message: string, contextDocId?: string): Promise<AIChatMessage> {
    if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
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
    
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, contextDocId })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  }
};
