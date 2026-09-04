'use client';

import React from 'react';
import Link from 'next/link';
import type { User } from '@/types/auth';
import type { ReadingHistoryItem } from '@/types/profile';
import { 
  UserCircle, 
  ChatCircleText, 
  UploadSimple, 
  Books, 
  ClockCounterClockwise, 
  ArrowRight,
  Sparkle,
  BookOpen,
  ArrowSquareOut
} from '@phosphor-icons/react';

interface ProfileOverviewProps {
  user: User;
  recentHistory: ReadingHistoryItem[];
  historyLoading: boolean;
  onSelectTab: (tab: 'history' | 'contributions') => void;
  onOpenForumComposer: () => void;
  onOpenDocumentUpload: () => void;
}

export function ProfileOverview({
  user,
  recentHistory,
  historyLoading,
  onSelectTab,
  onOpenForumComposer,
  onOpenDocumentUpload,
}: ProfileOverviewProps) {
  const canUpload = user.role === 'LECTURER' || user.role === 'ADMIN';

  const formatDateTime = (dateStr?: string): string => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Account Info & Quick Contribution Shortcuts */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* 1. Account Details Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <UserCircle weight="duotone" className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Thông tin tài khoản
            </h3>
          </div>
          <div className="mt-4 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium mb-0.5">Họ và tên</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {user.fullName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium mb-0.5">Địa chỉ Email</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {user.email}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium mb-0.5">Vai trò hệ thống</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {user.role}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium mb-0.5">Quyền hạn đóng góp</span>
              <span className="text-slate-600 dark:text-slate-400">
                {canUpload
                  ? 'Đăng thảo luận Diễn đàn & Đăng tải tài liệu học thuật'
                  : 'Đăng thảo luận Diễn đàn & Đọc kho tài liệu'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Contribution Shortcuts Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Sparkle weight="duotone" className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Lối tắt đóng góp
            </h3>
          </div>
          <div className="mt-4 space-y-2.5">
            <button
              type="button"
              onClick={onOpenForumComposer}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ChatCircleText weight="bold" className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Đăng bài diễn đàn
                  </h4>
                  <p className="text-[11px] text-slate-400">Trao đổi học thuật</p>
                </div>
              </div>
              <ArrowRight weight="bold" className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            {canUpload ? (
              <button
                type="button"
                onClick={onOpenDocumentUpload}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <UploadSimple weight="bold" className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Đăng tài liệu
                    </h4>
                    <p className="text-[11px] text-slate-400">Dành cho Giảng viên/Admin</p>
                  </div>
                </div>
                <ArrowRight weight="bold" className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ) : (
              <Link
                href="/library"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Books weight="bold" className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Khám phá thư viện
                    </h4>
                    <p className="text-[11px] text-slate-400">Tra cứu tài liệu điện tử</p>
                  </div>
                </div>
                <ArrowRight weight="bold" className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            )}

            <Link
              href="/forum"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <ChatCircleText weight="bold" className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Xem diễn đàn
                  </h4>
                  <p className="text-[11px] text-slate-400">Cộng đồng sinh viên & giảng viên</p>
                </div>
              </div>
              <ArrowRight weight="bold" className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Recent Reading History (3-5 real items) */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <ClockCounterClockwise weight="duotone" className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Đọc gần đây
              </h3>
            </div>
            {recentHistory.length > 0 && (
              <button
                type="button"
                onClick={() => onSelectTab('history')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                Xem tất cả ({recentHistory.length}) <ArrowRight weight="bold" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="mt-4">
            {historyLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
                ))}
              </div>
            ) : recentHistory.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <BookOpen weight="duotone" className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Chưa có lịch sử đọc tài liệu
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                  Khi bạn đọc hoặc tham khảo các tài liệu trong thư viện, danh sách sẽ được tự động lưu lại ở đây.
                </p>
                <Link
                  href="/library"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  <Books weight="bold" className="w-4 h-4" />
                  Khám phá kho tài liệu
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentHistory.slice(0, 5).map((item) => {
                  const docId = item.document?.id || item.documentId;
                  const docTitle = item.document?.title || 'Tài liệu Thư viện';
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-white dark:hover:bg-slate-800 transition-all group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <BookOpen weight="duotone" className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/library/${docId}`}
                            className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 block"
                          >
                            {docTitle}
                          </Link>
                          <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                            Đã xem: {formatDateTime(item.createdAt)}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/library/${docId}`}
                        className="ml-3 p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors shrink-0"
                        title="Mở tài liệu"
                        aria-label={`Mở tài liệu ${docTitle}`}
                      >
                        <ArrowSquareOut weight="bold" className="w-4 h-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
