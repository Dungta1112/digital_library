import { SavedDocumentItem, ReadingProgressItem } from '@/types/library';

const STORAGE_VERSION = 1;
const SHELF_PREFIX = `library_shelf_v${STORAGE_VERSION}`;
const PROGRESS_PREFIX = `library_progress_v${STORAGE_VERSION}`;
const MAX_SAVED_DOCUMENTS = 100;
const MAX_PROGRESS_ITEMS = 50;

function getSafeUserId(userId?: string | null): string {
  return userId ? userId.replace(/[^a-zA-Z0-9_-]/g, '_') : 'guest';
}

function getShelfKey(userId?: string | null): string {
  return `${SHELF_PREFIX}:${getSafeUserId(userId)}`;
}

function getProgressKey(userId?: string | null): string {
  return `${PROGRESS_PREFIX}:${getSafeUserId(userId)}`;
}

export const LibraryLocalStorage = {
  getSavedDocuments(userId?: string | null): SavedDocumentItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(getShelfKey(userId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.slice(0, MAX_SAVED_DOCUMENTS);
    } catch {
      return [];
    }
  },

  saveDocument(userId: string | null | undefined, item: SavedDocumentItem): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getSavedDocuments(userId);
      const filtered = existing.filter((d) => d.id !== item.id);
      const updated = [item, ...filtered].slice(0, MAX_SAVED_DOCUMENTS);
      localStorage.setItem(getShelfKey(userId), JSON.stringify(updated));
    } catch (e) {
      console.warn('Không thể lưu tài liệu vào kệ cục bộ:', e);
    }
  },

  removeSavedDocument(userId: string | null | undefined, documentId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getSavedDocuments(userId);
      const updated = existing.filter((d) => d.id !== documentId);
      localStorage.setItem(getShelfKey(userId), JSON.stringify(updated));
    } catch (e) {
      console.warn('Không thể xóa tài liệu khỏi kệ cục bộ:', e);
    }
  },

  isDocumentSaved(userId: string | null | undefined, documentId: string): boolean {
    if (typeof window === 'undefined') return false;
    const existing = this.getSavedDocuments(userId);
    return existing.some((d) => d.id === documentId);
  },

  clearSavedDocuments(userId?: string | null): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(getShelfKey(userId));
    } catch {
      // ignore
    }
  },

  getAllReadingProgress(userId?: string | null): ReadingProgressItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(getProgressKey(userId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.slice(0, MAX_PROGRESS_ITEMS);
    } catch {
      return [];
    }
  },

  getReadingProgress(userId: string | null | undefined, documentId: string): ReadingProgressItem | null {
    if (typeof window === 'undefined') return null;
    const all = this.getAllReadingProgress(userId);
    return all.find((p) => p.documentId === documentId) || null;
  },

  saveReadingProgress(
    userId: string | null | undefined,
    documentId: string,
    pageNumber: number,
    totalPdfPages?: number
  ): void {
    if (typeof window === 'undefined' || !documentId || pageNumber < 1) return;
    try {
      const all = this.getAllReadingProgress(userId);
      const filtered = all.filter((p) => p.documentId !== documentId);
      const item: ReadingProgressItem = {
        documentId,
        pageNumber,
        totalPdfPages,
        updatedAt: new Date().toISOString(),
      };
      const updated = [item, ...filtered].slice(0, MAX_PROGRESS_ITEMS);
      localStorage.setItem(getProgressKey(userId), JSON.stringify(updated));
    } catch (e) {
      console.warn('Không thể ghi nhớ tiến độ đọc:', e);
    }
  },

  clearAllForUser(userId?: string | null): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(getShelfKey(userId));
      localStorage.removeItem(getProgressKey(userId));
    } catch {
      // ignore
    }
  },
};
