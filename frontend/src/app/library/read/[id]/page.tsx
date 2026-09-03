'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { DocumentReaderClient } from '@/components/feature/Library/DocumentReaderClient';

export default function DocumentReadPage() {
  const params = useParams();
  const id = (params?.id as string) || '';

  return (
    <Suspense fallback={<ReaderSkeleton />}>
      <DocumentReaderClient documentId={id} />
    </Suspense>
  );
}

function ReaderSkeleton() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
      <p className="text-xs font-medium animate-pulse">Đang nạp phòng đọc...</p>
    </div>
  );
}
