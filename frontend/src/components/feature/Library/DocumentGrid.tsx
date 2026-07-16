import React from 'react';
import Link from 'next/link';
import { Document } from '@/types/library';
import {
  FileDoc,
  FilePdf,
  FloppyDisk,
  MagnifyingGlass,
  Eye,
} from '@phosphor-icons/react';

const CATEGORY_STYLES: Record<string, { cover: string; badge: string; accent: string }> = {
  Dissertation: {
    cover: 'from-emerald-900 via-emerald-700 to-teal-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    accent: 'text-emerald-700',
  },
  'Academic Thesis': {
    cover: 'from-blue-950 via-blue-800 to-cyan-700',
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    accent: 'text-blue-700',
  },
  'Master Thesis': {
    cover: 'from-violet-950 via-violet-800 to-fuchsia-700',
    badge: 'bg-violet-50 text-violet-700 border-violet-100',
    accent: 'text-violet-700',
  },
  'Archive Document': {
    cover: 'from-amber-900 via-orange-700 to-yellow-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    accent: 'text-amber-700',
  },
};

function getCategoryStyle(category: string) {
  return (
    CATEGORY_STYLES[category] || {
      cover: 'from-slate-900 via-slate-700 to-slate-600',
      badge: 'bg-slate-50 text-slate-700 border-slate-100',
      accent: 'text-slate-700',
    }
  );
}

function getInitials(title: string) {
  return title
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

function DocumentCover({ document }: { document: Document }) {
  const style = getCategoryStyle(document.category);
  const isDocx = document.fileType === 'docx';
  const FileIcon = isDocx ? FileDoc : FilePdf;

  return (
    <div className={`relative min-h-[168px] overflow-hidden bg-gradient-to-br ${style.cover} p-5 text-white`}>
      <div className="absolute right-[-42px] top-[-42px] h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute bottom-[-54px] left-[-30px] h-36 w-36 rounded-full bg-black/10" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur">
            <FileIcon weight="duotone" className="h-4 w-4" />
            {document.fileType?.toUpperCase() || 'FILE'}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            {document.publicationYear}
          </span>
        </div>

        <div>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-black tracking-wide shadow-inner backdrop-blur">
            {getInitials(document.title)}
          </div>
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-white/90">
            {document.title}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DocumentCard({ document }: { document: Document }) {
  const style = getCategoryStyle(document.category);

  return (
    <article className="group flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800">
      <DocumentCover document={document} />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${style.badge}`}>
            {document.category}
          </span>
          {document.keywords.slice(0, 2).map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {keyword}
            </span>
          ))}
        </div>

        <h3
          className="mb-2 line-clamp-3 text-lg font-bold leading-snug text-slate-950 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400"
          title={document.title}
        >
          {document.title}
        </h3>

        <p className={`mb-4 text-xs font-semibold uppercase tracking-wide ${style.accent}`}>
          {document.authors.join(', ')} • {document.publicationYear}
        </p>

        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {document.abstract || 'No abstract has been provided for this document.'}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Eye weight="bold" className="h-4 w-4" />
              {document.viewCount}
            </span>
            <span className="flex items-center gap-1.5">
              <FloppyDisk weight="bold" className="h-4 w-4" />
              {document.saveCount}
            </span>
          </div>
          <Link
            href={`/library/document/${document.id}`}
            className="rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

export function DocumentGrid({
  documents,
  loading,
}: {
  documents: Document[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="h-[480px] animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-[168px] bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-4 p-5">
              <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-7 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-20 w-full rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-28 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
          <MagnifyingGlass weight="duotone" className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-950 dark:text-white">
          No matching documents
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Try changing the search keyword, selecting another category, or clearing the current
          filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}
