'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GroupService } from '@/services/group.service';
import { ChatMessage } from '@/types/group';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
    // Scroll to bottom whenever messages change
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

    // Optimistically add to UI
    setMessages(prev => [...prev, tempMsg]);
    const currentInput = inputValue;
    setInputValue('');

    try {
      await GroupService.sendGroupMessage(groupId, currentInput);
      // In a real app, you might wait for server confirmation to swap temp ID with real ID
    } catch (err) {
      console.error('Failed to send message', err);
      // Rollback
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setInputValue(currentInput);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50/50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-8 flex justify-center items-center h-[400px] transition-colors duration-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#313338] transition-colors duration-300">
      {/* Header */}
      <div className="h-12 px-4 flex items-center border-b border-gray-200 dark:border-[#1e1f22] shadow-sm flex-shrink-0 bg-white dark:bg-[#313338] transition-colors duration-300 z-10">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base transition-colors duration-300">
          <span className="text-gray-400 dark:text-gray-500 text-xl font-light">#</span>
          thảo-luận-chung
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-6 transition-colors duration-300">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-[#2b2d31] rounded-full flex items-center justify-center mb-4 text-2xl">👋</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to the beginning of the chat!</h1>
            <p>This is the start of your conversation.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isConsecutive = index > 0 && messages[index - 1].senderId === msg.senderId && 
              (new Date(msg.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() < 300000); // 5 mins

            return (
              <div key={msg.id} className={`flex group hover:bg-gray-50 dark:hover:bg-[#2e3035] -mx-4 px-4 py-0.5 transition-colors ${isConsecutive ? 'mt-0.5' : 'mt-4'}`}>
                {!isConsecutive ? (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex-shrink-0 flex items-center justify-center text-sm font-bold mt-0.5 cursor-pointer hover:opacity-80 transition-opacity">
                    {msg.senderName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-10 flex-shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 dark:text-gray-500 font-medium select-none pt-1.5">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
                
                <div className="ml-4 flex-1 min-w-0">
                  {!isConsecutive && (
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="font-medium text-gray-900 dark:text-white hover:underline cursor-pointer transition-colors text-[15px]">
                        {msg.senderName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {new Date(msg.timestamp).toLocaleDateString() === new Date().toLocaleDateString() 
                          ? `Today at ${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : new Date(msg.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                  <div className="text-gray-800 dark:text-[#dbdee1] text-[15px] leading-[1.375rem] whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2 bg-white dark:bg-[#313338] transition-colors duration-300">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <div className="absolute left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors">
            <span className="text-xl leading-none">⊕</span>
          </div>
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={user ? "Message #thảo-luận-chung" : "Vui lòng đăng nhập để chat"}
            disabled={!user || sending}
            className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-[#383a40] border-none focus:ring-0 text-gray-900 dark:text-[#dbdee1] placeholder:text-gray-500 dark:placeholder:text-[#87898f] rounded-lg text-[15px] transition-colors"
          />
          <button 
            type="submit" 
            disabled={!user || !inputValue.trim() || sending} 
            className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <span className="text-lg">➤</span>
          </button>
        </form>
      </div>
    </div>
  );
}
