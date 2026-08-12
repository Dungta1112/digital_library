'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { AIService } from '@/services/ai.service';
import { LibraryService } from '@/services/library.service';
import { AIChatMessage } from '@/types/ai';
import { ChatMessage } from '@/components/feature/AI/ChatMessage';
import { ChatInput } from '@/components/feature/AI/ChatInput';
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Robot, FilePdf, X } from '@phosphor-icons/react';

const SESSION_STORAGE_PREFIX = 'ai_chat_history';

function sessionStorageKey(docId: string | null): string {
  return docId ? `${SESSION_STORAGE_PREFIX}:${docId}` : `${SESSION_STORAGE_PREFIX}:global`;
}

function readMessagesFromSession(docId: string | null): AIChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(sessionStorageKey(docId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.messages) ? parsed.messages : [];
  } catch {
    return [];
  }
}

export default function AIChatPage() {
  return (
    <Suspense fallback={<AIChatSkeleton />}>
      <AIChat />
    </Suspense>
  );
}

function AIChatSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50/50 dark:bg-slate-950 items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Đang tải hội thoại…</p>
    </div>
  );
}

function AIChat() {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [contextDocTitle, setContextDocTitle] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevDocIdRef = useRef<string | null>(null);
  const { can, isLoading } = usePermissions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get('doc');

  // ===== DEBUG: theo dõi remount =====
  const mountRef = useRef(0);
  useEffect(() => {
    mountRef.current += 1;
    console.log(`[AIChat] mounted #${mountRef.current}`, new Date().toISOString());
    return () => {
      console.log(`[AIChat] UNMOUNTED #${mountRef.current}`, new Date().toISOString());
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      console.log(`[AIChat] visibility: ${document.visibilityState}, messages: ${messages.length}`);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [messages.length]);

  // ===== Khôi phục / lưu lịch sử chat (sessionStorage, tách riêng theo docId) =====
  useEffect(() => {
    const docChanged = prevDocIdRef.current !== docId;
    prevDocIdRef.current = docId;

    const restored = readMessagesFromSession(docId);
    if (docChanged || restored.length > 0) {
      setMessages(restored);
      return;
    }
    AIService.getInitialHistory().then((h) => {
      if (h.length > 0) {
        setMessages((prev) => (prev.length > 0 ? prev : h));
      }
    });
  }, [docId]);

  useEffect(() => {
    if (messages.length === 0) return;
    try {
      sessionStorage.setItem(sessionStorageKey(docId), JSON.stringify({ docId, messages }));
    } catch {
      // storage đầy/bị chặn — chỉ mất khả năng khôi phục sau khi remount
    }
  }, [messages, docId]);

  useEffect(() => {
    if (!isLoading && !can('ASK_AI')) {
      router.push('/login');
    }
  }, [isLoading, can, router]);

  useEffect(() => {
    if (!docId) {
      setContextDocTitle(null);
      return;
    }
    let cancelled = false;
    LibraryService.getDocumentById(docId).then((doc) => {
      if (!cancelled) {
        setContextDocTitle(doc?.title ?? docId);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [docId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) {
      setElapsed(0);
      return;
    }
    setElapsed(0);
    const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSend = async (text: string) => {
    const userMsg: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await AIService.sendMessage(text, docId ?? undefined, messages);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300 relative">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm z-10 sticky top-0 transition-colors duration-300">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm transition-colors duration-300">
            <Robot weight="duotone" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight transition-colors duration-300 tracking-tight">Trợ lý AI Học thuật</h1>
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest transition-colors duration-300 mt-0.5">Nghiên cứu • Tổng hợp • Trích dẫn</p>
          </div>
        </div>
        {docId && (
          <div className="flex items-center gap-2 max-w-[45%] bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-full pl-3 pr-1.5 py-1.5 transition-colors duration-300">
            <FilePdf weight="duotone" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 truncate">
              Đang hỏi theo tài liệu: <span className="font-bold">{contextDocTitle ?? '…'}</span>
            </span>
            <Link
              href="/ai"
              title="Thoát chế độ hỏi theo tài liệu"
              className="w-6 h-6 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/40 transition-colors shrink-0"
            >
              <X weight="bold" className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-full">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {loading && (
            <ChatMessage
              message={{ id: 'loading', role: 'assistant', content: '', timestamp: new Date().toISOString() }}
              loading
              elapsedMs={elapsed * 1000}
            />
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full sticky bottom-0">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
