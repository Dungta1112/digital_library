'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LibraryViewMode } from '@/types/library';

export function useLibraryQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const query = searchParams.get('q') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
  const view: LibraryViewMode = searchParams.get('view') === 'list' ? 'list' : 'grid';
  const scope: 'all' | 'saved' = searchParams.get('scope') === 'saved' ? 'saved' : 'all';

  // Draft search query typed in input before submission
  const [draftQuery, setDraftQuery] = useState(query);

  const updateUrl = useCallback(
    (newParams: Record<string, string | number | null | undefined>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '' || value === 0) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      startTransition(() => {
        const queryStr = current.toString();
        router.push(`${pathname}${queryStr ? `?${queryStr}` : ''}`);
      });
    },
    [router, pathname, searchParams]
  );

  const submitSearch = useCallback(
    (nextQuery: string) => {
      const trimmed = nextQuery.trim();
      setDraftQuery(trimmed);
      updateUrl({
        q: trimmed || null,
        page: 1, // reset page on search
      });
    },
    [updateUrl]
  );

  const clearSearch = useCallback(() => {
    setDraftQuery('');
    updateUrl({
      q: null,
      page: 1,
    });
  }, [updateUrl]);

  const setCategory = useCallback(
    (catId: string) => {
      updateUrl({
        categoryId: catId || null,
        page: 1, // reset page on category change
      });
    },
    [updateUrl]
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateUrl({
        page: newPage > 1 ? newPage : null,
      });
    },
    [updateUrl]
  );

  const setView = useCallback(
    (newView: LibraryViewMode) => {
      updateUrl({
        view: newView === 'list' ? 'list' : null,
      });
    },
    [updateUrl]
  );

  const setScope = useCallback(
    (newScope: 'all' | 'saved') => {
      updateUrl({
        scope: newScope === 'saved' ? 'saved' : null,
        page: 1,
      });
    },
    [updateUrl]
  );

  const resetAllFilters = useCallback(() => {
    setDraftQuery('');
    updateUrl({
      q: null,
      categoryId: null,
      page: null,
      scope: null,
    });
  }, [updateUrl]);

  return {
    draftQuery,
    setDraftQuery,
    query,
    categoryId,
    page,
    view,
    scope,
    submitSearch,
    clearSearch,
    setCategory,
    setPage,
    setView,
    setScope,
    resetAllFilters,
  };
}
