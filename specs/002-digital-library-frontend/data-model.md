# Frontend Data Model

This document defines the TypeScript interfaces that will be used across the frontend application.

```typescript
export type Role = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  savedDocumentIds: string[];
  joinedGroupIds: string[];
}

export interface DocumentStats {
  views: number;
  downloads: number;
  saves: number;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  discipline: string;
  type: 'pdf' | 'epub' | 'video';
  publishYear: number;
  coverImageUrl?: string;
  fileUrl: string;
  stats: DocumentStats;
}

export interface ForumPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string; // ISO Date
  tags: string[];
  commentCount: number;
  upvotes: number;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  memberCount: number;
  creatorId: string;
  isPublic: boolean;
}

export interface AICitation {
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  snippet: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  citations?: AICitation[];
  timestamp: string;
}
```
