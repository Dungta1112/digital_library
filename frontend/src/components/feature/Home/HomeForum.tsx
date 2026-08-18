'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ForumService } from '@/services/forum.service';
import type { ForumPost } from '@/types/forum';
import {
  Chats,
  ThumbsUp,
  ChatCircleText,
  GraduationCap,
  ArrowRight,
  Sparkle,
} from '@phosphor-icons/react';

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return 'Gần đây';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  } catch {
    return 'Gần đây';
  }
}

export function HomeForum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForumPosts() {
      try {
        const data = await ForumService.getPosts();
        if (data && data.length > 0) {
          setPosts(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Lỗi khi tải bài đăng diễn đàn:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchForumPosts();
  }, []);

  return (
    <section className="relative bg-slate-900 py-20 lg:py-28 text-white border-t border-slate-800 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">
              <Sparkle weight="fill" className="h-3.5 w-3.5" />
              CỘNG ĐỒNG HỌC THUẬT SÔI NỔI
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Thảo Luận Học Thuật Tiêu Biểu
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Nơi sinh viên Trường Đại học Trưng Vương trao đổi bài tập, phản biện học thuật và nhận giải đáp từ Giảng viên.
            </p>
          </div>

          <Link
            href="/forum"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 hover:bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5 active:scale-98"
          >
            <Chats weight="bold" className="h-4 w-4" />
            Vào Diễn đàn trao đổi
            <ArrowRight weight="bold" className="h-4 w-4" />
          </Link>
        </div>

        {/* Real Posts List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 rounded-3xl bg-slate-950/60 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-12 text-center">
            <p className="text-slate-400 text-sm mb-4">Chưa có bài thảo luận nào được tạo.</p>
            <Link
              href="/forum"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white"
            >
              Tạo chủ đề thảo luận đầu tiên
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((topic, idx) => {
              const hasLecturerReply = topic.comments?.some(
                (c) => c.authorRole === 'LECTURER' || c.authorRole === 'ADMIN'
              );
              const lecturerComment = topic.comments?.find(
                (c) => c.authorRole === 'LECTURER' || c.authorRole === 'ADMIN'
              );

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-7 shadow-xl transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-950 hover:shadow-2xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Content */}
                    <div className="flex-1">
                      {/* Category & Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="rounded-full bg-blue-950/80 px-3 py-1 text-[11px] font-bold text-blue-400 border border-blue-800/50">
                          {topic.category || 'Học thuật'}
                        </span>
                        {topic.tags && topic.tags.length > 0 && (
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-300">
                            #{topic.tags[0]}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          {formatRelativeTime(topic.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/forum/post/${topic.id}`} className="block">
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug mb-3">
                          {topic.title}
                        </h3>
                      </Link>

                      {/* Lecturer verification banner or author info */}
                      {hasLecturerReply && lecturerComment ? (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 px-3.5 py-2 text-xs text-emerald-300">
                          <GraduationCap weight="fill" className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span className="font-semibold">
                            {lecturerComment.authorName}: &ldquo;{lecturerComment.content.slice(0, 100)}...&rdquo;
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">
                          Đăng bởi: <span className="font-semibold text-slate-300">{topic.authorName}</span> ({topic.authorRole})
                        </p>
                      )}
                    </div>

                    {/* Right: Voting & Comments Count */}
                    <div className="flex items-center gap-4 lg:self-center shrink-0 border-t lg:border-t-0 border-slate-800/80 pt-4 lg:pt-0">
                      <div className="flex items-center gap-1.5 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-300">
                        <ThumbsUp weight="fill" className="h-4 w-4 text-blue-400" />
                        <span>{topic.likes || 0} bình chọn</span>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-300">
                        <ChatCircleText weight="fill" className="h-4 w-4 text-emerald-400" />
                        <span>{topic.commentsCount || topic.comments?.length || 0} phản hồi</span>
                      </div>

                      <Link
                        href={`/forum/post/${topic.id}`}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                        title="Xem chi tiết thảo luận"
                      >
                        <ArrowRight weight="bold" className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
