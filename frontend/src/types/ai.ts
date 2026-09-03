export interface AICitation {
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  textSnippet: string;
}

export type AIChatRole = 'user' | 'assistant';

export type AIChatStatus =
  | 'idle'
  | 'pending'
  | 'success'
  | 'error'
  | 'canceled'
  | 'interrupted';

export interface AIChatMessage {
  id: string;
  role: AIChatRole;
  content: string;
  citations?: AICitation[];
  timestamp: string;
  status?: AIChatStatus;
  errorMessage?: string;
}

export interface AIConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  contextDocId?: string | null;
  contextDocTitle?: string | null;
  messages: AIChatMessage[];
}

export interface AIStoragePayload {
  version: number;
  userId: string;
  conversations: AIConversation[];
  activeConversationId: string | null;
  persistLongTerm?: boolean;
}
