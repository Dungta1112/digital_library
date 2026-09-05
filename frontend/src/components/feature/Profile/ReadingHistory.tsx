'use client';

import React from 'react';
import Link from 'next/link';
import type { ReadingHistoryItem } from '@/types/profile';
import { Button } from '@/components/ui/Button';
import {
  BookOpenText,
  ClockCounterClockwise,
  ArrowSquareOut,
  Books,
  WarningCircle,
  Eye,
  DownloadSimple,
} from '@phosphor-icons/react';

interface ReadingHistoryProps {
  history: ReadingHistoryItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function ReadingHistory({
  history,
  loading,
  error,
  onRetry,
}: ReadingHistoryProps) {
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

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="h-6 w-48 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto mb-3">
          <WarningCircle weight="bold" className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Không thể tải lịch sử đọc
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
          {error}
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={onRetry}
          className="text-xs font-bold px-4 py-2 rounded-xl"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <ClockCounterClockwise weight="duotone" className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Lịch sử đọc đang trống
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
          Máy chủ chưa trả về bản ghi lịch sử. Việc tự động ghi nhận khi mở tài liệu đang chờ backend hỗ trợ đầy đủ.
        </p>
        <Link
          href="/library"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
        >
          <Books weight="bold" className="w-4 h-4" />
          Khám phá Thư viện ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <BookOpenText weight="duotone" className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Lịch sử truy cập tài liệu ({history.length})
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          Sắp xếp theo thời gian mới nhất
        </span>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {history.map((item) => {
          const docId = item.document?.id || item.documentId;
          const docTitle = item.document?.title || 'Chưa cập nhật tiêu đề';
          const docDesc = item.document?.description;
          const views = item.document?.viewCount;
          const downloads = item.document?.downloadCount;

          return (
            <div
              key={item.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <BookOpenText weight="duotone" className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <Link
                    href={`/library/document/${docId}`}
                    className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 block"
                  >
                    {docTitle}
                  </Link>
                  {docDesc && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-normal">
                      {docDesc}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <ClockCounterClockwise weight="bold" className="w-3.5 h-3.5 text-slate-400" />
                      Thời gian mở: {formatDateTime(item.createdAt)}
                    </span>
                    {typeof views === 'number' && (
                      <span className="flex items-center gap-1">
                        <Eye weight="bold" className="w-3.5 h-3.5" />
                        {views} lượt xem
                      </span>
                    )}
                    {typeof downloads === 'number' && (
                      <span className="flex items-center gap-1">
                        <DownloadSimple weight="bold" className="w-3.5 h-3.5" />
                        {downloads} tải về
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center shrink-0">
                <Link
                  href={`/library/read/${docId}`}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/40 dark:text-slate-300 dark:hover:text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <ArrowSquareOut weight="bold" className="w-3.5 h-3.5" />
                  Đọc tài liệu
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
