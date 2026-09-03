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
  const { can, isLoading } = usePermissions();

  useEffect(() => {
    if (!isLoading && !can('ASK_AI')) {
      router.push('/login');
    }
  }, [isLoading, can, router]);

  /* eslint-disable react-hooks/set-state-in-effect -- Synchronizing context document title with search params */
  useEffect(() => {
    let mounted = true;
    if (docId) {
      LibraryService.getDocumentById(docId).then((doc) => {
        if (mounted) {
          setContextDocTitle(doc?.title || docId);
        }
      });
    } else {
      setContextDocTitle(null);
    }

    return () => {
      mounted = false;
    };
  }, [docId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleClearContextDoc = () => {
    router.push('/ai');
  };

  return (
    <AIChatShell
      initialDocId={docId}
      contextDocTitle={contextDocTitle}
      onClearContextDoc={docId ? handleClearContextDoc : undefined}
    />
  );
}
