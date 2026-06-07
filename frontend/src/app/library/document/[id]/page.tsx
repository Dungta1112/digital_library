import React from 'react';
import { LibraryService } from '@/services/library.service';
import { DocumentInfo } from '@/components/feature/Library/DocumentInfo';
import { PdfViewer } from '@/components/feature/Library/PdfViewer';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const document = await LibraryService.getDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/80 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <Link href="/library" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-600 mb-6 transition-colors bg-white px-4 py-2 rounded-full border shadow-sm">
          ← Back to Library
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] min-h-[800px]">
          {/* Left Column: Metadata */}
          <div className="lg:col-span-4 h-full">
            <DocumentInfo document={document} />
          </div>
          
          {/* Right Column: PDF Viewer */}
          <div className="lg:col-span-8 h-full">
             <PdfViewer url={document.pdfUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
