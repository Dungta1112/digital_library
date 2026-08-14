'use client';

import React from 'react';
import Link from 'next/link';
import { Document } from '@/types/library';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';
import { LibraryService } from '@/services/library.service';
import { FileDoc, FilePdf } from '@phosphor-icons/react';

export function DocumentInfo({ document }: { document: Document }) {
    const { can } = usePermissions();
    const [opening, setOpening] = React.useState(false);
    const FileIcon = document.fileType === 'docx' ? FileDoc : FilePdf;

    const handleOpenDocument = async () => {
        try {
            setOpening(true);
            const url = await LibraryService.getDocumentReadUrl(document);
            window.open(url, '_blank', 'noopener,noreferrer');
        } finally {
            setOpening(false);
        }
    };

    return (
        <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7">
            <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800/60">
                    {document.category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <FileIcon weight="duotone" className="h-4 w-4" />
                    {document.fileType || 'tệp'}
                </span>
            </div>

            <h1 className="mb-3 text-2xl font-black leading-tight tracking-tight text-slate-950 md:text-3xl dark:text-white">
                {document.title}
            </h1>
            <p className="mb-5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {document.authors.join(', ')} / {document.publicationYear}
            </p>

            {document.fileName && (
                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                    {document.fileName}
                </div>
            )}

            <div className="mb-6 flex flex-wrap gap-2">
                {document.keywords.map((keyword) => (
                    <span
                        key={keyword}
                        className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                        {keyword}
                    </span>
                ))}
            </div>

            <div className="mb-6 flex-grow text-slate-700 dark:text-slate-300">
                <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-950 dark:text-white">
                    Tóm tắt
                </h2>
                <p className="text-sm leading-7">
                    {document.abstract || 'Tài liệu này chưa có phần tóm tắt.'}
                </p>
            </div>

            <div className="mb-6 grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-center text-sm dark:border-slate-800 dark:bg-slate-950/40">
                <div className="border-r border-slate-200 p-4 dark:border-slate-800">
                    <span className="block text-lg font-black text-slate-950 dark:text-white">
                        {document.viewCount}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Lượt xem</span>
                </div>
                <div className="p-4">
                    <span className="block text-lg font-black text-slate-950 dark:text-white">
                        {document.saveCount}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Lượt lưu</span>
                </div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
                {can('DOWNLOAD_DOC') && (
                    <Button
                        onClick={handleOpenDocument}
                        disabled={opening}
                        className="h-12 w-full bg-blue-600 text-base font-bold shadow-sm hover:bg-blue-700"
                    >
                        {opening ? 'Đang mở...' : 'Mở tài liệu'}
                    </Button>
                )}

                {can('SAVE_DOC') ? (
                    <Button className="h-12 w-full text-base font-bold shadow-sm">Lưu vào yêu thích</Button>
                ) : (
                    <Link href="/login" className="w-full">
                        <Button className="h-12 w-full text-base font-bold opacity-70">Đăng nhập để lưu</Button>
                    </Link>
                )}

                {can('ASK_AI') ? (
                    <Link href={`/ai?doc=${document.id}`} className="w-full">
                        <Button
                            variant="secondary"
                            className="h-12 w-full border-green-200 font-bold text-green-700 shadow-sm hover:bg-green-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
                        >
                            Hỏi AI về tài liệu này
                        </Button>
                    </Link>
                ) : (
                    <Link href="/login" className="w-full">
                        <Button
                            variant="secondary"
                            className="h-12 w-full border-slate-200 font-bold text-slate-500 shadow-sm hover:bg-slate-50"
                        >
                            Đăng nhập để hỏi AI
                        </Button>
                    </Link>
                )}
            </div>
        </section>
    );
}