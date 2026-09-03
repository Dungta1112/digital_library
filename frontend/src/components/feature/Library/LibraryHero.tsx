'use client';

import React from 'react';
import { Category } from '@/services/library.service';
import {
  MagnifyingGlass,
  Sparkle,
} from '@phosphor-icons/react';

interface LibraryHeroProps {
  draftQuery: string;
  setDraftQuery: (val: string) => void;
  onSearch: (val: string) => void;
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (catId: string) => void;
}

export function LibraryHero({
  draftQuery,
  setDraftQuery,
  onSearch,
  categories,
  activeCategoryId,
  onSelectCategory,
}: LibraryHeroProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(draftQuery);
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-emerald-950/20 via-slate-900/5 to-slate-50/0 dark:from-emerald-950/40 dark:via-slate-950 dark:to-slate-950 py-12 sm:py-16">
      {/* Background Accent */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 text-center space-y-6">
        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/40 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <Sparkle weight="fill" className="h-3.5 w-3.5" />
          <span>THƯ VIỆN ĐIỆN TỬ TRƯỜNG ĐẠI HỌC TRƯNG VƯƠNG</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tra cứu & Nghiên cứu Tài liệu Học thuật
          </h1>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Khám phá kho giáo trình chính quy, luận văn, luận án và bài báo khoa học đã qua thẩm định học thuật của các khoa.
          </p>
        </div>

        {/* 860px Search Bar (Submit only on Enter / Button click - LIB-01) */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-[860px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl shadow-slate-900/5 dark:shadow-none flex items-center gap-2"
        >
          <div className="flex items-center gap-3 pl-4 flex-1 text-slate-400">
            <MagnifyingGlass weight="bold" className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <input
              type="text"
              value={draftQuery}
              onChange={(e) => setDraftQuery(e.target.value)}
              placeholder="Nhập tên giáo trình, từ khóa, tác giả hoặc chuyên ngành..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 transition-all shrink-0"
          >
            <span>Tìm tài liệu</span>
          </button>
        </form>

        {/* Quick Category Chips */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => onSelectCategory('')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeCategoryId === ''
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Tất cả
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id === activeCategoryId ? '' : cat.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                  cat.id === activeCategoryId
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
