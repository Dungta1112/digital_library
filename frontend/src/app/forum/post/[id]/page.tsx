'use client';

import React, { useState, useEffect, use } from 'react';
import { ForumService } from '@/services/forum.service';
import { ForumPost } from '@/types/forum';
import { CommentItem, CommentForm } from '@/components/feature/Forum/ForumComponents';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Chats, ChatCircleText } from '@phosphor-icons/react';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ForumService.getPostById(id).then(p => {
      if (!p) notFound();
      setPost(p);
      setLoading(false);
    });
  }, [id]);

  const handleAddComment = async (text: string) => {
    if (!post) return;
    const newComment = await ForumService.createComment(post.id, text);
    setPost({
      ...post,
      comments: [...(post.comments || []), newComment],
      commentsCount: post.commentsCount + 1
    });
  };

  if (loading || !post) {
    return <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 transition-colors duration-300"><div className="container mx-auto px-4 max-w-3xl animate-pulse h-[500px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 transition-colors duration-300"></div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/forum" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 mb-8 inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all active:scale-[0.98]">
          <ArrowLeft weight="bold" className="w-4 h-4" /> Quay lại diễn đàn
        </Link>
        
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm mb-12 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600 dark:bg-emerald-500"></div>
          
          <div className="flex justify-between items-start mb-6 pt-2">
            <span className="text-[11px] font-bold px-3.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full tracking-wider uppercase border border-emerald-100 dark:border-emerald-800/50 transition-colors duration-300">
              {post.category}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-300">
              {new Date(post.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight tracking-tight transition-colors duration-300">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shadow-sm border border-slate-200/80 dark:border-slate-700 transition-colors duration-300">
              <User weight="duotone" className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-white text-lg leading-tight transition-colors duration-300 tracking-tight">
                {post.authorName}
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors duration-300 mt-1">
                {post.authorRole}
              </span>
            </div>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 transition-colors duration-300">
            <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 transition-colors duration-300">
            {post.tags?.map(tag => (
              <span key={tag} className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors duration-300">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 transition-colors duration-300 tracking-tight">
            <Chats weight="duotone" className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            Thảo luận 
            <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/50 transition-colors duration-300 font-bold">
              {post.commentsCount}
            </span>
          </h3>
          
          <div className="space-y-4">
            {post.comments?.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
            {(!post.comments || post.comments.length === 0) && (
              <div className="flex flex-col items-center justify-center text-center py-16 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4 shadow-inner">
                  <ChatCircleText weight="duotone" className="w-8 h-8" />
                </div>
                <p className="font-medium text-slate-600 dark:text-slate-400">Chưa có bình luận nào. Hãy là người đầu tiên tham gia thảo luận!</p>
              </div>
            )}
          </div>
          
          <CommentForm onSubmit={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
