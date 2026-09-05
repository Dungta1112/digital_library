'use client';

import React from 'react';
import { BookmarkSimple, ArrowClockwise, WarningCircle } from '@phosphor-icons/react';

interface PersonalShelfProps {
  scope: 'all' | 'saved';
  onSelectScope: (scope: 'all' | 'saved') => void;
  favoriteCount: number;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function PersonalShelf({
  scope,
  onSelectScope,
  favoriteCount,
  loading,
  error,
  onRetry,
}: PersonalShelfProps) {
  return (
    <section className="mb-8 flex flex-col gap-3 rounded-3xl border border-emerald-500/20 bg-emerald-950/5 p-5 dark:bg-emerald-950/20 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
          <BookmarkSimple weight="fill" className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tài liệu đã lưu</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {loading ? 'Đang đồng bộ với tài khoản...' : `${favoriteCount} tài liệu từ máy chủ`}
          </p>
        </div>
      </div>

      {error ? (
        <div role="alert" className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
          <WarningCircle className="h-4 w-4" />
          <span>Không thể tải danh sách đã lưu.</span>
          <button type="button" onClick={onRetry} className="inline-flex items-center gap-1 underline">
            <ArrowClockwise className="h-3.5 w-3.5" /> Thử lại
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onSelectScope(scope === 'saved' ? 'all' : 'saved')}
          disabled={loading}
          className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-400"
        >
          {scope === 'saved' ? 'Xem toàn bộ thư viện' : 'Chỉ xem tài liệu đã lưu'}
        </button>
      )}
    </section>
  );
}
