'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlass,
  Robot,
  Books,
  Chats,
  UsersThree,
  ArrowRight,
  X,
  Sparkle,
} from '@phosphor-icons/react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'document' | 'ai'>('document');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    onClose();
    if (mode === 'ai') {
      router.push(`/ai?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/library?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickNav = (href: string) => {
    onClose();
    router.push(href);
  };

  const suggestions = [
    { label: 'Cấu trúc dữ liệu & Giải thuật', category: 'Khoa học máy tính', href: '/library?q=C%E1%BA%A5u+tr%C3%BAc+d%E1%BB%AF+li%E1%BB%87u' },
    { label: 'Kinh tế học vi mô & vĩ mô', category: 'Kinh tế', href: '/library?q=Kinh+t%E1%BA%BF+h%E1%BB%8Dc' },
    { label: 'Toán cao cấp cho kỹ sư', category: 'Toán học', href: '/library?q=To%C3%A1n+cao+c%E1%BA%A5p' },
    { label: 'Trí tuệ nhân tạo căn bản', category: 'AI & Khoa học máy tính', href: '/library?q=Tr%C3%AD+tu%E1%BB%87+nh%C3%A2n+t%E1%BA%A1o' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-28 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 px-6 py-3.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('document')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                mode === 'document'
                  ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-emerald-400 dark:ring-slate-700'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Books weight="duotone" className="h-4 w-4" />
              Tìm tài liệu & giáo trình
            </button>
            <button
              type="button"
              onClick={() => setMode('ai')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                mode === 'ai'
                  ? 'bg-emerald-600 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sparkle weight="fill" className="h-4 w-4" />
              Hỏi đáp Trợ lý AI
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X weight="bold" className="h-4 w-4" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="p-6">
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-emerald-600 dark:text-emerald-400">
              {mode === 'ai' ? (
                <Robot weight="duotone" className="h-6 w-6 animate-pulse" />
              ) : (
                <MagnifyingGlass weight="bold" className="h-6 w-6" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                mode === 'ai'
                  ? 'Nhập câu hỏi học thuật để AI trả lời có trích dẫn...'
                  : 'Nhập tên tài liệu, giáo trình, tác giả hoặc từ khóa...'
              }
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-13 pr-28 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-2.5 inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 dark:bg-emerald-600"
            >
              {mode === 'ai' ? 'Hỏi AI' : 'Tìm'}
              <ArrowRight weight="bold" className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        {/* Quick Nav & Suggestions */}
        <div className="border-t border-slate-100 bg-slate-50/40 p-6 dark:border-slate-800/80 dark:bg-slate-950/40">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Gợi ý tra cứu phổ biến
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {suggestions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleQuickNav(item.href)}
                className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white p-3 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800/60 dark:hover:bg-emerald-950/20"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {item.label}
                  </p>
                  <p className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                    {item.category}
                  </p>
                </div>
                <ArrowRight weight="bold" className="h-3.5 w-3.5 text-slate-400" />
              </button>
            ))}
          </div>

          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Truy cập nhanh danh mục
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickNav('/library')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-emerald-400"
            >
              <Books weight="duotone" className="h-4 w-4 text-emerald-600" />
              Kho tài liệu số
            </button>
            <button
              type="button"
              onClick={() => handleQuickNav('/forum')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-emerald-400"
            >
              <Chats weight="duotone" className="h-4 w-4 text-blue-600" />
              Diễn đàn học thuật
            </button>
            <button
              type="button"
              onClick={() => handleQuickNav('/groups')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-emerald-400"
            >
              <UsersThree weight="duotone" className="h-4 w-4 text-amber-600" />
              Nhóm học tập môn học
            </button>
          </div>
        </div>

        {/* Footer Shortcut hint */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400 bg-white dark:bg-slate-900">
          <span>Nhấn <kbd className="rounded border border-slate-300 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-700 font-bold">Enter</kbd> để tìm kiếm</span>
          <span>Nhấn <kbd className="rounded border border-slate-300 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-700 font-bold">ESC</kbd> để đóng</span>
        </div>
      </div>
    </div>
  );
}
