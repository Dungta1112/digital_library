'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PaperPlaneTilt, Books, SpinnerGap } from '@phosphor-icons/react';

interface GroupComposerProps {
  onSendMessage: (content: string) => Promise<boolean>;
  disabled?: boolean;
  sending?: boolean;
  placeholder?: string;
  onOpenDocuments?: () => void;
}

export function GroupComposer({
  onSendMessage,
  disabled = false,
  sending = false,
  placeholder = 'Nhập tin nhắn trao đổi (Enter để gửi, Shift+Enter để xuống dòng)...',
  onOpenDocuments,
}: GroupComposerProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const newHeight = Math.min(Math.max(el.scrollHeight, 44), 160);
    el.style.height = `${newHeight}px`;
  }, [text]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled || sending) return;

    const success = await onSendMessage(trimmed);
    if (success) {
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent submission during Vietnamese IME composition
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
        {onOpenDocuments && (
          <button
            type="button"
            onClick={onOpenDocuments}
            title="Mở kho tài liệu thư viện của nhóm"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-slate-800 transition-colors flex-shrink-0 mb-0.5"
          >
            <Books weight="duotone" className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 relative min-h-[44px] bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || sending}
            placeholder={placeholder}
            rows={1}
            className="w-full bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed custom-scrollbar max-h-40"
          />
        </div>

        <button
          type="submit"
          disabled={disabled || sending || !text.trim()}
          title="Gửi tin nhắn (Enter)"
          className="h-11 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20 transition-all flex-shrink-0 mb-0.5 active:scale-95"
        >
          {sending ? (
            <SpinnerGap weight="bold" className="w-5 h-5 animate-spin" />
          ) : (
            <PaperPlaneTilt weight="fill" className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
