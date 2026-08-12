'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/services/api.client';
import { CheckCircle, SpinnerGap, XCircle } from '@phosphor-icons/react';

interface IngestStatus {
  state: string;
  pages_total?: number;
  pages_with_text?: number;
  chunks_total?: number;
  chunks_indexed?: number;
  pages_processed?: number;
  stage?: string;
  error?: string | null;
}

const POLL_INTERVAL_MS = 5000;

export function IngestStatusBadge({ documentId }: { documentId: string }) {
  const [status, setStatus] = useState<IngestStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      let stop = false;
      try {
        const data = (await apiClient.get(`/ai/ingest/${documentId}/status`)) as unknown as IngestStatus;
        if (cancelled) return;
        setStatus(data);
        stop = data.state === 'done' || data.state === 'failed';
      } catch (e) {
        if (cancelled) return;
        stop = true;
      }
      if (!stop) {
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [documentId]);

  if (!status || status.state === 'not_found') return null;

  const badgeBase =
    'inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider transition-colors duration-300';

  if (status.state === 'processing') {
    let progressText = 'Đang phân tích...';
    if (status.pages_total && status.pages_total > 0) {
      progressText = `Đang phân tích... ${status.pages_processed ?? 0}/${status.pages_total} trang`;
    } else if (status.pages_processed && status.pages_processed > 0) {
      progressText = `Đang phân tích... ${status.pages_processed} trang`;
    }
    return (
      <span className={`${badgeBase} bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50`}>
        <SpinnerGap weight="bold" className="w-3 h-3 animate-spin" />
        {progressText}
      </span>
    );
  }

  if (status.state === 'done') {
    const count = status.pages_total && status.pages_total > 0 ? ` (${status.pages_total} trang)` : '';
    return (
      <span className={`${badgeBase} bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50`}>
        <CheckCircle weight="bold" className="w-3 h-3" />
        Đã phân tích{count}
      </span>
    );
  }

  if (status.state === 'failed') {
    return (
      <span className={`${badgeBase} bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50`}>
        <XCircle weight="bold" className="w-3 h-3" />
        Lỗi phân tích
      </span>
    );
  }

  return null;
}
