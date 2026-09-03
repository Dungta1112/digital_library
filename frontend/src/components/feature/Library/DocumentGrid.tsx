'use client';

import React from 'react';
import { Document, LibraryViewMode } from '@/types/library';
import { DocumentCard } from './DocumentCard';
import { DocumentListItem } from './DocumentListItem';
import { MagnifyingGlass, WarningCircle, ArrowClockwise } from '@phosphor-icons/react';

interface DocumentGridProps {
  documents: Document[];
  viewMode: LibraryViewMode;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onResetFilters?: () => void;
}

export function DocumentGrid({
  documents,
  viewMode,
  loading,
  error,
  onRetry,
  onResetFilters,
}: DocumentGridProps) {
  // 1. Loading Skeleton
  if (loading) {
    if (viewMode === 'list') {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm animate-pulse"
            >
              <div className="h-24 w-18 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm animate-pulse"
          >
            <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-800" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-12 text-center">
        <WarningCircle weight="duotone" className="h-12 w-12 text-red-500 mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Lỗi khi nạp dữ liệu thư viện
        </h3>
        <p className="max-w-md text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          {error}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
          >
            <ArrowClockwise weight="bold" className="h-4 w-4" />
            <span>Thử lại</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Empty State
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-12 text-center shadow-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
          <MagnifyingGlass weight="duotone" className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Không tìm thấy tài liệu phù hợp
        </h3>
        <p className="max-w-md text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Hãy thử đổi từ khóa tìm kiếm, chuyển danh mục học thuật hoặc xóa bộ lọc để xem toàn bộ kho tài liệu.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
          >
            <span>Xóa bộ lọc & xem tất cả</span>
          </button>
        )}
      </div>
    );
  }

  // 4. List View Mode
  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {documents.map((doc) => (
          <DocumentListItem key={doc.id} document={doc} />
        ))}
      </div>
    );
  }

  // 5. Grid View Mode
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
}
