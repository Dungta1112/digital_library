'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { Document } from '@/types/library';
import { LibraryService } from '@/services/library.service';

// react-pdf needs browser APIs, so this viewer must not render on the server.
const PdfViewer = dynamic(
    () => import('./PdfViewer').then((pdfModule) => pdfModule.PdfViewer),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full min-h-[600px] items-center justify-center rounded-xl bg-slate-200 text-sm font-medium text-slate-500 animate-pulse">
                Đang tải trình xem tài liệu...
            </div>
        ),
    }
);

export function PdfViewerClient({ document }: { document: Document }) {
    const [url, setUrl] = useState(document.pdfUrl);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        LibraryService.getDocumentReadUrl(document)
            .then((readUrl) => {
                if (!cancelled) {
                    setUrl(readUrl);
                    setError(null);
                }
            })
            .catch((readError) => {
                if (!cancelled) {
                    setError(readError instanceof Error ? readError.message : 'Không tải được file tài liệu.');
                }
            });

        return () => {
            cancelled = true;
        };
    }, [document]);

    if (error) {
        return (
            <div className="flex h-full min-h-[600px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <h2 className="mb-2 text-lg font-bold text-red-700">Không tải được tài liệu</h2>
                <p className="max-w-md text-sm text-red-600">{error}</p>
            </div>
        );
    }

    if (!url) {
        return (
            <div className="flex h-full min-h-[600px] items-center justify-center rounded-xl bg-slate-200 text-sm font-medium text-slate-500 animate-pulse">
                Đang xác định file tài liệu...
            </div>
        );
    }

    return <PdfViewer url={url} />;
}