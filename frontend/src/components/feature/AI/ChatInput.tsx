import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PaperPlaneRight } from '@phosphor-icons/react';

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
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 p-4 md:p-6 flex gap-3 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)] rounded-t-3xl z-20 transition-colors duration-300">
      <textarea
        className="flex-grow resize-none rounded-2xl border border-slate-200 dark:border-slate-700 p-4 h-[60px] md:h-[72px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-950 transition-all duration-300 shadow-inner"
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
        className="w-[60px] md:w-[72px] h-[60px] md:h-[72px] p-0 flex items-center justify-center rounded-2xl font-bold shadow-sm self-end bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95 transition-all"
      >
        <PaperPlaneRight weight="fill" className="w-6 h-6" />
      </Button>
    </div>
  );
}
