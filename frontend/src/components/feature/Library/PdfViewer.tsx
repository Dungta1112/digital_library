'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowSquareOut,
  FileText,
  WarningCircle,
  BookOpen,
} from '@phosphor-icons/react';

interface PdfViewerProps {
  url: string;
  fileType?: 'pdf' | 'docx';
  initialPage?: number;
  scale?: number;
  onPageChange?: (page: number) => void;
  onTotalPagesChange?: (total: number) => void;
}

function getFileExtension(url: string) {
  const cleanUrl = url.split('?')[0].split('#')[0];
  const extension = cleanUrl.slice(cleanUrl.lastIndexOf('.') + 1).toLowerCase();
  return extension || 'pdf';
}

function decodeXmlText(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function readUint32(view: DataView, offset: number) {
  return view.getUint32(offset, true);
}

async function inflateRaw(data: Uint8Array) {
  if (!('DecompressionStream' in window)) {
    throw new Error('Trình duyệt này không hỗ trợ giải nén file DOCX.');
  }

  const buffer = new ArrayBuffer(data.byteLength);
  new Uint8Array(buffer).set(data);
  const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function extractDocxDocumentXml(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const decoder = new TextDecoder();
  let endOfCentralDirectory = -1;

  for (let offset = bytes.length - 22; offset >= 0; offset -= 1) {
    if (readUint32(view, offset) === 0x06054b50) {
      endOfCentralDirectory = offset;
      break;
    }
  }

  if (endOfCentralDirectory < 0) {
    throw new Error('File DOCX không hợp lệ.');
  }

  const totalEntries = view.getUint16(endOfCentralDirectory + 10, true);
  const cdOffset = view.getUint32(endOfCentralDirectory + 16, true);
  let entryOffset = cdOffset;

  for (let i = 0; i < totalEntries; i += 1) {
    if (readUint32(view, entryOffset) !== 0x02014b50) {
      break;
    }

    const compressionMethod = view.getUint16(entryOffset + 10, true);
    const compressedSize = view.getUint32(entryOffset + 20, true);
    const fileNameLength = view.getUint16(entryOffset + 28, true);
    const extraFieldLength = view.getUint16(entryOffset + 30, true);
    const fileCommentLength = view.getUint16(entryOffset + 32, true);
    const localHeaderOffset = view.getUint32(entryOffset + 42, true);

    const fileNameBytes = bytes.slice(entryOffset + 46, entryOffset + 46 + fileNameLength);
    const fileName = decoder.decode(fileNameBytes);

    if (fileName === 'word/document.xml') {
      const localView = new DataView(buffer, localHeaderOffset);
      const localFileNameLength = localView.getUint16(26, true);
      const localExtraFieldLength = localView.getUint16(28, true);
      const fileDataOffset = localHeaderOffset + 30 + localFileNameLength + localExtraFieldLength;
      const compressedData = bytes.slice(fileDataOffset, fileDataOffset + compressedSize);

      if (compressionMethod === 0) {
        return decoder.decode(compressedData);
      }
      if (compressionMethod === 8) {
        const decompressed = await inflateRaw(compressedData);
        return decoder.decode(decompressed);
      }
      throw new Error(`Phương thức nén DOCX không được hỗ trợ (${compressionMethod}).`);
    }

    entryOffset += 46 + fileNameLength + extraFieldLength + fileCommentLength;
  }

  throw new Error('Không tìm thấy nội dung document.xml trong file DOCX.');
}

function parseParagraphsFromXml(xmlText: string): string[] {
  const paragraphMatches = xmlText.match(/<w:p\b[\s\S]*?<\/w:p>/g) || [];
  const paragraphs: string[] = [];

  for (const paragraphXml of paragraphMatches) {
    const textMatches = paragraphXml.match(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g) || [];
    const paragraphContent = textMatches
      .map((textNode) => textNode.replace(/<[^>]+>/g, ''))
      .join('')
      .trim();

    if (paragraphContent) {
      paragraphs.push(decodeXmlText(paragraphContent));
    }
  }

  return paragraphs;
}

function PdfDocumentViewer({
  url,
  initialPage = 1,
  scale = 1,
}: {
  url: string;
  initialPage?: number;
  scale?: number;
}) {
  const [loadError, setLoadError] = useState(false);

  const viewerUrl = useMemo(() => {
    const zoomPercent = Math.round(scale * 100);
    return `${url}#page=${initialPage}&zoom=${zoomPercent}`;
  }, [url, initialPage, scale]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl min-h-[680px]">
      <div className="relative flex-grow bg-slate-950 flex items-center justify-center">
        {loadError ? (
          <div className="p-8 text-center text-slate-300 max-w-md">
            <WarningCircle weight="duotone" className="h-10 w-10 text-amber-400 mx-auto mb-3" />
            <p className="text-sm font-bold mb-2">Trình duyệt không thể nhúng PDF trực tiếp</p>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Bạn có thể mở tệp trực tiếp trong tab mới hoặc tải về máy để xem.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500"
            >
              <ArrowSquareOut weight="bold" className="h-4 w-4" />
              <span>Mở PDF trong tab mới</span>
            </a>
          </div>
        ) : (
          <iframe
            key={viewerUrl}
            src={viewerUrl}
            title="Trình đọc PDF học thuật"
            className="h-full w-full border-0"
            onError={() => setLoadError(true)}
          />
        )}
      </div>
    </div>
  );
}

function DocxDocumentViewer({ url }: { url: string }) {
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDocx() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Không tải được file DOCX (mã lỗi ${response.status}).`);
        }

        const buffer = await response.arrayBuffer();
        const xml = await extractDocxDocumentXml(buffer);
        const parsedParagraphs = parseParagraphsFromXml(xml);

        if (!cancelled) {
          setParagraphs(parsedParagraphs);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Không đọc được nội dung văn bản file DOCX.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDocx();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl min-h-[680px]">
      {/* Header with Honest Disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText weight="bold" className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">Trích xuất văn bản DOCX</span>
          <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
            Xem trước văn bản — bố cục có thể khác bản gốc
          </span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <ArrowSquareOut weight="bold" className="h-3.5 w-3.5" />
          <span>Mở file gốc</span>
        </a>
      </div>

      <div className="flex-grow overflow-auto bg-slate-950 p-6 custom-scrollbar">
        <div className="mx-auto min-h-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl text-slate-100">
          {loading && (
            <div className="flex h-40 items-center justify-center text-xs text-slate-400">
              <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              Đang phân tích văn bản DOCX...
            </div>
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}
          {!loading && !error && paragraphs.length === 0 && (
            <p className="text-xs text-slate-400">Không tìm thấy nội dung văn bản trong file này.</p>
          )}
          <div className="space-y-4 text-sm leading-7 text-slate-200">
            {paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UnsupportedDocumentViewer({ url }: { url: string }) {
  return (
    <div className="flex h-full min-h-[600px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center text-slate-200">
      <BookOpen weight="duotone" className="h-12 w-12 text-slate-400 mb-3" />
      <h2 className="mb-2 text-base font-bold text-white">Định dạng tài liệu</h2>
      <p className="mb-6 max-w-md text-xs text-slate-400 leading-relaxed">
        Bạn có thể mở trực tiếp hoặc tải tệp này về máy tính để xem với ứng dụng chuyên dụng.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition-colors"
      >
        <ArrowSquareOut weight="bold" className="h-4 w-4" />
        <span>Mở tài liệu ngay</span>
      </a>
    </div>
  );
}

export function PdfViewer({
  url,
  fileType,
  initialPage = 1,
  scale = 1,
}: PdfViewerProps) {
  const extType = useMemo(() => getFileExtension(url), [url]);
  const detectedType = fileType || extType;

  if (detectedType === 'docx') {
    return <DocxDocumentViewer url={url} />;
  }

  if (detectedType === 'pdf') {
    return (
      <PdfDocumentViewer
        url={url}
        initialPage={initialPage}
        scale={scale}
      />
    );
  }

  return <UnsupportedDocumentViewer url={url} />;
}