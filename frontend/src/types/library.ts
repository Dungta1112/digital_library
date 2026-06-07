export interface Document {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationYear: number;
  category: string;
  keywords: string[];
  pdfUrl: string;
  coverImageUrl?: string;
  viewCount: number;
  saveCount: number;
}

export interface LibraryFilter {
  query?: string;
  category?: string;
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
