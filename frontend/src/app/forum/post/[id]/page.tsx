'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ChatCircleText,
  Chats,
  Eye,
  Heart,
  User,
} from '@phosphor-icons/react';
import {
  CommentForm,
  CommentItem,
  ImageGallery,
} from '@/components/feature/Forum/ForumComponents';
import { ForumService } from '@/services/forum.service';
import type { CreateCommentInput, ForumPost } from '@/types/forum';

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    STUDENT: 'Sinh viên',
    LECTURER: 'Giảng viên',
    FACULTY: 'Giảng viên',
    ADMIN: 'Quản trị',
  };
  return labels[role] || role;
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    ForumService.getPostById(id).then((data) => {
      if (!mounted) return;
      if (!data) notFound();
      setPost(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleAddComment = async (input: CreateCommentInput) => {
    if (!post) return;
    const newComment = await ForumService.createComment(post.id, input);
    setPost({
      ...post,
      comments: [...(post.comments || []), newComment],
      commentsCount: post.commentsCount + 1,
    });
  };

  if (loading || !post) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 dark:bg-slate-950">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="h-[520px] animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 dark:bg-slate-950">
      <div className="container mx-auto max-w-4xl px-4">
        <Link
          href="/forum"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-emerald-300"
        >
          <ArrowLeft weight="bold" className="h-4 w-4" />
          Quay lại diễn đàn
        </Link>

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-6 dark:border-slate-800 md:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/20 dark:text-emerald-300">
                {post.category}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white md:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <User weight="duotone" className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">
                    {post.authorName}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {roleLabel(post.authorRole)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Heart weight="duotone" className="h-4 w-4" />
                  {post.likes}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Chats weight="duotone" className="h-4 w-4" />
                  {post.commentsCount}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye weight="duotone" className="h-4 w-4" />
                  {post.views || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <p className="whitespace-pre-wrap text-base leading-8 text-slate-700 dark:text-slate-300">
              {post.content}
            </p>

            <ImageGallery attachments={post.attachments} />

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        <section className="mt-8">
          <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-slate-950 dark:text-white">
            <Chats weight="duotone" className="h-6 w-6 text-emerald-600" />
            Thảo luận
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
              {post.commentsCount}
            </span>
          </h2>

          <div className="space-y-4">
            {post.comments?.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
            {(!post.comments || post.comments.length === 0) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  <ChatCircleText weight="duotone" className="h-7 w-7" />
                </div>
                <p className="font-medium text-slate-600 dark:text-slate-400">
                  Chưa có bình luận nào. Hãy là người đầu tiên tham gia thảo
                  luận.
                </p>
              </div>
            )}
          </div>

          <CommentForm onSubmit={handleAddComment} />
        </section>
      </div>
    </div>
  );
}
