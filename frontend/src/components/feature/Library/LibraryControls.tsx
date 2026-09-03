'use client';

import React from 'react';
import { Category } from '@/services/library.service';
import {
  CaretLeft,
  CaretRight,
  Folder,
  X,
} from '@phosphor-icons/react';

interface LibraryControlsProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function LibraryControls({
  categories,
  activeCategoryId,
  onSelectCategory,
  mobileOpen,
  setMobileOpen,
}: LibraryControlsProps) {
  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Folder weight="duotone" className="h-4 w-4 text-emerald-600" />
          <span>Danh mục học thuật</span>
        </h3>
        {activeCategoryId && (
          <button
            type="button"
            onClick={() => onSelectCategory('')}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Tất cả
          </button>
        )}
      </div>

      <nav className="space-y-1">
        <button
          type="button"
          onClick={() => {
            onSelectCategory('');
            setMobileOpen(false);
          }}
          className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
            activeCategoryId === ''
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-bold border border-emerald-200/60 dark:border-emerald-800/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
          }`}
        >
          <span>Tất cả tài liệu</span>
        </button>

        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onSelectCategory(cat.id);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-bold border border-emerald-200/60 dark:border-emerald-800/50'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className="truncate text-left">{cat.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* 1. Desktop 240px Sticky Sidebar */}
      <div className="hidden lg:block sticky top-24 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        {content}
      </div>

      {/* 2. Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm lg:hidden p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Bộ lọc danh mục
              </h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <X weight="bold" className="h-5 w-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Phân trang thư viện">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        title="Trang trước"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
      >
        <CaretLeft weight="bold" className="h-4 w-4" />
      </button>

      <span className="px-3 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
        {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        title="Trang sau"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
      >
        <CaretRight weight="bold" className="h-4 w-4" />
      </button>
    </nav>
  );
}