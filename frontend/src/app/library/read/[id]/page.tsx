import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LibraryService } from '@/services/library.service';
import { DocumentInfo } from '@/components/feature/Library/DocumentInfo';
import { PdfViewerClient } from '@/components/feature/Library/PdfViewerClient';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';

export default async function DocumentReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await LibraryService.getDocumentById(id);

  if (!document) {
    notFound();
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
