import { describe, it, expect } from 'vitest';
import { normalizeApiDocument, ApiDocument } from '@/services/library.service';

describe('Library Document Normalization (Honest Metadata)', () => {
  it('should not invent fake author placeholder when authors are missing', () => {
    const raw: ApiDocument = {
      id: 'doc-no-author',
      title: 'Tài liệu không có tác giả',
      category: 'Kinh tế',
    };

    const normalized = normalizeApiDocument(raw);
    expect(normalized.authors).toBeUndefined();
    expect(normalized.title).toBe('Tài liệu không có tác giả');
  });

  it('should not invent publication year from createdAt or current year', () => {
    const raw: ApiDocument = {
      id: 'doc-no-year',
      title: 'Tài liệu không có năm',
      createdAt: '2022-01-01T00:00:00Z',
    };

    const normalized = normalizeApiDocument(raw);
    expect(normalized.publicationYear).toBeUndefined();
  });

  it('should preserve real publication year when provided', () => {
    const raw: ApiDocument = {
      id: 'doc-with-year',
      title: 'Giáo trình Toán',
      publicationYear: 2024,
    };

    const normalized = normalizeApiDocument(raw);
    expect(normalized.publicationYear).toBe(2024);
  });

  it('should separate viewCount, downloadCount, and saveCount independently', () => {
    const raw: ApiDocument = {
      id: 'doc-counts',
      title: 'Tài liệu chỉ số',
      viewCount: 150,
      downloadCount: 42,
      saveCount: 12,
    };

    const normalized = normalizeApiDocument(raw);
    expect(normalized.viewCount).toBe(150);
    expect(normalized.downloadCount).toBe(42);
    expect(normalized.saveCount).toBe(12);
  });

  it('should detect fileType correctly from MIME or verified extension without guessing pdf', () => {
    const docxRaw: ApiDocument = {
      id: 'doc-docx',
      title: 'Báo cáo',
      fileName: 'report.docx',
    };
    expect(normalizeApiDocument(docxRaw).fileType).toBe('docx');

    const pdfRaw: ApiDocument = {
      id: 'doc-pdf',
      title: 'Sách',
      fileName: 'book.pdf',
    };
    expect(normalizeApiDocument(pdfRaw).fileType).toBe('pdf');

    const unknownRaw: ApiDocument = {
      id: 'doc-unknown',
      title: 'Tài liệu khác',
      fileName: 'data.dat',
    };
    expect(normalizeApiDocument(unknownRaw).fileType).toBeUndefined();
  });
});
