import { describe, expect, it } from 'vitest';
import { MAX_PDF_BYTES, validatePdfFile } from '@/components/feature/Document/UploadDocumentDialog';

describe('validatePdfFile', () => {
  it('accepts a PDF within 50 MB', () => {
    expect(validatePdfFile(new File(['pdf'], 'lesson.pdf', { type: 'application/pdf' }))).toBeNull();
  });

  it('rejects a non-PDF extension or MIME type', () => {
    expect(validatePdfFile(new File(['text'], 'lesson.txt', { type: 'text/plain' }))).toBe('Chỉ chấp nhận tệp định dạng PDF.');
    expect(validatePdfFile(new File(['pdf'], 'lesson.pdf', { type: 'text/plain' }))).toBe('Chỉ chấp nhận tệp định dạng PDF.');
  });

  it('rejects a PDF larger than 50 MB', () => {
    const oversized = {
      name: 'large.pdf',
      type: 'application/pdf',
      size: MAX_PDF_BYTES + 1,
    } as File;
    expect(validatePdfFile(oversized)).toBe('Tệp PDF không được vượt quá 50 MB.');
  });
});
