'use client';

import React from 'react';
import Link from 'next/link';
import { X, BookOpen, ArrowSquareOut, FileText } from '@phosphor-icons/react';
import { AICitation } from '@/types/ai';

interface CitationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  citations: AICitation[];
}

export function CitationPanel({ isOpen, onClose, citations }: CitationPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
      />

      {/* Drawer / Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[340px] flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-transform lg:static lg:z-10 lg:shadow-none">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <BookOpen weight="duotone" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>Nguồn tham khảo ({citations.length})</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X weight="bold" className="h-4 w-4" />
          </button>
        </div>

        {/* Citations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {citations.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
              Không có nguồn trích dẫn nào cho phản hồi này.
            </div>
          ) : (
            citations.map((cit, idx) => (
              <div
                key={cit.id || idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-4 transition-all hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {cit.documentTitle}
                    </h5>
                  </div>
                </div>

                {cit.pageNumber !== undefined && (
                  <div className="inline-block rounded-md bg-emerald-100/70 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase mb-2">
                    Trang {cit.pageNumber}
                  </div>
                )}

                {cit.textSnippet && (
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 italic line-clamp-4 border-l-2 border-emerald-400/40 pl-2.5 my-2">
                    &ldquo;{cit.textSnippet}&rdquo;
                  </p>
                )}

                {cit.documentId && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex justify-end">
                    <Link
                      href={`/library/document/${cit.documentId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
                    >
                      <FileText weight="bold" className="h-3.5 w-3.5" />
                      <span>Xem tài liệu</span>
                      <ArrowSquareOut weight="bold" className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
