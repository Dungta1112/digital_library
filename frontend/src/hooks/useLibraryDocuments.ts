'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LibraryService, Category } from '@/services/library.service';
import { Document } from '@/types/library';

interface UseLibraryDocumentsParams {
  query: string;
  categoryId: string;
  page: number;
  pageSize?: number;
}

export function useLibraryDocuments({
  query,
  categoryId,
  page,
  pageSize = 12,
}: UseLibraryDocumentsParams) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load categories once
  useEffect(() => {
    let active = true;
    LibraryService.getCategories()
      .then((cats) => {
        if (active) setCategories(cats);
      })
      .catch((e) => {
        console.warn('Không tải được danh mục học thuật:', e);
      });
    return () => {
      active = false;
    };
  }, []);

  // Fetch documents with AbortController (LIB-04)
  const fetchDocs = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await LibraryService.getDocuments(
        {
          query: query || undefined,
          categoryId: categoryId || undefined,
        },
        page,
        pageSize,
        controller.signal
      );

      if (!controller.signal.aborted) {
        setDocuments(result.data || []);
        setTotalCount(result.total || 0);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.page || page);
      }
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      console.error('Lỗi khi nạp danh sách tài liệu:', err);
      setError(
        err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ thư viện.'
      );
      setDocuments([]);
      setTotalCount(0);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [query, categoryId, page, pageSize]);

  /* eslint-disable react-hooks/set-state-in-effect -- Asynchronously fetch documents on query or page changes */
  useEffect(() => {
    fetchDocs();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDocs]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return {
    documents,
    categories,
    loading,
    error,
    totalCount,
    totalPages,
    currentPage,
    retry: fetchDocs,
  };
}
