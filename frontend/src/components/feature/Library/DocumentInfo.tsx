'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Document } from '@/types/library';
import { DocumentCover } from './DocumentCover';
import { LibraryLocalStorage } from '@/lib/library-local-storage';
import { LibraryService } from '@/services/library.service';
import {
  BookOpen,
  DownloadSimple,
  BookmarkSimple,
  Robot,
  Copy,
  Check,
  Eye,
  CalendarBlank,
  User,
  Folder,
  FileText,
  House,
} from '@phosphor-icons/react';

interface DocumentInfoProps {
  document: Document;
}

function formatBytes(bytes?: number): string {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentInfo({ document }: DocumentInfoProps) {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id || 'guest_user';

  const [isSaved, setIsSaved] = useState(() =>
    LibraryLocalStorage.isDocumentSaved(userId, document.id)
  );
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const authorText = document.authors && document.authors.length > 0 ? document.authors.join(', ') : null;

  const handleToggleSave = () => {
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

  const handleCopyCitation = async () => {
    const authors = authorText || 'Trường Đại học Trưng Vương';
    const year = document.publicationYear ? `(${document.publicationYear})` : '';
    const citationText = `${authors} ${year}. ${document.title}. Thư viện Số Học thuật Đại học Trưng Vương. Nguồn: ${window.location.href}`;

    try {
      await navigator.clipboard.writeText(citationText);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = async () => {
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      setDownloading(true);
      const downloadUrl = await LibraryService.getDocumentDownloadUrl(document.id);
      window.open(downloadUrl, '_blank');
    } catch (e) {
      console.error('Lỗi khi tải tệp:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link href="/library" className="hover:text-emerald-600 transition-colors inline-flex items-center gap-1">
          <House weight="bold" className="h-3.5 w-3.5" />
          <span>Thư viện</span>
        </Link>
        <span>/</span>
        <Link
          href={`/library?categoryId=${document.categoryId || ''}`}
          className="hover:text-emerald-600 transition-colors"
        >
          {document.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white truncate max-w-[240px] sm:max-w-md">
          {document.title}
        </span>
      </nav>

      {/* 2. Hero 2-Column Document Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm">
        {/* Left Column: Cover */}
        <div className="md:col-span-4 lg:col-span-3 max-w-[260px] mx-auto md:mx-0 w-full">
          <DocumentCover
            title={document.title}
            category={document.category}
            coverImageUrl={document.coverImageUrl}
            fileType={document.fileType}
          />
        </div>

        {/* Right Column: Title, Metadata, CTA actions */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              {document.category}
            </span>
            {document.fileType && (
              <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-300">
                {document.fileType}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {document.title}
          </h1>

          {/* Quick Meta Row */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <User weight="bold" className="h-4 w-4 text-slate-400" />
              <span>{authorText || <em className="italic text-slate-400">Chưa cập nhật tác giả</em>}</span>
            </div>

            {document.publicationYear && (
              <div className="flex items-center gap-1.5 font-mono">
                <CalendarBlank weight="bold" className="h-4 w-4 text-slate-400" />
                <span>Năm {document.publicationYear}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Eye weight="bold" className="h-4 w-4 text-slate-400" />
              <span>{document.viewCount} lượt xem</span>
            </div>

            {document.downloadCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <DownloadSimple weight="bold" className="h-4 w-4 text-slate-400" />
                <span>{document.downloadCount} lượt tải</span>
              </div>
            )}
          </div>

          {/* CTA Buttons Row */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/library/read/${document.id}`}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-500 active:scale-95 transition-all"
            >
              <BookOpen weight="bold" className="h-4 w-4" />
              <span>Đọc trực tuyến</span>
            </Link>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <DownloadSimple weight="bold" className="h-4 w-4" />
              <span>{downloading ? 'Đang chuẩn bị...' : 'Tải tệp'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSave}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition-colors ${
                isSaved
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <BookmarkSimple weight={isSaved ? 'fill' : 'bold'} className="h-4 w-4" />
              <span>{isSaved ? 'Đã lưu trên thiết bị' : 'Lưu tài liệu'}</span>
            </button>

            <Link
              href={`/ai?doc=${document.id}`}
              className="flex items-center gap-2 rounded-2xl border border-emerald-300/80 dark:border-emerald-700/80 bg-emerald-50/50 dark:bg-emerald-950/30 px-4 py-3 text-sm font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/50 transition-colors"
            >
              <Robot weight="duotone" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Hỏi AI về tài liệu</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Description & Detailed Bibliographic Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Abstract & Keywords */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText weight="duotone" className="h-5 w-5 text-emerald-600" />
              <span>Tóm tắt nội dung</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {document.abstract || 'Chưa có phần tóm tắt cho tài liệu này.'}
            </p>
          </div>

          {document.description && document.description !== document.abstract && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Mô tả bổ sung
              </h4>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
                {document.description}
              </p>
            </div>
          )}

          {document.keywords && document.keywords.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Từ khóa học thuật
              </h4>
              <div className="flex flex-wrap gap-2">
                {document.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Bibliographic Table & Copy Citation */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Folder weight="duotone" className="h-4 w-4 text-emerald-600" />
            <span>Thông tin thư mục</span>
          </h3>

          <dl className="space-y-3 text-xs">
            <div>
              <dt className="text-slate-400 font-medium mb-0.5">Tác giả</dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-200">
                {authorText || 'Chưa cập nhật'}
              </dd>
            </div>

            <div>
              <dt className="text-slate-400 font-medium mb-0.5">Năm xuất bản</dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-200">
                {document.publicationYear ? `Năm ${document.publicationYear}` : 'Chưa cập nhật'}
              </dd>
            </div>

            <div>
              <dt className="text-slate-400 font-medium mb-0.5">Danh mục học thuật</dt>
              <dd className="font-semibold text-emerald-700 dark:text-emerald-400">
                {document.category}
              </dd>
            </div>

            {document.fileType && (
              <div>
                <dt className="text-slate-400 font-medium mb-0.5">Định dạng tệp</dt>
                <dd className="font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
                  {document.fileType}
                </dd>
              </div>
            )}

            {document.fileSize && (
              <div>
                <dt className="text-slate-400 font-medium mb-0.5">Dung lượng</dt>
                <dd className="font-mono text-slate-800 dark:text-slate-200">
                  {formatBytes(document.fileSize)}
                </dd>
              </div>
            )}

            {document.ownerName && (
              <div>
                <dt className="text-slate-400 font-medium mb-0.5">Người tải lên</dt>
                <dd className="text-slate-700 dark:text-slate-300">
                  {document.ownerName}
                </dd>
              </div>
            )}
          </dl>

          {/* Copy Citation Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCopyCitation}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {copiedCitation ? (
                <>
                  <Check weight="bold" className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">Đã sao chép trích dẫn</span>
                </>
              ) : (
                <>
                  <Copy weight="bold" className="h-4 w-4" />
                  <span>Sao chép thông tin trích dẫn</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}