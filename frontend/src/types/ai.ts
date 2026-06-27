export interface AICitation {
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  textSnippet: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: AICitation[];
  timestamp: string;
}
