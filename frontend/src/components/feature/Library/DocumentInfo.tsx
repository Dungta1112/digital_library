'use client';

import React from 'react';
import Link from 'next/link';
import { Document } from '@/types/library';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';
import { LibraryService } from '@/services/library.service';
import { FileDoc, FilePdf, BookOpen, BookmarkSimple, Robot } from '@phosphor-icons/react';

export function DocumentInfo({ document }: { document: Document }) {
    const { can, isGuest } = usePermissions();
    const [opening, setOpening] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const FileIcon = document.fileType === 'docx' ? FileDoc : FilePdf;

    const handleOpenDocument = async () => {
        try {
            setOpening(true);
            const url = await LibraryService.getDocumentReadUrl(document);
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        } finally {
            setOpening(false);
        }
    };

    const handleSaveDocument = () => {
        setSaved(!saved);
    };

    return (
        <section className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800/60">
                    {document.category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <FileIcon weight="duotone" className="h-4 w-4" />
                    {document.fileType?.toUpperCase() || 'PDF'}
                </span>
            </div>

            <h1 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-3xl dark:text-white">
                {document.title}
            </h1>
            <p className="mb-5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {document.authors.join(', ')} • Năm {document.publicationYear}
            </p>

            {document.fileName && (
                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                    Tên tệp: <span className="font-semibold text-slate-800 dark:text-slate-200">{document.fileName}</span>
                </div>
            )}

            {document.keywords.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                    {document.keywords.map((keyword) => (
                        <span
                            key={keyword}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                        >
                            #{keyword}
                        </span>
                    ))}
                </div>
            )}

            <div className="mb-6 flex-grow text-slate-700 dark:text-slate-300">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                    Tóm tắt nội dung
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {document.abstract || 'Tài liệu này chưa có phần tóm tắt nội dung.'}
                </p>
            </div>

            <div className="mb-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-center text-sm dark:border-slate-800 dark:bg-slate-950/40">
                <div className="border-r border-slate-200 p-4 dark:border-slate-800">
                    <span className="block text-xl font-extrabold text-slate-950 dark:text-white">
                        {document.viewCount}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Lượt đọc</span>
                </div>
                <div className="p-4">
                    <span className="block text-xl font-extrabold text-slate-950 dark:text-white">
                        {document.saveCount + (saved ? 1 : 0)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Lượt lưu</span>
                </div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
                <Button
                    onClick={handleOpenDocument}
                    disabled={opening}
                    className="h-12 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-base font-bold shadow-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <BookOpen weight="bold" className="w-5 h-5" />
                    {opening ? 'Đang mở tệp...' : 'Mở đọc tài liệu'}
                </Button>

                {isGuest ? (
                    <Link href="/login" className="w-full">
                        <Button variant="secondary" className="h-12 w-full text-sm font-bold rounded-xl border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
                            <BookmarkSimple weight="bold" className="w-4 h-4" />
                            Đăng nhập để lưu vào yêu thích
                        </Button>
                    </Link>
                ) : (
                    <Button
                        onClick={handleSaveDocument}
                        variant="secondary"
                        className={`h-12 w-full text-sm font-bold rounded-xl border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all ${
                            saved ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400' : ''
                        }`}
                    >
                        <BookmarkSimple weight={saved ? 'fill' : 'bold'} className="w-4 h-4" />
                        {saved ? 'Đã lưu vào danh sách' : 'Lưu vào yêu thích'}
                    </Button>
                )}

                {can('ASK_AI') ? (
                    <Link href={`/ai?doc=${document.id}`} className="w-full">
                        <Button
                            variant="secondary"
                            className="h-12 w-full border-emerald-200 font-bold text-emerald-700 shadow-sm hover:bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30 rounded-xl flex items-center justify-center gap-2"
                        >
                            <Robot weight="duotone" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            Hỏi đáp Trợ lý AI về tài liệu
                        </Button>
                    </Link>
                ) : (
                    <Link href="/login" className="w-full">
                        <Button
                            variant="secondary"
                            className="h-12 w-full border-slate-200 font-bold text-slate-500 shadow-sm hover:bg-slate-50 rounded-xl flex items-center justify-center gap-2"
                        >
                            <Robot weight="duotone" className="w-5 h-5" />
                            Đăng nhập để hỏi đáp AI
                        </Button>
                    </Link>
                )}
            </div>
        </section>
    );
}