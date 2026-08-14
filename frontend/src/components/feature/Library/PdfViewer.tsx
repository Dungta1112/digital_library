'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/Button';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

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

function readUint16(view: DataView, offset: number) {
    return view.getUint16(offset, true);
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

    const entryCount = readUint16(view, endOfCentralDirectory + 10);
    let centralDirectoryOffset = readUint32(view, endOfCentralDirectory + 16);

    for (let entryIndex = 0; entryIndex < entryCount; entryIndex += 1) {
        if (readUint32(view, centralDirectoryOffset) !== 0x02014b50) {
            throw new Error('Cấu trúc file DOCX không hợp lệ.');
        }

        const compressionMethod = readUint16(view, centralDirectoryOffset + 10);
        const compressedSize = readUint32(view, centralDirectoryOffset + 20);
        const fileNameLength = readUint16(view, centralDirectoryOffset + 28);
        const extraFieldLength = readUint16(view, centralDirectoryOffset + 30);
        const fileCommentLength = readUint16(view, centralDirectoryOffset + 32);
        const localHeaderOffset = readUint32(view, centralDirectoryOffset + 42);
        const fileName = decoder.decode(
            bytes.slice(centralDirectoryOffset + 46, centralDirectoryOffset + 46 + fileNameLength)
        );

        if (fileName === 'word/document.xml') {
            const localFileNameLength = readUint16(view, localHeaderOffset + 26);
            const localExtraFieldLength = readUint16(view, localHeaderOffset + 28);
            const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraFieldLength;
            const compressedData = bytes.slice(dataStart, dataStart + compressedSize);
            const xmlBytes =
                compressionMethod === 0 ? compressedData : await inflateRaw(compressedData);

            return decoder.decode(xmlBytes);
        }

        centralDirectoryOffset += 46 + fileNameLength + extraFieldLength + fileCommentLength;
    }

    throw new Error('Không tìm thấy nội dung trong file DOCX.');
}

function parseDocxParagraphs(xml: string) {
    const paragraphs = xml.match(/<w:p[\s\S]*?<\/w:p>/g) || [];

    return paragraphs
        .map((paragraph) => {
            const normalized = paragraph
                .replace(/<w:tab\s*\/>/g, '\t')
                .replace(/<w:br\s*\/>/g, '\n');
            const runs = normalized.match(/<w:t\b[^>]*>[\s\S]*?<\/w:t>/g) || [];

            return runs
                .map((run) => decodeXmlText(run.replace(/<w:t\b[^>]*>/, '').replace(/<\/w:t>/, '')))
                .join('');
        })
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}

function PdfDocumentViewer({ url }: { url: string }) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
        setPageNumber(1);
    }

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm">
            <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setPageNumber((p) => Math.max(1, p - 1))} disabled={pageNumber <= 1}>
                        Trước
                    </Button>
                    <span className="min-w-[112px] text-center text-sm font-medium text-gray-700">
                        Trang {pageNumber}/{numPages || '--'}
                    </span>
                    <Button size="sm" variant="secondary" onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))} disabled={pageNumber >= (numPages || 1)}>
                        Tiếp
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}>
                        -
                    </Button>
                    <span className="min-w-[50px] text-center text-sm font-medium text-gray-700">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button size="sm" variant="secondary" onClick={() => setScale((s) => Math.min(3, s + 0.2))}>
                        +
                    </Button>
                </div>
            </div>
            <div className="flex flex-grow justify-center overflow-auto bg-[#525659] p-4">
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex h-[600px] flex-col items-center justify-center text-white">
                            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
                            Đang tải PDF...
                        </div>
                    }
                    error={
                        <div className="rounded bg-red-500/20 p-10 text-white">
                            Không tải được file PDF. Kiểm tra lại đường dẫn file.
                        </div>
                    }
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer
                        renderAnnotationLayer
                        className="shadow-2xl"
                    />
                </Document>
            </div>
        </div>
    );
}

function DocxDocumentViewer({ url }: { url: string }) {
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadDocx() {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Không tải được file DOCX (${response.status})`);
                }
                const xml = await extractDocxDocumentXml(await response.arrayBuffer());
                const parsedParagraphs = parseDocxParagraphs(xml);
                if (!cancelled) {
                    setParagraphs(parsedParagraphs);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : 'Không đọc được nội dung file DOCX.');
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
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 p-3">
                <span className="text-sm font-semibold text-gray-700">Xem trước DOCX</span>
                <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-green-700 hover:text-green-600">
                    Mở file
                </a>
            </div>
            <div className="flex-grow overflow-auto bg-slate-100 p-4">
                <div className="mx-auto min-h-full max-w-3xl rounded-lg bg-white p-8 shadow-sm">
                    {loading && <p className="text-sm text-slate-500">Đang tải DOCX...</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {!loading && !error && paragraphs.length === 0 && (
                        <p className="text-sm text-slate-500">Không tìm thấy nội dung văn bản trong file DOCX này.</p>
                    )}
                    <div className="space-y-4 text-base leading-7 text-slate-800">
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
        <div className="flex h-full min-h-[600px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="mb-2 text-lg font-bold text-slate-900">Định dạng tài liệu không được hỗ trợ</h2>
            <p className="mb-6 max-w-md text-sm text-slate-500">
                Trình xem này chỉ hỗ trợ file PDF và DOCX. Bạn vẫn có thể mở hoặc tải file này trực tiếp.
            </p>
            <a href={url} target="_blank" rel="noreferrer" className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700">
                Mở file
            </a>
        </div>
    );
}

export function PdfViewer({ url }: { url: string }) {
    const fileType = useMemo(() => getFileExtension(url), [url]);

    if (fileType === 'docx') {
        return <DocxDocumentViewer url={url} />;
    }

    if (fileType === 'pdf') {
        return <PdfDocumentViewer url={url} />;
    }

    return <UnsupportedDocumentViewer url={url} />;
}