export interface ForumAttachment {
  id: string;
  type: 'image';
  url: string;
  name: string;
  size: number;
  alt?: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  likes: number;
  attachments?: ForumAttachment[];
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  category: string;
  tags: string[];
  createdAt: string;
  likes: number;
  commentsCount: number;
  views?: number;
  attachments?: ForumAttachment[];
  comments?: ForumComment[];
}

export interface CreatePostInput {
  title: string;
  content: string;
  category: string;
  tags: string[];
  attachments?: ForumAttachment[];
}

export interface CreateCommentInput {
  content: string;
  attachments?: ForumAttachment[];
}
