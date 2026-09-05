'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LibraryService } from '@/services/library.service';
import { Document } from '@/types/library';
import { ReaderShell } from './ReaderShell';
import { PdfViewer } from './PdfViewer';
import {
  LockKey,
  WarningCircle,
  ArrowClockwise,
  SignIn,
  ArrowLeft,
} from '@phosphor-icons/react';

interface DocumentReaderClientProps {
  documentId: string;
}

export function DocumentReaderClient({ documentId }: DocumentReaderClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPage = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;

  const { user, isLoading: isAuthLoading } = useAuth();

  const [document, setDocument] = useState<Document | null>(null);
  const [readUrl, setReadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages] = useState(0);
  const [scale, setScale] = useState(1);

  // 1. Fetch document and read URL
  const loadReader = useCallback(async () => {
    if (!documentId) return;
    setLoading(true);
    setErrorStatus(null);
    setErrorMessage(null);

    try {
      const doc = await LibraryService.getDocumentById(documentId);
      if (!doc) {
        setErrorStatus(404);
        return;
      }
      setDocument(doc);

      // Fetch verified read URL
      try {
        const url = await LibraryService.getDocumentReadUrl(doc);
        setReadUrl(url);
      } catch (readErr: unknown) {
        console.error('Lỗi khi lấy liên kết đọc:', readErr);
        const status = (readErr as { response?: { status?: number } })?.response?.status || 403;
        setErrorStatus(status);
        setErrorMessage(
          readErr instanceof Error ? readErr.message : 'Bạn không có quyền đọc tài liệu này.'
        );
      }
    } catch (docErr: unknown) {
      console.error(`Lỗi khi lấy thông tin tài liệu ${documentId}:`, docErr);
      const status = (docErr as { response?: { status?: number } })?.response?.status || 500;
      setErrorStatus(status);
      setErrorMessage(
        docErr instanceof Error ? docErr.message : 'Không thể kết nối đến máy chủ thư viện.'
      );
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  /* eslint-disable react-hooks/set-state-in-effect -- Asynchronous loader for document reader */
  useEffect(() => {
    loadReader();
  }, [loadReader]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // 2. Handle Page change & save progress
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1) return;
      setCurrentPage(newPage);

      // Update URL page silently
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(newPage));
      router.replace(`/library/read/${documentId}?${params.toString()}`);
    },
    [documentId, searchParams, router]
  );

  const handleZoomIn = () => setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)));
  const handleResetZoom = () => setScale(1);

  const handleDownload = async () => {
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    try {
      const url = await LibraryService.getDocumentDownloadUrl(documentId);
      window.open(url, '_blank');
    } catch (e) {
      console.error('Lỗi khi tải tệp:', e);
    }
  };

  // 3. Loading State
  if (loading || isAuthLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
        <p className="text-xs font-medium animate-pulse">Đang chuẩn bị không gian phòng đọc...</p>
      </div>
    );
  }

  // 4. Guest / Auth Required State (401 / 403)
  if (errorStatus === 401 || (errorStatus === 403 && !user)) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-slate-100">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto">
            <LockKey weight="duotone" className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Yêu cầu đăng nhập</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Để bảo vệ bản quyền tài liệu học thuật số hóa, bạn cần đăng nhập tài khoản Trường Đại học Trưng Vương để đọc trực tuyến.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href={`/login?returnTo=${encodeURIComponent(window.location.pathname)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
            >
              <SignIn weight="bold" className="h-4 w-4" />
              <span>Đăng nhập ngay</span>
            </Link>
            <Link
              href={`/library/document/${documentId}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
              <span>Xem hồ sơ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. 404 Not Found
  if (errorStatus === 404 || !document) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-slate-100">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl space-y-4">
          <div className="text-4xl">📚</div>
          <h2 className="text-lg font-bold text-white">Không tìm thấy tài liệu</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tài liệu này không tồn tại trong kho lưu trữ hoặc đã được cập nhật.
          </p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
          >
            <ArrowLeft weight="bold" className="h-4 w-4" />
            <span>Quay lại thư viện</span>
          </Link>
        </div>
      </div>
    );
  }

  // 6. Generic Error State
  if (errorStatus || !readUrl) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-slate-100">
        <div className="w-full max-w-md rounded-3xl border border-red-900/60 bg-slate-900 p-8 shadow-2xl space-y-4">
          <WarningCircle weight="duotone" className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">Không thể mở tài liệu</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {errorMessage || 'Đã xảy ra lỗi khi lấy quyền đọc tài liệu.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={loadReader}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
            >
              <ArrowClockwise weight="bold" className="h-4 w-4" />
              <span>Thử lại</span>
            </button>
            <Link
              href={`/library/document/${documentId}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              Về hồ sơ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 7. Success State: Reader Shell
  return (
    <ReaderShell
      document={document}
      currentPage={currentPage}
      totalPages={totalPages}
      scale={scale}
      onPageChange={handlePageChange}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onResetZoom={handleResetZoom}
      onDownload={handleDownload}
    >
      <PdfViewer
        url={readUrl}
        fileType={document.fileType}
        initialPage={currentPage}
        scale={scale}
      />
    </ReaderShell>
  );
}
