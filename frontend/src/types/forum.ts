export interface ForumComment {
  id: string;
  postId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  likes: number;
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
  comments?: ForumComment[];
}
