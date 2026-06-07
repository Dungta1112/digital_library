'use client';

import React, { useState } from 'react';
import { ForumPost, ForumComment } from '@/types/forum';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';

export function PostCard({ post }: { post: ForumPost }) {
  return (
    <Link href={`/forum/post/${post.id}`}>
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer mb-6 group">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">{post.category}</span>
          <span className="text-xs text-gray-500 font-medium">{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug hover:text-green-700 transition-colors">{post.title}</h3>
        <p className="text-gray-600 line-clamp-2 mb-4 text-sm leading-relaxed">{post.content}</p>
        <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs">👤</div>
            <span className="font-semibold text-gray-800">{post.authorName}</span>
            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">{post.authorRole}</span>
          </div>
          <div className="flex gap-5 text-gray-500 font-medium">
            <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">❤️ {post.likes}</span>
            <span className="flex items-center gap-1.5">💬 {post.commentsCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CommentItem({ comment }: { comment: ForumComment }) {
  const { can } = usePermissions();
  
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 mb-4 shadow-sm hover:shadow-md transition-shadow relative">
      {can('MODERATE_FORUM') && (
        <div className="absolute top-4 right-4">
           <button className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors">Xóa bình luận</button>
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
            {comment.authorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-gray-900">{comment.authorName}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                comment.authorRole === 'LECTURER' || comment.authorRole === 'FACULTY' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {comment.authorRole === 'LECTURER' ? 'Giảng viên' : comment.authorRole}
              </span>
            </div>
            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
        </div>
        {!can('MODERATE_FORUM') && (
          <button className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">❤️ {comment.likes}</button>
        )}
      </div>
      <p className="text-gray-700 text-[15px] whitespace-pre-wrap mt-2 leading-relaxed">{comment.content}</p>
    </div>
  );
}

export function CommentForm({ onSubmit }: { onSubmit: (text: string) => Promise<void> }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { can } = usePermissions();

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    await onSubmit(text);
    setText('');
    setLoading(false);
  };

  if (!can('COMMENT_FORUM')) {
    return (
      <div className="mt-8 bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm text-center">
        <p className="text-gray-600 mb-4">Vui lòng đăng nhập để tham gia bình luận.</p>
        <Link href="/login">
          <Button variant="secondary" className="font-semibold">Đăng nhập</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
      <h4 className="font-bold text-gray-900 mb-4 text-lg">Thêm bình luận</h4>
      <textarea
        className="w-full rounded-2xl border border-gray-300 p-5 text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[120px] mb-6 shadow-inner transition-colors"
        placeholder="Chia sẻ suy nghĩ của bạn..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading || !text.trim()} className="px-6 h-11">
          {loading ? 'Đang đăng...' : 'Đăng bình luận'}
        </Button>
      </div>
    </div>
  );
}
