'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LibraryService } from '@/services/library.service';
import { Document } from '@/types/library';

export function useLibraryFavorites(userId?: string) {
  const [favoriteDocuments, setFavoriteDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const controllerRef = useRef<AbortController | null>(null);
  const favoriteDocumentsRef = useRef<Document[]>([]);
  const pendingIdsRef = useRef<Set<string>>(new Set());

  const loadFavorites = useCallback(async () => {
    controllerRef.current?.abort();
    if (!userId) {
      favoriteDocumentsRef.current = [];
      pendingIdsRef.current = new Set();
      setFavoriteDocuments([]);
      setPendingIds(new Set());
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const documents = await LibraryService.getFavoriteDocuments(controller.signal);
      if (!controller.signal.aborted) {
        favoriteDocumentsRef.current = documents;
        setFavoriteDocuments(documents);
      }
    } catch (reason: unknown) {
      if (!controller.signal.aborted) {
        setError(reason instanceof Error ? reason.message : 'Không thể tải tài liệu đã lưu.');
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [userId]);

  /* eslint-disable react-hooks/set-state-in-effect -- synchronize server favorites with authenticated user */
  useEffect(() => {
    loadFavorites();
    return () => controllerRef.current?.abort();
  }, [loadFavorites]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleFavorite = useCallback(async (document: Document) => {
    if (!userId || pendingIdsRef.current.has(document.id)) return false;
    const wasFavorite = favoriteDocumentsRef.current.some((item) => item.id === document.id);
    pendingIdsRef.current = new Set(pendingIdsRef.current).add(document.id);
    setPendingIds(pendingIdsRef.current);
    setError(null);
    const optimisticDocuments = wasFavorite
      ? favoriteDocumentsRef.current.filter((item) => item.id !== document.id)
      : [document, ...favoriteDocumentsRef.current];
    favoriteDocumentsRef.current = optimisticDocuments;
    setFavoriteDocuments(optimisticDocuments);

    try {
      if (wasFavorite) {
        await LibraryService.unfavoriteDocument(document.id);
      } else {
        await LibraryService.favoriteDocument(document.id);
      }
      return true;
    } catch (reason: unknown) {
      const rolledBackDocuments =
        wasFavorite
          ? favoriteDocumentsRef.current.some((item) => item.id === document.id)
            ? favoriteDocumentsRef.current
            : [document, ...favoriteDocumentsRef.current]
          : favoriteDocumentsRef.current.filter((item) => item.id !== document.id);
      favoriteDocumentsRef.current = rolledBackDocuments;
      setFavoriteDocuments(rolledBackDocuments);
      setError(reason instanceof Error ? reason.message : 'Không thể cập nhật tài liệu đã lưu.');
      return false;
    } finally {
      const nextPending = new Set(pendingIdsRef.current);
      nextPending.delete(document.id);
      pendingIdsRef.current = nextPending;
      setPendingIds(nextPending);
    }
  }, [userId]);

  const favoriteIds = useMemo(
    () => new Set(favoriteDocuments.map((document) => document.id)),
    [favoriteDocuments]
  );

  return {
    favoriteDocuments,
    favoriteIds,
    pendingIds,
    loading,
    error,
    toggleFavorite,
    retry: loadFavorites,
  };
}
