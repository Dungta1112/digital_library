'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Books, MagnifyingGlass, Robot, Sparkle } from '@phosphor-icons/react';

const SEARCH_SUGGESTIONS = [
  'Cơ sở dữ liệu',
  'Kinh tế vĩ mô',
  'Toán cao cấp',
  'Trí tuệ nhân tạo',
  'Quản trị kinh doanh',
];

export function HeroSection() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'document' | 'ai'>('document');
  const [searchQuery, setSearchQuery] = useState('');

  const submit = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(
      searchMode === 'ai'
        ? `/ai?q=${encodeURIComponent(trimmed)}`
        : `/library?q=${encodeURIComponent(trimmed)}`
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#07152b] to-slate-950 py-16 text-white lg:py-24">
      <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-emerald-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-20 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[140px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-950/30 px-4 py-2 text-xs font-bold tracking-wide text-red-300">
            <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-red-400/40">
              <Image src="/trung-vuong-university-logo.svg" alt="" width={24} height={24} priority />
            </span>
            <span>Trường Đại học Trưng Vương</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-12 max-w-4xl text-center"
        >
          <h1 className="font-playfair mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Khai phóng tri thức với{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              thư viện học thuật số
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Tra cứu tài liệu do hệ thống cung cấp, đọc trực tuyến và hỏi trợ lý AI. Nguồn trích dẫn chỉ xuất hiện khi API trả về tài liệu liên quan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-3xl"
        >
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2 px-1" role="group" aria-label="Chế độ tìm kiếm">
              <button
                type="button"
                aria-pressed={searchMode === 'document'}
                onClick={() => setSearchMode('document')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${searchMode === 'document' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Books weight="duotone" className="h-4 w-4" /> Tìm tài liệu
              </button>
              <button
                type="button"
                aria-pressed={searchMode === 'ai'}
                onClick={() => setSearchMode('ai')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${searchMode === 'ai' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Sparkle weight="fill" className="h-4 w-4" /> Hỏi trợ lý AI
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit(searchQuery);
              }}
              className="relative flex items-center"
            >
              <label htmlFor="home-search" className="sr-only">
                {searchMode === 'ai' ? 'Nhập câu hỏi cho trợ lý AI' : 'Tìm kiếm tài liệu'}
              </label>
              <span className="pointer-events-none absolute left-4 text-emerald-400">
                {searchMode === 'ai' ? <Robot className="h-6 w-6" /> : <MagnifyingGlass className="h-6 w-6" />}
              </span>
              <input
                id="home-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchMode === 'ai' ? 'Nhập câu hỏi học thuật...' : 'Tên tài liệu, tác giả hoặc từ khóa...'}
                className="h-16 w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 pl-13 pr-28 text-sm font-medium text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 sm:pr-36 sm:text-base"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="absolute right-2 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-sm"
              >
                {searchMode === 'ai' ? 'Hỏi AI' : 'Tra cứu'} <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-800/80 px-1 pt-3 text-xs">
              <span className="font-semibold text-slate-400">Gợi ý:</span>
              {SEARCH_SUGGESTIONS.map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => {
                    setSearchQuery(query);
                    submit(query);
                  }}
                  className="rounded-lg border border-slate-700/50 bg-slate-800/80 px-2.5 py-1 text-slate-300 transition-colors hover:border-emerald-700/50 hover:text-emerald-300"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
