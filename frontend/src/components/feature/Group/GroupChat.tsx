'use client';

import React from 'react';
import { useGroupMessages } from '@/hooks/useGroupMessages';
import { GroupComposer } from './GroupComposer';
import { getGroupGradient } from './GroupCard';
import {
  ChatTeardropText,
  ArrowDown,
  ArrowsClockwise,
  WarningCircle,
  Clock,
  Copy,
} from '@phosphor-icons/react';

interface GroupChatProps {
  groupId: string;
  isMember: boolean;
  onOpenDocuments?: () => void;
}

export function GroupChat({ groupId, isMember, onOpenDocuments }: GroupChatProps) {
  const {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refresh,
    scrollContainerRef,
    messagesEndRef,
    scrollToBottom,
    hasUnseenNewMessages,
    lastSyncedAt,
  } = useGroupMessages(groupId);

  const formatMessageTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatMessageDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return 'Hôm nay';
      }
      return date.toLocaleDateString([], {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white dark:bg-slate-950">
      {/* ── Sub-header: Sync Status & Refresh Button ────────── */}
      <div className="h-11 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Trao đổi chung</span>
          {lastSyncedAt && (
            <span className="text-[11px] text-slate-400">
              • Đồng bộ lúc {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => refresh()}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Làm mới tin nhắn"
        >
          <ArrowsClockwise weight="bold" className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>

      {/* ── Message Stream Container ─────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-3 sm:px-6 py-4 space-y-4 relative"
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Đang tải luồng trao đổi...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ChatTeardropText weight="duotone" className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Bắt đầu trao đổi học tập
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Hãy gửi câu hỏi, giải thích bài tập hoặc thảo luận tài liệu cùng các thành viên trong nhóm.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto">
            {messages.map((msg, index) => {
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const isSameSender =
                prevMsg &&
                prevMsg.senderId === msg.senderId &&
                Math.abs(new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime()) <
                  300000;

              const showDateDivider =
                !prevMsg ||
                new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();

              const gradient = getGroupGradient(msg.senderName || msg.senderId);
              const initial = (msg.senderName || 'U').trim().charAt(0).toUpperCase();

              return (
                <React.Fragment key={msg.id}>
                  {showDateDivider && (
                    <div className="flex items-center justify-center my-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {formatMessageDate(msg.timestamp)}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex items-start gap-3 group rounded-xl p-1.5 -mx-1.5 transition-colors ${
                      msg.status === 'failed'
                        ? 'bg-red-50/70 dark:bg-red-950/30'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Avatar (hidden on consecutive message from same sender) */}
                    {!isSameSender ? (
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5`}
                      >
                        {initial}
                      </div>
                    ) : (
                      <div className="w-9 flex-shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 select-none pt-0.5">
                        {formatMessageTime(msg.timestamp)}
                      </div>
                    )}

                    {/* Message Bubble Content */}
                    <div className="flex-1 min-w-0">
                      {!isSameSender && (
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {msg.senderName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {formatMessageTime(msg.timestamp)}
                          </span>
                        </div>
                      )}

                      <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </div>

                      {/* Status Badges */}
                      {msg.status === 'pending' && (
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                          <Clock weight="bold" className="w-3 h-3 animate-pulse" />
                          <span>Đang gửi...</span>
                        </div>
                      )}

                      {msg.status === 'failed' && (
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-red-600 dark:text-red-400">
                          <WarningCircle weight="bold" className="w-3.5 h-3.5" />
                          <span>Chưa xác nhận kết quả gửi.</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(msg.content)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                          >
                            <Copy weight="bold" className="w-3 h-3" />
                            Sao chép
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />

        {/* Floating "New Messages" Badge */}
        {hasUnseenNewMessages && (
          <div className="sticky bottom-2 flex justify-center z-10 animate-bounce">
            <button
              type="button"
              onClick={() => scrollToBottom(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
            >
              <span>Có tin nhắn mới</span>
              <ArrowDown weight="bold" className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => refresh()}
            className="font-bold underline ml-2"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── Composer at bottom ───────────────────────────────── */}
      <GroupComposer
        onSendMessage={sendMessage}
        disabled={!isMember}
        sending={sending}
        placeholder={
          isMember
            ? 'Nhập tin nhắn trao đổi (Enter để gửi, Shift+Enter xuống dòng)...'
            : 'Bạn cần tham gia nhóm để gửi tin nhắn trao đổi'
        }
        onOpenDocuments={onOpenDocuments}
      />
    </div>
  );
}