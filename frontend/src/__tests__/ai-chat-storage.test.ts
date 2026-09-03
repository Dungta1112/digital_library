import { describe, it, expect, beforeEach } from 'vitest';
import { AIChatStorage } from '@/lib/ai-chat-storage';
import { AIConversation } from '@/types/ai';

describe('AIChatStorage Engine', () => {
  const userId = 'usr-test-001';

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should return empty list when no conversations are stored', () => {
    const list = AIChatStorage.readConversations(userId);
    expect(list).toEqual([]);
  });

  it('should save and read conversations from sessionStorage by default', () => {
    const mockConvs: AIConversation[] = [
      {
        id: 'conv-1',
        title: 'Hội thoại thử nghiệm',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contextDocId: null,
        contextDocTitle: null,
        messages: [
          {
            id: 'm1',
            role: 'user',
            content: 'Xin chào AI',
            timestamp: new Date().toISOString(),
            status: 'success',
          },
          {
            id: 'm2',
            role: 'assistant',
            content: 'Chào bạn! Tôi có thể giúp gì cho bạn?',
            timestamp: new Date().toISOString(),
            status: 'success',
          },
        ],
      },
    ];

    AIChatStorage.saveConversations(userId, mockConvs);
    const loaded = AIChatStorage.readConversations(userId);

    expect(loaded.length).toBe(1);
    expect(loaded[0].title).toBe('Hội thoại thử nghiệm');
    expect(loaded[0].messages.length).toBe(2);
  });

  it('should convert pending message status to interrupted on read', () => {
    const mockConvs: AIConversation[] = [
      {
        id: 'conv-pending',
        title: 'Hội thoại đang chờ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contextDocId: 'doc-ai-1',
        contextDocTitle: 'Giáo trình AI',
        messages: [
          {
            id: 'm1',
            role: 'user',
            content: 'Giải thích học máy',
            timestamp: new Date().toISOString(),
            status: 'success',
          },
          {
            id: 'm2',
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            status: 'pending',
          },
        ],
      },
    ];

    AIChatStorage.saveConversations(userId, mockConvs);
    const loaded = AIChatStorage.readConversations(userId);

    expect(loaded[0].messages[1].status).toBe('interrupted');
  });

  it('should support long-term localStorage toggle', () => {
    expect(AIChatStorage.isLongTermEnabled(userId)).toBe(false);

    AIChatStorage.setLongTermEnabled(userId, true);
    expect(AIChatStorage.isLongTermEnabled(userId)).toBe(true);

    const mockConvs: AIConversation[] = [
      {
        id: 'conv-lt',
        title: 'Lưu dài hạn',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contextDocId: null,
        contextDocTitle: null,
        messages: [],
      },
    ];

    AIChatStorage.saveConversations(userId, mockConvs);
    const loaded = AIChatStorage.readConversations(userId);
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('conv-lt');

    // Turn off
    AIChatStorage.setLongTermEnabled(userId, false);
    expect(AIChatStorage.isLongTermEnabled(userId)).toBe(false);
  });

  it('should clear all conversations for a user', () => {
    const mockConvs: AIConversation[] = [
      {
        id: 'conv-1',
        title: 'Xóa hội thoại',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contextDocId: null,
        contextDocTitle: null,
        messages: [],
      },
    ];

    AIChatStorage.saveConversations(userId, mockConvs);
    expect(AIChatStorage.readConversations(userId).length).toBe(1);

    AIChatStorage.clearAll(userId);
    expect(AIChatStorage.readConversations(userId).length).toBe(0);
  });
});
