'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Document } from '@/types/library';
import { DocumentCover } from './DocumentCover';
import { LibraryLocalStorage } from '@/lib/library-local-storage';
import { useAuth } from '@/hooks/useAuth';
import {
  BookOpen,
  BookmarkSimple,
  Eye,
  User,
  ArrowRight,
} from '@phosphor-icons/react';

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { user } = useAuth();
  const userId = user?.id || 'guest_user';

  const [isSaved, setIsSaved] = useState(() =>
    LibraryLocalStorage.isDocumentSaved(userId, document.id)
  );

  const authorText =
    document.authors && document.authors.length > 0
      ? document.authors.join(', ')
      : 'Chưa cập nhật tác giả';

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaved) {
      LibraryLocalStorage.removeSavedDocument(userId, document.id);
      setIsSaved(false);
    } else {
      LibraryLocalStorage.saveDocument(userId, {
        id: document.id,
        title: document.title,
        authors: document.authors,
        category: document.category,
        fileType: document.fileType,
        coverImageUrl: document.coverImageUrl,
        savedAt: new Date().toISOString(),
      });
      setIsSaved(true);
    }
  };

  return (
    <article className="group relative flex flex-col rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 p-4">
      {/* Cover Header */}
      <Link href={`/library/document/${document.id}`} className="block mb-4">
        <DocumentCover
          title={document.title}
          category={document.category}
          coverImageUrl={document.coverImageUrl}
          fileType={document.fileType}
        />
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between space-y-3">
        <div>
          {/* Category Pill */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 truncate">
              {document.category}
            </span>

            <button
              type="button"
              onClick={handleToggleSave}
              title={isSaved ? 'Xóa khỏi kệ tài liệu' : 'Lưu tài liệu trên thiết bị'}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                isSaved
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-600 hover:border-emerald-300'
              }`}
            >
              <BookmarkSimple weight={isSaved ? 'fill' : 'bold'} className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Title */}
          <Link href={`/library/document/${document.id}`} className="block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <h3
              className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug tracking-tight mb-1.5"
              title={document.title}
            >
              {document.title}
            </h3>
          </Link>

          {/* Authors & Year */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <User weight="bold" className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{authorText}</span>
            {document.publicationYear && (
              <span className="shrink-0 text-slate-400">• Năm {document.publicationYear}</span>
            )}
          </div>
        </div>

        {/* Card Footer: Metrics & Direct CTAs */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1" title="Lượt xem">
              <Eye weight="bold" className="h-3.5 w-3.5" />
              {document.viewCount}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/library/document/${document.id}`}
              className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Hồ sơ</span>
              <ArrowRight weight="bold" className="h-3 w-3" />
            </Link>

            <Link
              href={`/library/read/${document.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 active:scale-95 transition-all"
            >
              <BookOpen weight="bold" className="h-3.5 w-3.5" />
              <span>Đọc</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
