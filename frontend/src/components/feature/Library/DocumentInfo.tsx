import React from 'react';
import { Document } from '@/types/library';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';

export function DocumentInfo({ document }: { document: Document }) {
  const { can, isGuest } = usePermissions();

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-4 w-max">
        {document.category}
      </div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">{document.title}</h1>
      <p className="text-green-700 font-medium mb-6">{document.authors.join(', ')} • {document.publicationYear}</p>
      
      <div className="mb-8 flex flex-wrap gap-2">
        {document.keywords.map(kw => (
          <span key={kw} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md border border-gray-200">{kw}</span>
        ))}
      </div>

      <div className="prose prose-sm text-gray-700 mb-8 flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Abstract</h3>
        <p className="leading-relaxed text-base">{document.abstract}</p>
      </div>

      <div className="flex justify-around items-center text-sm text-gray-500 mb-8 border-t border-b border-gray-100 py-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          <span className="text-xl mb-1">👁</span>
          <span className="font-semibold text-gray-900">{document.viewCount}</span>
          <span className="text-xs">Views</span>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-xl mb-1">💾</span>
          <span className="font-semibold text-gray-900">{document.saveCount}</span>
          <span className="text-xs">Saves</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        {can('DOWNLOAD_DOC') && (
          <Button className="w-full h-12 shadow-md text-base bg-blue-600 hover:bg-blue-700">
            <span className="mr-2">⬇️</span> Tải tài liệu
          </Button>
        )}
        
        {can('SAVE_DOC') ? (
          <Button className="w-full h-12 shadow-md text-base">
            <span className="mr-2">💾</span> Save to Favorites
          </Button>
        ) : (
          <Link href="/login" className="w-full">
             <Button className="w-full h-12 shadow-md text-base opacity-70">Đăng nhập để lưu</Button>
          </Link>
        )}

        {can('ASK_AI') ? (
          <Link href={`/ai?doc=${document.id}`} className="w-full">
            <Button variant="secondary" className="w-full h-12 border-green-200 text-green-700 hover:bg-green-50 shadow-sm font-semibold">
              <span className="mr-2">🤖</span> Ask AI about this document
            </Button>
          </Link>
        ) : (
          <Link href="/login" className="w-full">
             <Button variant="secondary" className="w-full h-12 border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm font-semibold">Đăng nhập để hỏi AI</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
