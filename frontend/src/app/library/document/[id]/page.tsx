'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LibraryService } from '@/services/library.service';
import { DocumentInfo } from '@/components/feature/Library/DocumentInfo';
import { PdfViewerClient } from '@/components/feature/Library/PdfViewerClient';
import { ArrowLeft } from '@phosphor-icons/react';
import type { Document } from '@/types/library';

export default function DocumentDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    async function loadDoc() {
      try {
        setLoading(true);
        setError(false);
        const doc = await LibraryService.getDocumentById(id);
        if (mounted) {
          if (doc) {
            setDocument(doc);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết tài liệu:', err);
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDoc();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/80 py-12 dark:bg-slate-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-[450px] flex-col items-center justify-center text-slate-500 text-sm">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
            <p className="font-medium">Đang tải thông tin tài liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-slate-50/80 py-20 dark:bg-slate-950 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-4xl">📚</div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy tài liệu</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Tài liệu này không tồn tại trong kho lưu trữ hoặc đã được cập nhật.
          </p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
          >
            <ArrowLeft weight="bold" className="w-4 h-4" />
            Quay lại thư viện
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 py-8 dark:bg-slate-950">
      <div className="container mx-auto px-4 lg:px-8">
        <Link
          href="/library"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-700"
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
          Quay lại thư viện
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <DocumentInfo document={document} />
          </div>

          <div className="min-h-[720px] lg:col-span-8 lg:h-[calc(100vh-150px)]">
            <PdfViewerClient document={document} />
          </div>
        </div>
      </div>
    </div>
  );
}
