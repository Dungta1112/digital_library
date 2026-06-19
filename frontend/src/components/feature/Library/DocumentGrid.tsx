import React from 'react';
import { Document } from '@/types/library';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function DocumentCard({ document }: { document: Document }) {
  return (
    <div className="flex flex-col border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl dark:hover:shadow-green-900/20 transition-all duration-300 hover:-translate-y-2 group">
      <div className="h-48 bg-gray-50 dark:bg-slate-800 relative overflow-hidden group-hover:opacity-90 transition-opacity">
        {document.coverImageUrl ? (
          <img src={document.coverImageUrl} alt={document.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">Không có ảnh bìa</div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-green-700 dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-full shadow-sm transition-colors duration-300">
          {document.category}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-1.5 line-clamp-2 text-gray-900 dark:text-white leading-tight transition-colors duration-300" title={document.title}>{document.title}</h3>
        <p className="text-xs text-green-700 dark:text-green-400 font-medium mb-2.5 transition-colors duration-300">{document.authors.join(', ')} • {document.publicationYear}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-5 flex-grow leading-relaxed transition-colors duration-300">{document.abstract}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex gap-3 transition-colors duration-300">
            <span className="flex items-center gap-1">👁 {document.viewCount}</span>
            <span className="flex items-center gap-1">💾 {document.saveCount}</span>
          </span>
          <Link href={`/library/document/${document.id}`}>
            <Button size="sm" variant="secondary" className="hover:border-green-600 dark:hover:border-green-500 hover:text-green-700 dark:hover:text-green-400">Xem chi tiết</Button>
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
          <div key={i} className="border border-gray-100 dark:border-slate-800 rounded-3xl h-[420px] bg-white dark:bg-slate-900 shadow-sm animate-pulse transition-colors duration-300">
            <div className="h-48 bg-gray-100 dark:bg-slate-800 rounded-t-3xl mb-4 transition-colors duration-300"></div>
            <div className="px-5 space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-3/4 transition-colors duration-300"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/2 transition-colors duration-300"></div>
              <div className="h-16 bg-gray-200 dark:bg-slate-800 rounded w-full mt-4 transition-colors duration-300"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Không tìm thấy tài liệu</h3>
        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {documents.map(doc => <DocumentCard key={doc.id} document={doc} />)}
    </div>
  );
}
