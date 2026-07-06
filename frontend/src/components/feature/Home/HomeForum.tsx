'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ForumService } from '@/services/forum.service';
import type { ForumPost } from '@/types/forum';

export function HomeForum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await ForumService.getPosts();
        setPosts(res.slice(0, 3)); // top 3 posts
      } catch (error) {
        console.error('Failed to load forum posts', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <section className="relative py-24 bg-[#F8FAF7] dark:bg-slate-900 transition-colors duration-300 overflow-hidden z-10 border-t border-[rgba(22,163,74,0.08)] dark:border-slate-800">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            Diễn đàn học thuật
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            Một không gian để người học đặt câu hỏi, chia sẻ tài liệu, thảo luận môn học và phản biện ý tưởng nghiên cứu.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 shadow-sm animate-pulse transition-colors duration-300" />
            ))
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wide uppercase transition-colors duration-300">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-sm font-medium transition-colors duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    {post.commentsCount}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 leading-snug transition-colors duration-300">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3 transition-colors duration-300">
                  {post.content}
                </p>
                
                <Link href={`/forum/post/${post.id}`} className="w-full text-center py-3 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 font-medium hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-700 dark:hover:text-green-400 transition-colors mt-auto text-sm block">
                  Tham gia thảo luận
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
