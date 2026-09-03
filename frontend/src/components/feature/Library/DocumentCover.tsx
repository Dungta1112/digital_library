'use client';

import React from 'react';
import Image from 'next/image';
import { BookOpen, FileText } from '@phosphor-icons/react';

interface DocumentCoverProps {
  title: string;
  category: string;
  coverImageUrl?: string;
  fileType?: 'pdf' | 'docx';
}

const CATEGORY_PALETTES: Record<string, { bg: string; text: string; ring: string }> = {
  'Công nghệ thông tin': {
    bg: 'from-emerald-800 via-teal-900 to-slate-950',
    text: 'text-emerald-300',
    ring: 'border-emerald-500/30',
  },
  'Khoa học máy tính': {
    bg: 'from-teal-800 via-cyan-900 to-slate-950',
    text: 'text-teal-300',
    ring: 'border-teal-500/30',
  },
  'Kinh tế & Quản trị': {
    bg: 'from-blue-900 via-indigo-950 to-slate-950',
    text: 'text-blue-300',
    ring: 'border-blue-500/30',
  },
  'Tài chính - Ngân hàng': {
    bg: 'from-indigo-900 via-slate-900 to-slate-950',
    text: 'text-indigo-300',
    ring: 'border-indigo-500/30',
  },
  'Luật học': {
    bg: 'from-amber-900 via-orange-950 to-slate-950',
    text: 'text-amber-300',
    ring: 'border-amber-500/30',
  },
  'Ngôn ngữ Anh': {
    bg: 'from-purple-900 via-fuchsia-950 to-slate-950',
    text: 'text-purple-300',
    ring: 'border-purple-500/30',
  },
  'Du lịch & Khách sạn': {
    bg: 'from-rose-900 via-slate-900 to-slate-950',
    text: 'text-rose-300',
    ring: 'border-rose-500/30',
  },
};

function getPalette(category: string) {
  return (
    CATEGORY_PALETTES[category] || {
      bg: 'from-slate-800 via-slate-900 to-slate-950',
      text: 'text-slate-300',
      ring: 'border-slate-700/50',
    }
  );
}

export function DocumentCover({
  title,
  category,
  coverImageUrl,
  fileType,
}: DocumentCoverProps) {
  const palette = getPalette(category);
  const isDocx = fileType === 'docx';

  if (coverImageUrl) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900 shadow-md group-hover:shadow-xl transition-all duration-300">
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {fileType && (
          <span className="absolute top-2.5 right-2.5 rounded-lg bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-white shadow-sm border border-white/10">
            {fileType}
          </span>
        )}
      </div>
    );
  }

  // Fallback: Typography Book Cover with "Bìa minh họa" badge (LIB-07)
  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl border ${palette.ring} bg-gradient-to-b ${palette.bg} p-4 sm:p-5 flex flex-col justify-between text-white shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]`}
    >
      {/* Decorative Book Spine */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-white/5 border-r border-white/10 pointer-events-none" />

      {/* Top Row: Category & Format Badge */}
      <div className="flex items-start justify-between gap-2 pl-2">
        <span className="rounded-md bg-white/10 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 border border-white/10 truncate max-w-[120px]">
          {category}
        </span>
        {fileType && (
          <span className="rounded-md bg-black/40 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase text-slate-300 border border-white/10">
            {fileType}
          </span>
        )}
      </div>

      {/* Center: Title typography & icon */}
      <div className="my-auto pl-2 py-2 text-center space-y-2">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white shadow-inner">
          {isDocx ? (
            <FileText weight="duotone" className="h-5 w-5 text-blue-300" />
          ) : (
            <BookOpen weight="duotone" className="h-5 w-5 text-emerald-300" />
          )}
        </div>
        <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-3 leading-snug tracking-tight">
          {title}
        </h4>
      </div>

      {/* Bottom: University Signature & Transparent "Bìa minh họa" badge */}
      <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-2 pl-2 text-[10px] text-slate-400">
        <span className="truncate font-semibold tracking-wide text-slate-300">
          ĐH Trưng Vương
        </span>
        <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-slate-300 border border-white/10">
          Bìa minh họa
        </span>
      </div>
    </div>
  );
}
