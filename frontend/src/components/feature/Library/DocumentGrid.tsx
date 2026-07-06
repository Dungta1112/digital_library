import React from 'react';
import { Document } from '@/types/library';
import Link from 'next/link';
import { Eye, FloppyDisk, Image, MagnifyingGlass } from '@phosphor-icons/react';

export function DocumentCard({ document }: { document: Document }) {
  return (
    <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/30 group">
      <div className="h-48 bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
        {document.coverImageUrl ? (
          <img src={document.coverImageUrl} alt={document.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800/50">
            <Image weight="duotone" className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-medium">Không có ảnh bìa</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur text-emerald-700 dark:text-emerald-400 font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm transition-colors duration-300 border border-slate-100 dark:border-slate-700">
          {document.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-slate-900 dark:text-white leading-tight transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400" title={document.title}>{document.title}</h3>
        <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium mb-3 transition-colors duration-300 tracking-wide">{document.authors.join(', ')} • {document.publicationYear}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-grow leading-relaxed transition-colors duration-300">{document.abstract}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex gap-4 transition-colors duration-300">
            <span className="flex items-center gap-1.5"><Eye weight="bold" className="w-4 h-4" /> {document.viewCount}</span>
            <span className="flex items-center gap-1.5"><FloppyDisk weight="bold" className="w-4 h-4" /> {document.saveCount}</span>
          </span>
          <Link href={`/library/document/${document.id}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DocumentGrid({ documents, loading }: { documents: Document[], loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-3xl h-[420px] bg-white dark:bg-slate-900 shadow-sm animate-pulse transition-colors duration-300">
            <div className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-t-3xl mb-4 transition-colors duration-300"></div>
            <div className="px-6 space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-800/80 rounded w-3/4 transition-colors duration-300"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800/80 rounded w-1/2 transition-colors duration-300"></div>
              <div className="h-16 bg-slate-200 dark:bg-slate-800/80 rounded w-full mt-4 transition-colors duration-300"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-32 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6 shadow-inner">
           <MagnifyingGlass weight="duotone" className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">Không tìm thấy tài liệu</h3>
        <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300 max-w-md">Hãy thử điều chỉnh từ khóa tìm kiếm hoặc chọn bộ lọc khác để khám phá tri thức.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {documents.map(doc => <DocumentCard key={doc.id} document={doc} />)}
    </div>
  );
}
