'use client';

import React, { useState, useEffect, use } from 'react';
import { ForumService } from '@/services/forum.service';
import { ForumPost } from '@/types/forum';
import { CommentItem, CommentForm } from '@/components/feature/Forum/ForumComponents';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 transition-colors duration-300"><div className="container mx-auto px-4 max-w-3xl animate-pulse h-[500px] bg-gray-200 dark:bg-slate-800 rounded-2xl transition-colors duration-300"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/forum" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-8 inline-flex items-center bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          ← Back to Forum
        </Link>
        
        <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm mb-10 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-green-400"></div>
          <div className="flex justify-between items-start mb-6 pt-2">
            <span className="text-sm font-bold px-3 py-1.5 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 rounded-lg tracking-wide transition-colors duration-300">{post.category}</span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight transition-colors duration-300">{post.title}</h1>
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-gray-200 dark:border-slate-700 transition-colors duration-300">👤</div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg transition-colors duration-300">
                {post.authorName}
                <span className="text-[11px] bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 uppercase tracking-widest transition-colors duration-300">{post.authorRole}</span>
              </div>
            </div>
          </div>
          <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-300 transition-colors duration-300">
            <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex gap-2 transition-colors duration-300">
            {post.tags?.map(tag => (
              <span key={tag} className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md transition-colors duration-300">#{tag}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-3 transition-colors duration-300">
            💬 Discussion 
            <span className="bg-green-100 dark:bg-slate-800 text-green-800 dark:text-green-400 text-sm px-3 py-0.5 rounded-full transition-colors duration-300">{post.commentsCount} comments</span>
          </h3>
          
          <div className="space-y-4">
            {post.comments?.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
            {(!post.comments || post.comments.length === 0) && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 border-dashed transition-colors duration-300">
                <span className="text-4xl mb-3 block">💭</span>
                <p className="font-medium">No comments yet. Be the first to start the discussion!</p>
              </div>
            )}
          </div>
          
          <CommentForm onSubmit={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
