'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Document } from '@/types/library';
import {
  BookOpen,
  BookmarkSimple,
  Eye,
  User,
  ArrowRight,
  FileText,
} from '@phosphor-icons/react';

interface DocumentListItemProps {
  document: Document;
  isFavorite?: boolean;
  favoritePending?: boolean;
  onToggleFavorite?: (document: Document) => Promise<boolean>;
}

export function DocumentListItem({ document, isFavorite = false, favoritePending = false, onToggleFavorite }: DocumentListItemProps) {

  const authorText =
    document.authors && document.authors.length > 0
      ? document.authors.join(', ')
      : 'Chưa cập nhật tác giả';

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await onToggleFavorite?.(document);
  };

  return (
    <article className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200">
      {/* Thumbnail + Details */}
      <div className="flex items-start gap-4 min-w-0 flex-1">
        {/* Compact Thumbnail (72px) */}
        <Link
          href={`/library/document/${document.id}`}
          className="relative h-24 w-18 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner flex items-center justify-center text-white"
        >
          {document.coverImageUrl ? (
            <Image
              src={document.coverImageUrl}
              alt={document.title}
              fill
              unoptimized
              className="object-cover object-top"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <FileText weight="duotone" className="h-6 w-6 text-emerald-400 mb-1" />
              <span className="text-[9px] font-mono font-bold uppercase text-slate-300">
                {document.fileType || 'Chưa cập nhật'}
              </span>
            </div>
          )}
        </Link>

        {/* Content Info */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
              {document.category}
            </span>
            {document.fileType && (
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                {document.fileType}
              </span>
            )}
          </div>

          <Link href={`/library/document/${document.id}`} className="block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
              {document.title}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 truncate max-w-[220px]">
              <User weight="bold" className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate">{authorText}</span>
            </div>
            {document.publicationYear && (
              <span>• Năm {document.publicationYear}</span>
            )}
            <div className="flex items-center gap-1">
              <Eye weight="bold" className="h-3 w-3 text-slate-400" />
              <span>{document.viewCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {onToggleFavorite && <button
          type="button"
          onClick={handleToggleSave}
          disabled={favoritePending}
          title={isFavorite ? 'Xóa khỏi danh sách đã lưu' : 'Lưu tài liệu'}
          aria-label={isFavorite ? `Bỏ lưu ${document.title}` : `Lưu ${document.title}`}
          aria-busy={favoritePending}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
            isFavorite
              ? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-600 hover:border-emerald-300'
          }`}
        >
          <BookmarkSimple weight={isFavorite ? 'fill' : 'bold'} className="h-4 w-4" />
        </button>}

        <Link
          href={`/library/document/${document.id}`}
          className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span>Hồ sơ</span>
          <ArrowRight weight="bold" className="h-3.5 w-3.5" />
        </Link>

        <Link
          href={`/library/read/${document.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 active:scale-95 transition-all"
        >
          <BookOpen weight="bold" className="h-4 w-4" />
          <span>Đọc</span>
        </Link>
      </div>
    </article>
  );
}
