import { AIConversation, AIChatMessage } from '@/types/ai';

const STORAGE_VERSION = 1;
const STORAGE_PREFIX = `ai_chat_v${STORAGE_VERSION}`;
const MAX_CONVERSATIONS = 50;

function getStorageKey(userId: string): string {
  const safeUserId = userId ? userId.replace(/[^a-zA-Z0-9_-]/g, '_') : 'guest';
  return `${STORAGE_PREFIX}:${safeUserId}`;
}

function getSettingsKey(userId: string): string {
  const safeUserId = userId ? userId.replace(/[^a-zA-Z0-9_-]/g, '_') : 'guest';
  return `${STORAGE_PREFIX}_settings:${safeUserId}`;
}

export const AIChatStorage = {
  isLongTermEnabled(userId: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(getSettingsKey(userId)) === 'true';
    } catch {
      return false;
    }
  },

  setLongTermEnabled(userId: string, enabled: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getSettingsKey(userId), String(enabled));
      if (!enabled) {
        localStorage.removeItem(getStorageKey(userId));
      }
    } catch {
      // ignore
    }
  },

  readConversations(userId: string): AIConversation[] {
    if (typeof window === 'undefined') return [];
    const key = getStorageKey(userId);
    const useLongTerm = this.isLongTermEnabled(userId);

    let rawData: string | null = null;
    try {
      if (useLongTerm) {
        rawData = localStorage.getItem(key);
      }
      if (!rawData) {
        rawData = sessionStorage.getItem(key);
      }
    } catch {
      return [];
    }

    if (!rawData) return [];

    try {
      const parsed = JSON.parse(rawData);
      if (!Array.isArray(parsed)) return [];

      // Validate & clean up messages (convert any hanging pending status to interrupted)
      const sanitized: AIConversation[] = parsed.slice(0, MAX_CONVERSATIONS).map((conv) => {
        const messages: AIChatMessage[] = Array.isArray(conv.messages)
          ? conv.messages.map((m: AIChatMessage) => ({
              ...m,
              status: m.status === 'pending' ? 'interrupted' : m.status || 'success',
            }))
          : [];

        return {
          id: String(conv.id || `conv-${Date.now()}`),
          title: String(conv.title || 'Hội thoại mới'),
          createdAt: String(conv.createdAt || new Date().toISOString()),
          updatedAt: String(conv.updatedAt || new Date().toISOString()),
          contextDocId: conv.contextDocId || null,
          contextDocTitle: conv.contextDocTitle || null,
          messages,
        };
      });

      return sanitized.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (e) {
      console.warn('Lỗi phân tích dữ liệu lịch sử AI Chat:', e);
      return [];
    }
  },

  saveConversations(userId: string, conversations: AIConversation[]): void {
    if (typeof window === 'undefined') return;
    const key = getStorageKey(userId);
    const useLongTerm = this.isLongTermEnabled(userId);

    const limited = conversations.slice(0, MAX_CONVERSATIONS);
    try {
      const serialized = JSON.stringify(limited);
      sessionStorage.setItem(key, serialized);
      if (useLongTerm) {
        localStorage.setItem(key, serialized);
      }
    } catch (e) {
      console.warn('Không thể lưu lịch sử AI Chat vào bộ nhớ cục bộ:', e);
    }
  },

  clearAll(userId: string): void {
    if (typeof window === 'undefined') return;
    const key = getStorageKey(userId);
    try {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
