'use client';

import React, { useState, useEffect } from 'react';
import { LibraryService } from '@/services/library.service';
import { Document, PaginatedResult } from '@/types/library';
import { DocumentGrid } from '@/components/feature/Library/DocumentGrid';
import { LibraryControls, Pagination } from '@/components/feature/Library/LibraryControls';

export default function LibraryPage() {
  const [data, setData] = useState<PaginatedResult<Document> | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const result = await LibraryService.getDocuments({ query, category }, page, 8);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [page, category]); // Auto fetch on category or page change

  const handleSearch = () => {
    if (page !== 1) {
      setPage(1); // will trigger useEffect
    } else {
      fetchDocuments();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pt-8 pb-16 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 mt-10 text-center md:text-left max-w-4xl">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">Thư viện Học thuật</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light tracking-tight leading-relaxed">Duyệt, tìm kiếm và khám phá các tài liệu khoa học trên nhiều lĩnh vực.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-[320px] shrink-0 sticky top-24">
            <LibraryControls 
              query={query} 
              setQuery={setQuery} 
              category={category} 
              setCategory={setCategory} 
              onSearch={handleSearch} 
            />
          </aside>
          
          <main className="flex-1 w-full min-w-0">
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
