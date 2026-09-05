'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLibraryQueryState } from '@/hooks/useLibraryQueryState';
import { useLibraryDocuments } from '@/hooks/useLibraryDocuments';
import { LibraryHero } from '@/components/feature/Library/LibraryHero';
import { LibraryToolbar } from '@/components/feature/Library/LibraryToolbar';
import { LibraryControls, Pagination } from '@/components/feature/Library/LibraryControls';
import { DocumentGrid } from '@/components/feature/Library/DocumentGrid';
import { PersonalShelf } from '@/components/feature/Library/PersonalShelf';
import { useLibraryFavorites } from '@/hooks/useLibraryFavorites';

function LibraryContent() {
  const { user } = useAuth();

  const {
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
  } = useLibraryQueryState();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const favorites = useLibraryFavorites(user?.id);

  // Fetch documents from API based on submitted query & category
  const {
    documents,
    categories,
    loading,
    error,
    totalCount,
    totalPages,
    currentPage,
    retry,
  } = useLibraryDocuments({
    query,
    categoryId,
    page,
  });

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === categoryId) || null;
  }, [categories, categoryId]);

  const effectiveScope = user ? scope : 'all';
  const savedDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return favorites.favoriteDocuments.filter((document) => {
      const matchesQuery = !normalizedQuery ||
        document.title.toLowerCase().includes(normalizedQuery) ||
        document.authors?.some((author) => author.toLowerCase().includes(normalizedQuery));
      const matchesCategory = !categoryId || document.categoryId === categoryId;
      return matchesQuery && matchesCategory;
    });
  }, [favorites.favoriteDocuments, query, categoryId]);
  const visibleDocuments = effectiveScope === 'saved' ? savedDocuments : documents;
  const visibleLoading = effectiveScope === 'saved' ? favorites.loading : loading;
  const visibleError = effectiveScope === 'saved' ? favorites.error : error;
  const visibleTotalCount = effectiveScope === 'saved' ? savedDocuments.length : totalCount;

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 pb-20">
      {/* 1. Hero Search Section */}
      <LibraryHero
        draftQuery={draftQuery}
        setDraftQuery={setDraftQuery}
        onSearch={submitSearch}
        categories={categories}
        activeCategoryId={categoryId}
        onSelectCategory={setCategory}
      />

      {/* 2. Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8">
        {/* Personal Shelf (Saved on this device & Reading progress) */}
        {user && (
          <PersonalShelf
            scope={effectiveScope}
            onSelectScope={setScope}
            favoriteCount={favorites.favoriteDocuments.length}
            loading={favorites.loading}
            error={favorites.error}
            onRetry={favorites.retry}
          />
        )}

        {/* 2-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8 mt-6">
          {/* Left: 240px Sticky Sidebar */}
          <aside className="w-full lg:w-60 shrink-0">
            <LibraryControls
              categories={categories}
              activeCategoryId={categoryId}
              onSelectCategory={setCategory}
              mobileOpen={mobileFilterOpen}
              setMobileOpen={setMobileFilterOpen}
            />
          </aside>

          {/* Right: Toolbar + Grid / List Content + Pagination */}
          <main className="w-full min-w-0 flex-1 space-y-6">
            <LibraryToolbar
              totalCount={visibleTotalCount}
              currentPage={currentPage}
              pageSize={12}
              activeCategory={activeCategory}
              searchQuery={query}
              viewMode={view}
              onViewModeChange={setView}
              onClearSearch={clearSearch}
              onClearCategory={() => setCategory('')}
              onOpenMobileFilters={() => setMobileFilterOpen(true)}
            />

            <DocumentGrid
              documents={visibleDocuments}
              viewMode={view}
              loading={visibleLoading}
              error={visibleError}
              onRetry={effectiveScope === 'saved' ? favorites.retry : retry}
              onResetFilters={resetAllFilters}
              favoriteIds={favorites.favoriteIds}
              favoritePendingIds={favorites.pendingIds}
              onToggleFavorite={user ? favorites.toggleFavorite : undefined}
            />

            {effectiveScope === 'all' && !loading && totalPages > 1 && (
              <div className="pt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
        </div>
      }
    >
      <LibraryContent />
    </Suspense>
  );
}
