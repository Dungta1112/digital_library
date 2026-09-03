'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { LibraryLocalStorage } from '@/lib/library-local-storage';
import { SavedDocumentItem, ReadingProgressItem } from '@/types/library';
import {
  BookmarkSimple,
  BookOpen,
  ClockCounterClockwise,
  Trash,
} from '@phosphor-icons/react';

interface PersonalShelfProps {
  userId: string;
  scope: 'all' | 'saved';
  onSelectScope: (scope: 'all' | 'saved') => void;
}

export function PersonalShelf({
  userId,
  scope,
  onSelectScope,
}: PersonalShelfProps) {
  const [savedDocs, setSavedDocs] = useState<SavedDocumentItem[]>([]);
  const [progressItems, setProgressItems] = useState<ReadingProgressItem[]>([]);

  const loadLocalData = useCallback(() => {
    const docs = LibraryLocalStorage.getSavedDocuments(userId);
    const progress = LibraryLocalStorage.getAllReadingProgress(userId);
    setSavedDocs(docs);
    setProgressItems(progress);
  }, [userId]);

  /* eslint-disable react-hooks/set-state-in-effect -- Load device shelf on mount or user switch */
  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleRemoveSaved = (docId: string) => {
    LibraryLocalStorage.removeSavedDocument(userId, docId);
    loadLocalData();
  };

  if (savedDocs.length === 0 && progressItems.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 rounded-3xl border border-emerald-500/20 bg-emerald-950/5 dark:bg-emerald-950/20 p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <BookmarkSimple weight="fill" className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Kệ tài liệu của bạn</span>
              <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                Lưu trên thiết bị này
              </span>
            </h3>
          </div>
        </div>

        {savedDocs.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => onSelectScope(scope === 'saved' ? 'all' : 'saved')}
              className={`font-bold transition-colors ${
                scope === 'saved'
                  ? 'text-emerald-600 dark:text-emerald-400 underline'
                  : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              {scope === 'saved' ? 'Xem toàn bộ thư viện' : `Lọc ${savedDocs.length} tài liệu đã lưu`}
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Carousel of Saved Documents & Reading Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {savedDocs.slice(0, 4).map((doc) => {
          const progress = progressItems.find((p) => p.documentId === doc.id);

          return (
            <div
              key={doc.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-emerald-500/40 transition-colors"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {doc.category}
                </span>
                <Link
                  href={`/library/document/${doc.id}`}
                  className="block text-xs font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-emerald-600 transition-colors"
                >
                  {doc.title}
                </Link>
                {doc.authors && doc.authors.length > 0 && (
                  <p className="text-[11px] text-slate-400 truncate">
                    {doc.authors.join(', ')}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between gap-2">
                {progress ? (
                  <Link
                    href={`/library/read/${doc.id}?page=${progress.pageNumber}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <ClockCounterClockwise weight="bold" className="h-3 w-3" />
                    <span>Đọc tiếp trang {progress.pageNumber}</span>
                  </Link>
                ) : (
                  <Link
                    href={`/library/read/${doc.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600"
                  >
                    <BookOpen weight="bold" className="h-3 w-3" />
                    <span>Đọc ngay</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => handleRemoveSaved(doc.id)}
                  title="Xóa khỏi kệ"
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash weight="bold" className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
