'use client';

import React from 'react';
import Link from 'next/link';
import {
  List,
  Plus,
  FilePdf,
  X,
  House,
  Robot,
} from '@phosphor-icons/react';

interface AIChatHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  contextDocTitle?: string | null;
  contextDocId?: string | null;
  onClearContextDoc?: () => void;
}

export function AIChatHeader({
  onToggleSidebar,
  onNewChat,
  contextDocTitle,
  contextDocId,
  onClearContextDoc,
}: AIChatHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 px-4 backdrop-blur z-20 shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          title="Đóng / Mở lịch sử"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <List weight="bold" className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onNewChat}
          title="Hội thoại mới"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors sm:hidden"
        >
          <Plus weight="bold" className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
            <Robot weight="duotone" className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-none">
              Trợ lý AI Học thuật
            </h1>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">
              Đại học Trưng Vương
            </span>
          </div>
        </div>
      </div>

      {/* Center/Right section: Context Pill & Actions */}
      <div className="flex items-center gap-2">
        {contextDocTitle && (
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/30 pl-3 pr-1.5 py-1 text-xs text-emerald-800 dark:text-emerald-300">
            <FilePdf weight="duotone" className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="max-w-[140px] sm:max-w-[240px] truncate font-medium">
              {contextDocTitle}
            </span>
            {contextDocId && (
              <Link
                href={`/library/document/${contextDocId}`}
                title="Mở trang tài liệu"
                className="text-[11px] font-bold underline hover:text-emerald-600 dark:hover:text-emerald-400 hidden sm:inline"
              >
                Xem
              </Link>
            )}
            {onClearContextDoc && (
              <button
                type="button"
                onClick={onClearContextDoc}
                title="Thoát chế độ hỏi theo tài liệu"
                className="rounded-full p-0.5 text-emerald-600 hover:bg-emerald-200/60 dark:hover:bg-emerald-800/60 transition-colors"
              >
                <X weight="bold" className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <House weight="bold" className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Về Thư viện</span>
        </Link>
      </div>
    </header>
  );
}
