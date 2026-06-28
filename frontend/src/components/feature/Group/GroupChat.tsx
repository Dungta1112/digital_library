'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GroupService } from '@/services/group.service';
import { ChatMessage } from '@/types/group';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { PaperPlaneTilt, Plus, Hash, HandWaving } from '@phosphor-icons/react';

export function GroupChat({ groupId }: { groupId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    GroupService.getGroupMessages(groupId).then(data => {
      setMessages(data);
      setLoading(false);
    });
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    setSending(true);
    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      groupId,
      senderId: user.id || 'current-user',
      senderName: user.fullName,
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMsg]);
    const currentInput = inputValue;
    setInputValue('');

    try {
      await GroupService.sendGroupMessage(groupId, currentInput);
    } catch (err) {
      console.error('Failed to send message', err);
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setInputValue(currentInput);
    } finally {
      setSending(false);
    }
  };

  // Deterministic gradient for an avatar based on sender name
  const getAvatarGradient = (name: string) => {
    const gradients = [
      'from-emerald-400 to-cyan-500',
      'from-teal-400 to-emerald-500',
      'from-cyan-400 to-teal-500',
      'from-emerald-500 to-green-600',
    ];
    return gradients[name.length % gradients.length];
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400 dark:text-gray-500">Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="h-12 px-4 flex items-center border-b border-gray-200 dark:border-slate-800 flex-shrink-0 bg-white dark:bg-slate-950 transition-colors duration-300 z-10">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm transition-colors duration-300">
          <Hash weight="bold" className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          general
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 transition-colors duration-300">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
              <HandWaving weight="duotone" className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Start the conversation</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Be the first to send a message in this channel.</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {messages.map((msg, index) => {
              const isConsecutive = index > 0 && messages[index - 1].senderId === msg.senderId && 
                (new Date(msg.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() < 300000);

              return (
                <div key={msg.id} className={`flex group hover:bg-gray-50/80 dark:hover:bg-slate-900/50 -mx-4 px-4 py-0.5 transition-colors rounded-md ${isConsecutive ? 'mt-0' : 'mt-3'}`}>
                  {!isConsecutive ? (
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarGradient(msg.senderName)} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5`}>
                      {msg.senderName.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-9 flex-shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 dark:text-gray-500 font-medium select-none pt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                  
                  <div className="ml-3 flex-1 min-w-0">
                    {!isConsecutive && (
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {msg.senderName}
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                          {new Date(msg.timestamp).toLocaleDateString() === new Date().toLocaleDateString() 
                            ? `Today ${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : new Date(msg.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-5 pt-2 bg-white dark:bg-slate-950 transition-colors duration-300">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <button type="button" className="absolute left-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <Plus weight="bold" className="w-5 h-5" />
          </button>
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={user ? "Message #general" : "Log in to send messages"}
            disabled={!user || sending}
            className="w-full pl-12 pr-12 py-2.5 bg-gray-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500/40 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg text-sm transition-all duration-200"
          />
          <button 
            type="submit" 
            disabled={!user || !inputValue.trim() || sending} 
            className="absolute right-3.5 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <PaperPlaneTilt weight="fill" className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
