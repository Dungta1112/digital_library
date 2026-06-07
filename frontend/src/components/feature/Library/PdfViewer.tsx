'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/Button';

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  if (!mounted) return <div className="h-full bg-gray-100 rounded-xl animate-pulse"></div>;

  return (
    <div className="flex flex-col h-full bg-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex flex-wrap justify-between items-center bg-white p-3 border-b border-gray-200 shadow-sm z-10">
        <div className="flex gap-2 items-center">
           <Button size="sm" variant="secondary" onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}>Prev</Button>
           <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">Page {pageNumber} of {numPages || '--'}</span>
           <Button size="sm" variant="secondary" onClick={() => setPageNumber(p => Math.min(numPages || 1, p + 1))} disabled={pageNumber >= (numPages || 1)}>Next</Button>
        </div>
        <div className="flex gap-2 items-center">
           <Button size="sm" variant="secondary" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>-</Button>
           <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
           <Button size="sm" variant="secondary" onClick={() => setScale(s => Math.min(3, s + 0.2))}>+</Button>
        </div>
      </div>
      <div className="flex-grow overflow-auto p-4 flex justify-center bg-[#525659]">
        <Document 
          file={url} 
          onLoadSuccess={onDocumentLoadSuccess} 
          loading={
            <div className="flex flex-col items-center justify-center text-white h-[600px]">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              Loading PDF...
            </div>
          }
          error={<div className="text-white p-10 bg-red-500/20 rounded">Failed to load PDF file. (Mock URL may be invalid)</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={true} 
            renderAnnotationLayer={true} 
            className="shadow-2xl" 
          />
        </Document>
      </div>
    </div>
  );
}
