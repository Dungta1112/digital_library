export type ForumCategory = 'GENERAL' | 'QUESTIONS' | 'RESOURCES' | 'ANNOUNCEMENTS';

export interface ForumComment {
  id: string;
  postId: string;
  authorId?: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt?: string;
  likes: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  authorName: string;
  authorRole: string;
  category: ForumCategory;
  tags: string[];
  createdAt?: string;
  likes: number;
  commentsCount: number;
  comments?: ForumComment[];
}
