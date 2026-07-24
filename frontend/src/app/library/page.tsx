'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { LibraryService } from '@/services/library.service';
import { Document, PaginatedResult } from '@/types/library';
import { DocumentGrid } from '@/components/feature/Library/DocumentGrid';
import { LibraryControls, Pagination } from '@/components/feature/Library/LibraryControls';

export default function LibraryPage() {
  const [data, setData] = useState<PaginatedResult<Document> | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategoryValue] = useState('');
  const [page, setPage] = useState(1);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await LibraryService.getDocuments({ query, category }, page, 8);
      setData(result);
    } catch (error) {
      console.error('Failed to fetch documents', error);
      setData({ data: [], total: 0, page: 1, limit: 8, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [category, page, query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocuments();
  }, [fetchDocuments]);

  const setCategory = (nextCategory: string) => {
    setCategoryValue(nextCategory);
    setPage(1);
  };

  const handleSearch = () => {
    if (page !== 1) {
      setPage(1);
      return;
    }
    fetchDocuments();
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16 pt-8 transition-colors duration-300 dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 mt-8 max-w-4xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-400">
            Academic Library
          </p>
          <h1 className="mb-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl dark:text-white">
            Browse research documents
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
            Search, preview, and read academic PDFs or DOCX files. Each card is mapped directly to
            the document opened in the reader.
          </p>
        </header>

        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[320px]">
            <LibraryControls
              query={query}
              setQuery={setQuery}
              category={category}
              setCategory={setCategory}
              onSearch={handleSearch}
            />
          </div>

          <main className="w-full min-w-0 flex-1">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white">
                  Documents
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {loading ? 'Loading documents...' : `${data?.total || 0} documents found`}
                </p>
              </div>
            </div>

            <DocumentGrid documents={data?.data || []} loading={loading} />

            {data && !loading && (
              <Pagination page={data.page} totalPages={data.totalPages} setPage={setPage} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
