'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, Stop, FilePdf, X } from '@phosphor-icons/react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  loading: boolean;
  disabled?: boolean;
  contextDocTitle?: string | null;
  onClearContextDoc?: () => void;
  initialDraft?: string;
}

export function ChatInput({
  onSend,
  onStop,
  loading,
  disabled = false,
  contextDocTitle,
  onClearContextDoc,
  initialDraft = '',
}: ChatInputProps) {
  const [text, setText] = useState(initialDraft);
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- Synchronizing initial draft prompt from suggestion pills */
  useEffect(() => {
    if (initialDraft) {
      setText(initialDraft);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialDraft]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Autosize textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 200);
    textarea.style.height = `${newHeight}px`;
  }, [text]);

  const handleSubmit = () => {
    if (loading) {
      onStop?.();
      return;
    }

    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isSendDisabled = !loading && (!text.trim() || disabled);

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 md:px-0">
      {/* Optional Context Document Badge */}
      {contextDocTitle && (
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/80 dark:bg-emerald-950/40 px-3 py-1 text-xs text-emerald-800 dark:text-emerald-300 backdrop-blur shadow-sm">
          <FilePdf weight="duotone" className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate max-w-[280px] sm:max-w-md font-medium">
            Đang hỏi theo: <strong className="font-bold">{contextDocTitle}</strong>
          </span>
          {onClearContextDoc && (
            <button
              type="button"
              onClick={onClearContextDoc}
              title="Xóa ngữ cảnh tài liệu"
              className="rounded-full p-0.5 text-emerald-600 hover:bg-emerald-200/60 dark:hover:bg-emerald-800/60 transition-colors"
            >
              <X weight="bold" className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Main Composer Surface */}
      <div className="relative flex items-end rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-2 shadow-lg transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          rows={1}
          placeholder={
            contextDocTitle
              ? `Đặt câu hỏi về nội dung "${contextDocTitle.slice(0, 30)}..."`
              : 'Đặt câu hỏi tra cứu kiến thức trong thư viện...'
          }
          className="max-h-[200px] min-h-[44px] flex-1 resize-none bg-transparent px-4 py-2.5 text-sm md:text-[15px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none leading-relaxed"
        />

        <div className="mb-0.5 mr-0.5 shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSendDisabled}
            aria-label={loading ? 'Dừng chờ phản hồi' : 'Gửi câu hỏi'}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${
              loading
                ? 'bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600'
                : isSendDisabled
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 active:scale-95'
            }`}
          >
            {loading ? (
              <Stop weight="fill" className="h-5 w-5 animate-pulse" />
            ) : (
              <ArrowUp weight="bold" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
        AI có thể đưa ra kết quả chưa chính xác. Vui lòng kiểm tra lại nội dung và nguồn trích dẫn.
      </p>
    </div>
  );
}
