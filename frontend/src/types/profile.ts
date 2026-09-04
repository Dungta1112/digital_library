export type ProfileTabKey = 'overview' | 'history' | 'contributions';

export interface ReadingHistoryItem {
  id: string;
  userId: string;
  documentId: string;
  createdAt: string;
  document?: {
    id: string;
    title: string;
    description?: string;
    coverImageUrl?: string;
    viewCount?: number;
    downloadCount?: number;
    createdAt?: string;
  };
}

export interface LecturerDocumentItem {
  id: string;
  title: string;
  description?: string;
  status: 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED' | 'DRAFT' | 'HIDDEN' | 'DELETED';
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  category?: {
    id: string;
    name: string;
  };
}

export type AvatarTheme = 'emerald' | 'navy' | 'amber' | 'violet';

export interface AvatarPreset {
  id: string;
  name: string;
  theme: AvatarTheme;
  themeLabel: string;
  url: string;
  alt: string;
  accentColor: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  avatarUrl?: string;
}
