'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Document } from '@/types/library';
import {
  ArrowLeft,
  CaretLeft,
  CaretRight,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowsOut,
  ArrowsIn,
  Robot,
  DownloadSimple,
} from '@phosphor-icons/react';

interface ReaderToolbarProps {
  document: Document;
  currentPage: number;
  totalPages: number;
  scale: number;
  isFullscreen: boolean;
  onPageChange: (newPage: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleFullscreen: () => void;
  onDownload?: () => void;
}

export function ReaderToolbar({
  document,
  currentPage,
  totalPages,
  scale,
  isFullscreen,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleFullscreen,
  onDownload,
}: ReaderToolbarProps) {
  const [pageInput, setPageInput] = useState(String(currentPage));

  /* eslint-disable react-hooks/set-state-in-effect -- Sync page number input with reader navigation */
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && (totalPages <= 0 || parsed <= totalPages)) {
      onPageChange(parsed);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const isPdf = document.fileType === 'pdf';

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-3 sm:px-5 text-slate-100 z-30 shrink-0">
      {/* 1. Left: Back Button & Document Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={`/library/document/${document.id}`}
          title="Quay lại hồ sơ tài liệu"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors shrink-0"
        >
          <ArrowLeft weight="bold" className="h-4 w-4" />
        </Link>

        <div className="min-w-0 hidden sm:block">
          <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] md:max-w-xs lg:max-w-md">
            {document.title}
          </h1>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">
            {document.category}
          </span>
        </div>
      </div>

      {/* 2. Center: Page Navigation (for PDF) */}
      {isPdf && totalPages > 0 && (
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-800/90 px-2 py-1 shadow-inner">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            title="Trang trước"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <CaretLeft weight="bold" className="h-4 w-4" />
          </button>

          <form onSubmit={handlePageSubmit} className="flex items-center gap-1 text-xs font-mono font-bold">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={handlePageSubmit}
              className="w-10 rounded-md border border-slate-600 bg-slate-950 px-1 py-0.5 text-center text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
            <span className="text-slate-400">/ {totalPages}</span>
          </form>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            title="Trang sau"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <CaretRight weight="bold" className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 3. Right: Zoom, Fullscreen, AI, Download */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {isPdf && (
          <div className="hidden md:flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 p-0.5 text-xs">
            <button
              type="button"
              onClick={onZoomOut}
              title="Thu nhỏ"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <MagnifyingGlassMinus weight="bold" className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={onResetZoom}
              title="Khôi phục kích thước vừa vặn"
              className="px-2 py-0.5 font-mono text-[11px] font-bold text-slate-300 hover:text-white"
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              type="button"
              onClick={onZoomIn}
              title="Phóng to"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <MagnifyingGlassPlus weight="bold" className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {isFullscreen ? (
            <ArrowsIn weight="bold" className="h-4 w-4" />
          ) : (
            <ArrowsOut weight="bold" className="h-4 w-4" />
          )}
        </button>

        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            title="Tải tài liệu"
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <DownloadSimple weight="bold" className="h-4 w-4" />
          </button>
        )}

        <Link
          href={`/ai?doc=${document.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-colors"
        >
          <Robot weight="duotone" className="h-4 w-4" />
          <span className="hidden sm:inline">Hỏi AI</span>
        </Link>
      </div>
    </header>
  );
}
