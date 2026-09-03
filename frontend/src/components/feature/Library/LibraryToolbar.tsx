'use client';

import React from 'react';
import { Category } from '@/services/library.service';
import { LibraryViewMode } from '@/types/library';
import {
  SquaresFour,
  ListDashes,
  SlidersHorizontal,
  X,
} from '@phosphor-icons/react';

interface LibraryToolbarProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  activeCategory: Category | null;
  searchQuery: string;
  viewMode: LibraryViewMode;
  onViewModeChange: (mode: LibraryViewMode) => void;
  onClearSearch: () => void;
  onClearCategory: () => void;
  onOpenMobileFilters: () => void;
}

export function LibraryToolbar({
  totalCount,
  currentPage,
  pageSize,
  activeCategory,
  searchQuery,
  viewMode,
  onViewModeChange,
  onClearSearch,
  onClearCategory,
  onOpenMobileFilters,
}: LibraryToolbarProps) {
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="space-y-3">
      {/* 1. Main Header & Switcher Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {activeCategory ? activeCategory.name : 'Tất cả tài liệu'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {totalCount > 0
              ? `Hiển thị ${startItem}–${endItem} trong tổng số ${totalCount} tài liệu`
              : 'Không có tài liệu nào'}
          </p>
        </div>

        {/* Right: Mobile Filter Button & View Switcher */}
        <div className="flex items-center gap-2">
          {/* Mobile filter trigger */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50"
          >
            <SlidersHorizontal weight="bold" className="h-4 w-4 text-emerald-600" />
            <span>Bộ lọc</span>
          </button>

          {/* Grid / List View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-sm">
            <button
              type="button"
              aria-label="Xem dạng lưới"
              aria-pressed={viewMode === 'grid'}
              onClick={() => onViewModeChange('grid')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <SquaresFour weight="bold" className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label="Xem dạng danh sách"
              aria-pressed={viewMode === 'list'}
              onClick={() => onViewModeChange('list')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <ListDashes weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Active Filter Chips Row */}
      {(searchQuery || activeCategory) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-medium">Bộ lọc đang chọn:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <span>Từ khóa: &quot;{searchQuery}&quot;</span>
              <button
                type="button"
                onClick={onClearSearch}
                aria-label="Xóa từ khóa tìm kiếm"
                className="hover:text-emerald-950 dark:hover:text-white"
              >
                <X weight="bold" className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeCategory && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <span>Danh mục: {activeCategory.name}</span>
              <button
                type="button"
                onClick={onClearCategory}
                aria-label="Xóa danh mục"
                className="hover:text-emerald-950 dark:hover:text-white"
              >
                <X weight="bold" className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
