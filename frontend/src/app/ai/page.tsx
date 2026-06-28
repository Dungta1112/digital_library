'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AIService } from '@/services/ai.service';
import { AIChatMessage } from '@/types/ai';
import { ChatMessage } from '@/components/feature/AI/ChatMessage';
import { ChatInput } from '@/components/feature/AI/ChatInput';
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import { Robot } from '@phosphor-icons/react';

export default function AIChatPage() {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { can, isLoading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !can('ASK_AI')) {
      router.push('/login');
    }
  }, [isLoading, can, router]);

  useEffect(() => {
    AIService.getInitialHistory().then(setMessages);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
      const urlParams = new URLSearchParams(window.location.search);
      const docId = urlParams.get('doc') || undefined;
      
      const response = await AIService.sendMessage(text, docId);
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
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-full">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {loading && (
            <div className="flex w-full justify-start mb-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl rounded-bl-sm p-5 shadow-sm flex gap-3 items-center w-[100px] h-[60px] transition-colors duration-300">
                <div className="flex gap-1.5 mx-auto">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                   <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
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
