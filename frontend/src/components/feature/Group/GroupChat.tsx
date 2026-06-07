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
      <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-8 flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 shadow-sm z-10 flex items-center justify-between">
        <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Thảo luận trực tiếp
        </h3>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Real-time</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
            <span className="text-3xl mb-2">👋</span>
            <p>Chưa có tin nhắn nào. Hãy là người đầu tiên bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = user && (msg.senderId === user.id || msg.senderId === 'current-user');
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex-shrink-0 flex items-center justify-center text-xs font-bold border border-indigo-200">
                      {msg.senderName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe 
                      ? 'bg-green-600 text-white rounded-br-sm shadow-md shadow-green-600/20' 
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
                <div className={`text-[10px] text-gray-400 mt-1 px-1 ${isMe ? 'text-right' : 'text-left ml-10'}`}>
                  {isMe ? 'Bạn' : msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={user ? "Nhập tin nhắn..." : "Vui lòng đăng nhập để chat"}
            disabled={!user || sending}
            className="flex-1 rounded-full bg-gray-50 border-gray-200 focus:bg-white text-sm h-11"
          />
          <Button 
            type="submit" 
            disabled={!user || !inputValue.trim() || sending} 
            className="rounded-full w-11 h-11 p-0 flex items-center justify-center shrink-0 shadow-md"
          >
            ➤
          </Button>
        </form>
      </div>
    </div>
  );
}
