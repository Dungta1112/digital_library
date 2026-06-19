import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 p-4 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-2xl z-20 transition-colors duration-300">
      <textarea
        className="flex-grow resize-none rounded-xl border border-gray-300 dark:border-slate-700 p-3 h-[60px] md:h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-slate-950 transition-colors duration-300"
        placeholder="Đặt câu hỏi về nghiên cứu của bạn..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={disabled}
      />
      <Button 
        onClick={handleSend} 
        disabled={disabled || !text.trim()} 
        className="px-6 h-[60px] md:h-[80px] rounded-xl font-bold shadow-md self-end"
      >
        Gửi
      </Button>
    </div>
  );
}
