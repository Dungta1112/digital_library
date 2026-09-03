export interface Document {
  id: string;
  title: string;
  authors?: string[];
  ownerName?: string;
  abstract: string;
  description?: string;
  publicationYear?: number;
  category: string;
  categoryId?: string;
  keywords: string[];
  pdfUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'docx';
  mimeType?: string;
  fileSize?: number;
  coverImageUrl?: string;
  viewCount: number;
  saveCount?: number;
  downloadCount?: number;
  createdAt?: string;
}

export interface LibraryFilter {
  query?: string;
  category?: string;
  categoryId?: string;
  year?: number;
  author?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type LibraryViewMode = 'grid' | 'list';

export interface LibraryQueryState {
  draftQuery: string;
  query: string;
  categoryId: string;
  page: number;
  view: LibraryViewMode;
  scope: 'all' | 'saved';
}

export interface SavedDocumentItem {
  id: string;
  title: string;
  authors?: string[];
  category: string;
  fileType?: 'pdf' | 'docx';
  coverImageUrl?: string;
  savedAt: string;
}

export interface ReadingProgressItem {
  documentId: string;
  pageNumber: number;
  totalPdfPages?: number;
  updatedAt: string;
}
