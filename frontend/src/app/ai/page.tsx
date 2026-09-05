'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AIChatShell } from '@/components/feature/AI/AIChatShell';
import { LibraryService } from '@/services/library.service';
import { usePermissions } from '@/hooks/usePermissions';

export default function AIPage() {
  return (
    <Suspense fallback={<AISkeleton />}>
      <AIContent />
    </Suspense>
  );
}

function AISkeleton() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-900 text-slate-400 gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
      <p className="text-xs font-medium animate-pulse">Đang tải không gian làm việc AI...</p>
    </div>
  );
}

function AIContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get('doc');
  const [contextDocTitle, setContextDocTitle] = useState<string | null>(null);
  const [contextDocError, setContextDocError] = useState('');
  const { can, isLoading } = usePermissions();

  useEffect(() => {
    if (!isLoading && !can('ASK_AI')) {
      router.push('/login');
    }
  }, [isLoading, can, router]);

  /* eslint-disable react-hooks/set-state-in-effect -- Synchronizing context document title with search params */
  useEffect(() => {
    const controller = new AbortController();
    setContextDocError('');
    if (docId) {
      LibraryService.getDocumentById(docId, controller.signal)
        .then((doc) => {
          if (!controller.signal.aborted) {
            setContextDocTitle(doc?.title || null);
            if (!doc) setContextDocError('Không tìm thấy tài liệu ngữ cảnh.');
          }
        })
        .catch((reason: unknown) => {
          if (!controller.signal.aborted) {
            setContextDocTitle(null);
            setContextDocError(
              reason instanceof Error ? reason.message : 'Không thể tải tài liệu ngữ cảnh.'
            );
          }
        });
    } else {
      setContextDocTitle(null);
    }

    return () => controller.abort();
  }, [docId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleClearContextDoc = () => {
    router.push('/ai');
  };

  return (
    <div className="relative h-screen w-screen">
      {contextDocError && (
        <div role="alert" className="absolute left-1/2 top-4 z-50 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl border border-amber-700 bg-amber-950 px-4 py-2 text-xs font-semibold text-amber-200 shadow-lg">
          {contextDocError}
        </div>
      )}
      <AIChatShell
        initialDocId={contextDocTitle ? docId : null}
        contextDocTitle={contextDocTitle}
        onClearContextDoc={docId ? handleClearContextDoc : undefined}
      />
    </div>
  );
}
