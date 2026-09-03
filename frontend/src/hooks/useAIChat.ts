'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { AIService } from '@/services/ai.service';
import { AIChatStorage } from '@/lib/ai-chat-storage';
import { AIConversation, AIChatMessage, AICitation } from '@/types/ai';

export function useAIChat(initialDocId?: string | null) {
  const { user } = useAuth();
  const userId = user?.id || 'guest_user';

  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [citationPanelState, setCitationPanelState] = useState<{
    isOpen: boolean;
    citations: AICitation[];
  }>({
    isOpen: false,
    citations: [],
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestIdRef = useRef<string | null>(null);

  // 1. Initial Hydration from Storage
  useEffect(() => {
    const loaded = AIChatStorage.readConversations(userId);
    if (loaded.length > 0) {
      // Find matching doc conversation or pick most recent
      let matched = loaded[0];
      if (initialDocId) {
        const found = loaded.find((c) => c.contextDocId === initialDocId);
        if (found) matched = found;
      }
      setConversations(loaded);
      setActiveConversationId(matched.id);
    } else {
      // Create initial conversation
      const initialConv: AIConversation = {
        id: `conv-${Date.now()}`,
        title: initialDocId ? 'Hỏi đáp tài liệu' : 'Hội thoại mới',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contextDocId: initialDocId || null,
        contextDocTitle: null,
        messages: [],
      };
      setConversations([initialConv]);
      setActiveConversationId(initialConv.id);
    }
    setIsHydrated(true);
  }, [userId, initialDocId]);

  // 2. Persist to storage whenever conversations change (only after hydrated)
  useEffect(() => {
    if (!isHydrated) return;
    AIChatStorage.saveConversations(userId, conversations);
  }, [conversations, isHydrated, userId]);

  // Active conversation object
  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeConversationId) ||
      conversations[0] ||
      null
    );
  }, [conversations, activeConversationId]);

  const messages = useMemo(() => {
    return activeConversation?.messages || [];
  }, [activeConversation]);

  // Create new conversation
  const createNewConversation = useCallback(
    (contextDocId?: string | null, contextDocTitle?: string | null) => {
      // Abort previous if pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setLoading(false);

      const newConv: AIConversation = {
        id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: contextDocTitle ? `Hỏi đáp: ${contextDocTitle.slice(0, 30)}` : 'Hội thoại mới',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contextDocId: contextDocId || null,
        contextDocTitle: contextDocTitle || null,
        messages: [],
      };

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setCitationPanelState({ isOpen: false, citations: [] });
      return newConv;
    },
    []
  );

  // Switch conversation
  const selectConversation = useCallback((convId: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setActiveConversationId(convId);
    setCitationPanelState({ isOpen: false, citations: [] });
  }, []);

  // Rename conversation
  const renameConversation = useCallback((convId: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, title: trimmed, updatedAt: new Date().toISOString() } : c
      )
    );
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(
    (convId: string) => {
      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== convId);
        if (filtered.length === 0) {
          const fresh: AIConversation = {
            id: `conv-${Date.now()}`,
            title: 'Hội thoại mới',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            contextDocId: null,
            contextDocTitle: null,
            messages: [],
          };
          setActiveConversationId(fresh.id);
          return [fresh];
        }
        if (activeConversationId === convId) {
          setActiveConversationId(filtered[0].id);
        }
        return filtered;
      });
    },
    [activeConversationId]
  );

  // Clear all conversations
  const clearAllConversations = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    AIChatStorage.clearAll(userId);

    const fresh: AIConversation = {
      id: `conv-${Date.now()}`,
      title: 'Hội thoại mới',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contextDocId: null,
      contextDocTitle: null,
      messages: [],
    };
    setConversations([fresh]);
    setActiveConversationId(fresh.id);
  }, [userId]);

  // Stop waiting (Abort)
  const stopWaiting = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    activeRequestIdRef.current = null;
    setLoading(false);

    // Mark the last assistant message as canceled if it was pending
    if (activeConversationId) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversationId) return c;
          const msgs = [...c.messages];
          const last = msgs[msgs.length - 1];
          if (last && last.role === 'assistant' && last.status === 'pending') {
            msgs[msgs.length - 1] = {
              ...last,
              status: 'canceled',
              content: 'Đã dừng chờ phản hồi từ Trợ lý AI.',
            };
          }
          return { ...c, messages: msgs, updatedAt: new Date().toISOString() };
        })
      );
    }
  }, [activeConversationId]);

  // Send message
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading || !activeConversationId) return;

      const currentConvId = activeConversationId;
      const targetConv = conversations.find((c) => c.id === currentConvId);
      if (!targetConv) return;

      const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      activeRequestIdRef.current = requestId;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const userMsg: AIChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
        status: 'success',
      };

      const pendingAssistantMsg: AIChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      // Auto update conversation title if first message
      const isFirstMessage = targetConv.messages.length === 0;
      const autoTitle = isFirstMessage ? trimmed.slice(0, 48) : targetConv.title;

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentConvId) return c;
          return {
            ...c,
            title: autoTitle,
            updatedAt: new Date().toISOString(),
            messages: [...c.messages, userMsg, pendingAssistantMsg],
          };
        })
      );

      setLoading(true);

      try {
        const response = await AIService.sendMessage(
          trimmed,
          targetConv.contextDocId || undefined,
          [...targetConv.messages, userMsg],
          controller.signal
        );

        // Ensure response belongs to this exact request and conversation is still active
        if (activeRequestIdRef.current !== requestId) return;

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentConvId) return c;
            const updatedMessages = c.messages.map((m) =>
              m.id === pendingAssistantMsg.id
                ? {
                    ...response,
                    id: pendingAssistantMsg.id,
                  }
                : m
            );
            return {
              ...c,
              updatedAt: new Date().toISOString(),
              messages: updatedMessages,
            };
          })
        );
      } catch (err: unknown) {
        if (activeRequestIdRef.current !== requestId) return;

        const isAbort =
          err instanceof Error &&
          (err.name === 'AbortError' || err.message?.includes('aborted'));

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentConvId) return c;
            const updatedMessages = c.messages.map((m) =>
              m.id === pendingAssistantMsg.id
                ? {
                    ...m,
                    status: isAbort ? ('canceled' as const) : ('error' as const),
                    content: isAbort
                      ? 'Đã dừng chờ phản hồi từ Trợ lý AI.'
                      : err instanceof Error
                      ? `Lỗi: ${err.message}`
                      : 'Không thể kết nối đến Trợ lý AI.',
                    errorMessage: err instanceof Error ? err.message : 'Unknown error',
                  }
                : m
            );
            return {
              ...c,
              updatedAt: new Date().toISOString(),
              messages: updatedMessages,
            };
          })
        );
      } finally {
        if (activeRequestIdRef.current === requestId) {
          setLoading(false);
          abortControllerRef.current = null;
          activeRequestIdRef.current = null;
        }
      }
    },
    [loading, activeConversationId, conversations]
  );

  // Retry failed/canceled message
  const retryMessage = useCallback(
    (messageId: string) => {
      if (!activeConversation) return;
      const msgIndex = activeConversation.messages.findIndex((m) => m.id === messageId);
      if (msgIndex === -1) return;

      // Find the corresponding user message
      let userMsg: AIChatMessage | null = null;
      if (activeConversation.messages[msgIndex].role === 'user') {
        userMsg = activeConversation.messages[msgIndex];
      } else if (msgIndex > 0 && activeConversation.messages[msgIndex - 1].role === 'user') {
        userMsg = activeConversation.messages[msgIndex - 1];
      }

      if (!userMsg) return;

      // Remove the failed pair and resend
      const cleanedMessages = activeConversation.messages.filter(
        (m, idx) => idx !== msgIndex && (msgIndex > 0 ? idx !== msgIndex - 1 : true)
      );

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id ? { ...c, messages: cleanedMessages } : c
        )
      );

      sendMessage(userMsg.content);
    },
    [activeConversation, sendMessage]
  );

  const openCitationPanel = useCallback((citations: AICitation[]) => {
    setCitationPanelState({ isOpen: true, citations });
  }, []);

  const closeCitationPanel = useCallback(() => {
    setCitationPanelState({ isOpen: false, citations: [] });
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    messages,
    loading,
    isHydrated,
    isSidebarOpen,
    setIsSidebarOpen,
    citationPanelState,
    openCitationPanel,
    closeCitationPanel,
    createNewConversation,
    selectConversation,
    renameConversation,
    deleteConversation,
    clearAllConversations,
    sendMessage,
    stopWaiting,
    retryMessage,
  };
}
