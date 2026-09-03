'use client';

import React, { useState } from 'react';
import { AIChatMessage, AICitation } from '@/types/ai';
import { MarkdownMessage } from './MarkdownMessage';
import {
  Robot,
  Copy,
  Check,
  ArrowClockwise,
  BookOpen,
  WarningCircle,
  StopCircle,
} from '@phosphor-icons/react';

interface ChatMessageProps {
  message: AIChatMessage;
  onOpenCitations?: (citations: AICitation[]) => void;
  onRetry?: (messageId: string) => void;
}

export function ChatMessage({ message, onOpenCitations, onRetry }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isPending = message.status === 'pending';
  const isError = message.status === 'error';
  const isCanceled = message.status === 'canceled';
  const isInterrupted = message.status === 'interrupted';
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-6">
        <div className="max-w-[85%] md:max-w-[75%] rounded-3xl bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 px-5 py-3.5 shadow-sm text-sm md:text-[15px] leading-relaxed break-words">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start mb-8 group">
      <div className="w-full">
        {/* Assistant Header */}
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Robot weight="duotone" className="h-3.5 w-3.5" />
          </div>
          <span>Trợ lý AI</span>
        </div>

        {/* Message Body */}
        {isPending ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 py-3">
            <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            <span>Đang tra cứu tài liệu và chuẩn bị câu trả lời...</span>
          </div>
        ) : (
          <div className="space-y-3">
            <MarkdownMessage content={message.content} />

            {/* Error or Canceled Banner */}
            {(isError || isCanceled || isInterrupted) && (
              <div
                className={`flex items-center justify-between gap-3 rounded-2xl p-3.5 text-xs font-medium ${
                  isError
                    ? 'border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                    : 'border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isError ? (
                    <WarningCircle weight="fill" className="h-4 w-4 shrink-0 text-red-500" />
                  ) : (
                    <StopCircle weight="fill" className="h-4 w-4 shrink-0 text-amber-500" />
                  )}
                  <span>
                    {isInterrupted
                      ? 'Lượt trả lời trước bị gián đoạn do tải lại trang.'
                      : isCanceled
                      ? 'Yêu cầu phản hồi đã được dừng.'
                      : message.errorMessage || 'Không thể nhận phản hồi từ mô hình AI.'}
                  </span>
                </div>

                {onRetry && (
                  <button
                    type="button"
                    onClick={() => onRetry(message.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-current px-3 py-1 text-xs font-bold hover:bg-white/40 dark:hover:bg-black/20 transition-colors shrink-0"
                  >
                    <ArrowClockwise weight="bold" className="h-3.5 w-3.5" />
                    <span>Thử lại</span>
                  </button>
                )}
              </div>
            )}

            {/* Citations Preview Tag */}
            {message.citations && message.citations.length > 0 && onOpenCitations && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenCitations(message.citations || [])}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors shadow-sm"
                >
                  <BookOpen weight="duotone" className="h-4 w-4" />
                  <span>Nguồn tham khảo ({message.citations.length})</span>
                </button>
              </div>
            )}

            {/* Footer Action: Copy Button */}
            {!isError && !isCanceled && message.content && (
              <div className="flex items-center gap-3 pt-2 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check weight="bold" className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-medium">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy weight="bold" className="h-3.5 w-3.5" />
                      <span>Sao chép toàn bộ</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
