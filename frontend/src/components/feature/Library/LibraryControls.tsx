import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LibraryService } from '@/services/library.service';
import { CaretLeft, CaretRight, MagnifyingGlass, X } from '@phosphor-icons/react';

interface LibraryControlsProps {
    query: string;
    setQuery: (q: string) => void;
    category: string;
    setCategory: (c: string) => void;
    onSearch: () => void;
}

export function LibraryControls({
    query,
    setQuery,
    category,
    setCategory,
    onSearch,
}: LibraryControlsProps) {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const hasFilters = Boolean(query.trim() || category);

    useEffect(() => {
        LibraryService.getCategories().then((data) => {
            setCategories([{ id: '', name: 'Tất cả tài liệu' }, ...data]);
        });
    }, []);

    const clearFilters = () => {
        setQuery('');
        setCategory('');
    };

    return (
        <aside className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white">
                        <MagnifyingGlass weight="bold" className="h-4 w-4 text-emerald-600" />
                        Tìm kiếm
                    </h2>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            <X weight="bold" className="h-3 w-3" />
                            Xoá lọc
                        </button>
                    )}
                </div>

                <Input
                    placeholder="Tiêu đề, tác giả, từ khoá..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && onSearch()}
                    className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950/50"
                />
                <Button
                    onClick={onSearch}
                    className="mt-3 h-11 w-full rounded-xl bg-emerald-700 font-bold text-white shadow-sm transition-all hover:bg-emerald-800 active:scale-[0.98]"
                >
                    Tìm kiếm
                </Button>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800" />

            <div>
                <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white">
                    Danh mục
                </h2>
                <div className="flex flex-col gap-1.5">
                    {categories.map((item) => {
                        const isActive = category === item.id;
                        return (
                            <button
                                key={item.id || 'all'}
                                type="button"
                                onClick={() => setCategory(item.id)}
                                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${isActive
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/20 dark:text-emerald-300'
                                        : 'border-transparent text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60'
                                    }`}
                            >
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}

export function Pagination({
    page,
    totalPages,
    setPage,
}: {
    page: number;
    totalPages: number;
    setPage: (p: number) => void;
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="mb-8 mt-14 flex items-center justify-center gap-4">
            <Button
                variant="secondary"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex h-11 w-11 items-center justify-center rounded-xl border-slate-200 bg-white p-0 shadow-sm hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900"
            >
                <CaretLeft weight="bold" className="h-5 w-5" />
            </Button>
            <span className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Trang {page} / {totalPages}
            </span>
            <Button
                variant="secondary"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex h-11 w-11 items-center justify-center rounded-xl border-slate-200 bg-white p-0 shadow-sm hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900"
            >
                <CaretRight weight="bold" className="h-5 w-5" />
            </Button>
        </div>
    );
}