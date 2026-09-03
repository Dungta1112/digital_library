import { describe, it, expect, beforeEach } from 'vitest';
import { LibraryLocalStorage } from '@/lib/library-local-storage';
import { SavedDocumentItem } from '@/types/library';

describe('LibraryLocalStorage (Personal Shelf & Reading Progress)', () => {
  const userId = 'user-test-123';

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return empty list when no documents are saved', () => {
    const list = LibraryLocalStorage.getSavedDocuments(userId);
    expect(list).toEqual([]);
  });

  it('should save and check saved documents correctly', () => {
    const item: SavedDocumentItem = {
      id: 'doc-1',
      title: 'Giáo trình Cơ sở dữ liệu',
      authors: ['TS. Nguyễn Văn A'],
      category: 'Công nghệ thông tin',
      fileType: 'pdf',
      savedAt: new Date().toISOString(),
    };

    LibraryLocalStorage.saveDocument(userId, item);
    expect(LibraryLocalStorage.isDocumentSaved(userId, 'doc-1')).toBe(true);
    expect(LibraryLocalStorage.isDocumentSaved(userId, 'doc-2')).toBe(false);

    const saved = LibraryLocalStorage.getSavedDocuments(userId);
    expect(saved.length).toBe(1);
    expect(saved[0].title).toBe('Giáo trình Cơ sở dữ liệu');
  });

  it('should remove saved documents', () => {
    const item: SavedDocumentItem = {
      id: 'doc-1',
      title: 'Giáo trình Cơ sở dữ liệu',
      category: 'Công nghệ thông tin',
      savedAt: new Date().toISOString(),
    };

    LibraryLocalStorage.saveDocument(userId, item);
    expect(LibraryLocalStorage.isDocumentSaved(userId, 'doc-1')).toBe(true);

    LibraryLocalStorage.removeSavedDocument(userId, 'doc-1');
    expect(LibraryLocalStorage.isDocumentSaved(userId, 'doc-1')).toBe(false);
    expect(LibraryLocalStorage.getSavedDocuments(userId).length).toBe(0);
  });

  it('should save and retrieve reading progress', () => {
    expect(LibraryLocalStorage.getReadingProgress(userId, 'doc-1')).toBeNull();

    LibraryLocalStorage.saveReadingProgress(userId, 'doc-1', 15, 80);
    const progress = LibraryLocalStorage.getReadingProgress(userId, 'doc-1');

    expect(progress).not.toBeNull();
    expect(progress?.pageNumber).toBe(15);
    expect(progress?.totalPdfPages).toBe(80);
  });

  it('should clear all data for a specific user namespace', () => {
    LibraryLocalStorage.saveDocument(userId, {
      id: 'doc-1',
      title: 'Tài liệu A',
      category: 'CNTT',
      savedAt: new Date().toISOString(),
    });
    LibraryLocalStorage.saveReadingProgress(userId, 'doc-1', 5);

    expect(LibraryLocalStorage.getSavedDocuments(userId).length).toBe(1);
    expect(LibraryLocalStorage.getReadingProgress(userId, 'doc-1')).not.toBeNull();

    LibraryLocalStorage.clearAllForUser(userId);

    expect(LibraryLocalStorage.getSavedDocuments(userId).length).toBe(0);
    expect(LibraryLocalStorage.getReadingProgress(userId, 'doc-1')).toBeNull();
  });
});
