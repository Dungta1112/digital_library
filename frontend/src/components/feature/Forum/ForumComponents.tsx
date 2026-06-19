'use client';

import React, { useState } from 'react';
import { ForumPost, ForumComment } from '@/types/forum';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';

export function PostCard({ post }: { post: ForumPost }) {
  return (
    <Link href={`/forum/post/${post.id}`}>
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer mb-6 group">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 rounded-full transition-colors duration-300">{post.category}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-snug hover:text-green-700 dark:hover:text-green-400 transition-colors">{post.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 text-sm leading-relaxed transition-colors duration-300">{post.content}</p>
        <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
            <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-xs transition-colors duration-300">👤</div>
            <span className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">{post.authorName}</span>
            <span className="text-[10px] bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 font-bold transition-colors duration-300">{post.authorRole}</span>
          </div>
          <div className="flex gap-5 text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
            <span className="flex items-center gap-1.5 hover:text-red-500 dark:hover:text-red-400 transition-colors">❤️ {post.likes}</span>
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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 mb-4 shadow-sm hover:shadow-md transition-shadow relative">
      {can('MODERATE_FORUM') && (
        <div className="absolute top-4 right-4">
           <button className="text-xs font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">Xóa bình luận</button>
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-slate-800 text-green-700 dark:text-green-400 flex items-center justify-center text-sm font-bold transition-colors duration-300">
            {comment.authorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{comment.authorName}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase transition-colors duration-300 ${
                comment.authorRole === 'LECTURER' || comment.authorRole === 'FACULTY' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
              }`}>
                {comment.authorRole === 'LECTURER' ? 'Giảng viên' : comment.authorRole}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
        </div>
        {!can('MODERATE_FORUM') && (
          <button className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-medium">❤️ {comment.likes}</button>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-[15px] whitespace-pre-wrap mt-2 leading-relaxed transition-colors duration-300">{comment.content}</p>
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
      <div className="mt-8 bg-gray-50/50 dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm text-center transition-colors duration-300">
        <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">Vui lòng đăng nhập để tham gia bình luận.</p>
        <Link href="/login">
          <Button variant="secondary" className="font-semibold">Đăng nhập</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gray-50/50 dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg transition-colors duration-300">Thêm bình luận</h4>
      <textarea
        className="w-full rounded-2xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white p-5 text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[120px] mb-6 shadow-inner transition-colors duration-300"
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
