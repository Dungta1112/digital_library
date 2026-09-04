'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GroupService } from '@/services/group.service';
import { ChatMessage } from '@/types/group';
import { useAuth } from './useAuth';

export interface UseGroupMessagesReturn {
  messages: ChatMessage[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  scrollToBottom: (smooth?: boolean) => void;
  hasUnseenNewMessages: boolean;
  lastSyncedAt: Date | null;
}

export function useGroupMessages(groupId: string): UseGroupMessagesReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnseenNewMessages, setHasUnseenNewMessages] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef<boolean>(true);

  // Check if user is scrolled near bottom
  const checkIsNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return true;
    const threshold = 150; // px
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    return position <= threshold;
  }, []);

  const handleScroll = useCallback(() => {
    const near = checkIsNearBottom();
    isNearBottomRef.current = near;
    if (near) {
      setHasUnseenNewMessages(false);
    }
  }, [checkIsNearBottom]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
      setHasUnseenNewMessages(false);
    }
  }, []);

  useEffect(() => {
    if (!groupId) return;
    let ignore = false;
    const controller = new AbortController();

    GroupService.getGroupMessages(groupId, controller.signal)
      .then((data) => {
        if (!ignore) {
          setMessages((prev) => {
            const pending = prev.filter((m) => m.status === 'pending' || m.status === 'failed');
            const serverMap = new Map(data.map((m) => [m.id, m]));
            const merged = [...data];
            for (const p of pending) {
              if (!serverMap.has(p.id)) {
                merged.push(p);
              }
            }
            return merged;
          });
          setLastSyncedAt(new Date());
          setError(null);
          setLoading(false);

          if (isNearBottomRef.current) {
            setTimeout(() => scrollToBottom(false), 50);
          } else {
            setHasUnseenNewMessages(true);
          }
        }
      })
      .catch((err: unknown) => {
        if (!ignore && !controller.signal.aborted) {
          console.error('Lỗi khi tải tin nhắn:', err);
          setError('Không thể tải tin nhắn. Nhấn làm mới để thử lại.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [groupId, reloadKey, scrollToBottom]);

  // Send message with optimistic update and real ID reconciliation
  const sendMessage = async (content: string): Promise<boolean> => {
    const trimmed = content.trim();
    if (!trimmed || !user || sending) return false;

    setSending(true);
    setError(null);

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const tempMsg: ChatMessage = {
      id: tempId,
      groupId,
      senderId: user.id || 'user',
      senderName: user.fullName || 'Bạn',
      content: trimmed,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    // Optimistically append
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(() => scrollToBottom(true), 50);

    try {
      const confirmedMsg = await GroupService.sendGroupMessage(groupId, trimmed);
      // Reconcile: replace tempMsg with confirmed message from server
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...confirmedMsg,
                status: 'confirmed',
              }
            : m
        )
      );
      setLastSyncedAt(new Date());
      return true;
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
      // Mark as failed instead of silently vanishing
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                status: 'failed',
              }
            : m
        )
      );
      setError('Gửi tin nhắn thất bại. Vui lòng kiểm tra kết nối.');
      return false;
    } finally {
      setSending(false);
    }
  };

  const refresh = async () => {
    setReloadKey((k) => k + 1);
  };

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refresh,
    scrollContainerRef,
    messagesEndRef,
    scrollToBottom,
    hasUnseenNewMessages,
    lastSyncedAt,
  };
}
