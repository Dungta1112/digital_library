'use client';

import React, { useState } from 'react';
import { ForumPost, ForumComment } from '@/types/forum';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';
import { User, Heart, ChatCircle, Trash } from '@phosphor-icons/react';

export function PostCard({ post }: { post: ForumPost }) {
  return (
    <Link href={`/forum/post/${post.id}`} className="block mb-6 group">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer relative overflow-hidden">
        {/* Subtle accent glow on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex justify-between items-start mb-5 relative z-10">
          <span className="text-[11px] font-bold tracking-wider uppercase px-3.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800/50 transition-colors duration-300">
            {post.category}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
            {new Date(post.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors tracking-tight">
          {post.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 text-sm leading-relaxed transition-colors duration-300 relative z-10">
          {post.content}
        </p>
        
        <div className="flex items-center justify-between text-sm pt-5 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300 relative z-10">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 transition-colors duration-300">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center transition-colors duration-300">
              <User weight="duotone" className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 dark:text-slate-200 text-xs transition-colors duration-300 leading-tight">
                {post.authorName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
                {post.authorRole}
              </span>
            </div>
          </div>
          
          <div className="flex gap-4 text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
            <span className="flex items-center gap-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <Heart weight="duotone" className="w-4 h-4" /> {post.likes}
            </span>
            <span className="flex items-center gap-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <ChatCircle weight="duotone" className="w-4 h-4" /> {post.commentsCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CommentItem({ comment }: { comment: ForumComment }) {
  const { can } = usePermissions();
  
  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 mb-4 shadow-sm hover:shadow-md transition-all relative">
      {can('MODERATE_FORUM') && (
        <div className="absolute top-4 right-4">
           <button className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors active:scale-95">
             <Trash weight="bold" className="w-3 h-3" /> Xóa
           </button>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm font-bold transition-colors duration-300 shadow-sm">
            {comment.authorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-slate-900 dark:text-white transition-colors duration-300 tracking-tight">
                {comment.authorName}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider transition-colors duration-300 ${
                comment.authorRole === 'LECTURER' || comment.authorRole === 'FACULTY' 
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {comment.authorRole === 'LECTURER' ? 'Giảng viên' : comment.authorRole}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
              {new Date(comment.createdAt).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
        
        {!can('MODERATE_FORUM') && (
          <button className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-semibold p-1">
            <Heart weight="duotone" className="w-5 h-5" /> {comment.likes}
          </button>
        )}
      </div>
      
      <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base whitespace-pre-wrap mt-2 leading-relaxed transition-colors duration-300 pl-14">
        {comment.content}
      </p>
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
      <div className="mt-8 bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center transition-colors duration-300">
        <p className="text-slate-600 dark:text-slate-400 mb-5 font-medium transition-colors duration-300">Vui lòng đăng nhập để tham gia thảo luận cùng cộng đồng.</p>
        <Link href="/login">
          <Button variant="secondary" className="font-semibold px-8 h-11 rounded-xl shadow-sm border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
            Đăng nhập
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-slate-50/50 dark:bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <h4 className="font-bold text-slate-900 dark:text-white mb-5 text-lg transition-colors duration-300 flex items-center gap-2">
        <ChatCircle weight="duotone" className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
        Thảo luận
      </h4>
      <textarea
        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white p-5 text-base focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[140px] mb-6 shadow-sm transition-all duration-300 outline-none resize-y"
        placeholder="Chia sẻ quan điểm của bạn..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={loading || !text.trim()} 
          className="px-8 h-12 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-sm active:scale-[0.98] transition-all"
        >
          {loading ? 'Đang gửi...' : 'Gửi thảo luận'}
        </Button>
      </div>
    </div>
  );
}
