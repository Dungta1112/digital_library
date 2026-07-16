'use client';

import dynamic from 'next/dynamic';

// react-pdf cần DOMMatrix của trình duyệt nên tuyệt đối không render module này ở server.
// Wrapper client-only này tránh lỗi 500 khi mở trang chi tiết tài liệu trong Next.js App Router.
const PdfViewer = dynamic(
  () => import('./PdfViewer').then((pdfModule) => pdfModule.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[600px] items-center justify-center rounded-xl bg-slate-200 text-sm font-medium text-slate-500 animate-pulse">
        Đang khởi tạo trình đọc PDF...
      </div>
    ),
  }
);

export function PdfViewerClient({ url }: { url: string }) {
  return <PdfViewer url={url} />;
}
