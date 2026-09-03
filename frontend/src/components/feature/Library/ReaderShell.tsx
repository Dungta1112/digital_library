'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Document } from '@/types/library';
import { ReaderToolbar } from './ReaderToolbar';

interface ReaderShellProps {
  document: Document;
  currentPage: number;
  totalPages: number;
  scale: number;
  onPageChange: (newPage: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onDownload?: () => void;
  children: React.ReactNode;
}

export function ReaderShell({
  document,
  currentPage,
  totalPages,
  scale,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onDownload,
  children,
}: ReaderShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (typeof window === 'undefined') return;

    if (!window.document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      window.document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(window.document.fullscreenElement));
    };

    window.document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      window.document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-100"
    >
      {/* Reader Top Toolbar */}
      <ReaderToolbar
        document={document}
        currentPage={currentPage}
        totalPages={totalPages}
        scale={scale}
        isFullscreen={isFullscreen}
        onPageChange={onPageChange}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetZoom={onResetZoom}
        onToggleFullscreen={toggleFullscreen}
        onDownload={onDownload}
      />

      {/* Reader Canvas Content Area */}
      <main className="flex-1 w-full overflow-auto bg-slate-950/90 flex flex-col items-center justify-start p-2 sm:p-4 custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
