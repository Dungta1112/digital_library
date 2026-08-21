'use client';

import React, { useEffect, useState } from 'react';
import { useForumStore } from '@/hooks/useForumStore';
import { SidebarLeft } from '@/components/feature/Forum/SidebarLeft';
import { SidebarRight } from '@/components/feature/Forum/SidebarRight';
import { PostCreator } from '@/components/feature/Forum/PostCreator';
import { PostCard } from '@/components/feature/Forum/PostCard';
import { 
  PencilSimple, 
  Funnel, 
  ArrowClockwise 
} from '@phosphor-icons/react';

export default function ForumPage() {
  const { posts, loading, fetchPosts, error } = useForumStore();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { code: 'All', label: 'Tất cả' },
    { code: 'GENERAL', label: 'Chung' },
    { code: 'QUESTIONS', label: 'Hỏi đáp' },
    { code: 'RESOURCES', label: 'Tài liệu' }
  ];

  // Fetch posts on mount & category change
  useEffect(() => {
    fetchPosts(activeCategory === 'All' ? undefined : activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/40 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Banner Section */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight transition-colors duration-300">
            Diễn đàn Học thuật
          </h1>
          <p className="text-xs md:text-sm text-slate-550 dark:text-slate-400 font-light tracking-tight leading-relaxed transition-colors duration-300">
            Trao đổi nghiên cứu, thảo luận học tập và kết nối cộng đồng học thuật số.
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8 overflow-x-auto pb-2 select-none shrink-0 scrollbar-none">
          <div className="flex items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.code}
                onClick={() => setActiveCategory(cat.code)}
                className={`text-xs font-bold px-4 py-2 rounded-full border transition-all active:scale-[0.97] outline-none cursor-pointer ${
                  activeCategory === cat.code
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white border-transparent shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => fetchPosts(activeCategory === 'All' ? undefined : activeCategory)}
            className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors shrink-0 active:rotate-180 duration-500"
            title="Làm mới bảng tin"
          >
            <ArrowClockwise size={16} weight="bold" />
          </button>
        </div>

        {/* Grid Layout 3-Column */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Navigation Sidebar */}
          <SidebarLeft />

          {/* Center Main Feed Area */}
          <main className="flex-grow w-full max-w-full lg:max-w-[640px] space-y-6">
            
            {/* Post Creator Section */}
            <PostCreator />

            {/* Error fallback alert */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/30 text-xs font-semibold text-red-650 dark:text-red-400 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => fetchPosts(activeCategory === 'All' ? undefined : activeCategory)} className="underline">Thử lại</button>
              </div>
            )}

            {/* Feed Cards List */}
            <div className="space-y-6">
              {loading ? (
                // skeleton loaders
                [1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/85 dark:border-slate-800 animate-pulse space-y-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </div>
                    </div>
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-8 w-full bg-slate-50 dark:bg-slate-850/50 rounded-xl"></div>
                  </div>
                ))
              ) : (
                <>
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}

                  {posts.length === 0 && !error && (
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[32px] border border-slate-200/80 dark:border-slate-800 text-center shadow-sm select-none">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-500 mx-auto mb-4">
                        <Funnel size={30} weight="duotone" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Không có bài viết</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Chưa có bài thảo luận nào thuộc danh mục này. Hãy là người đầu tiên chia sẻ thảo luận!
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>

          {/* Right Info Widget Sidebar */}
          <SidebarRight />

        </div>
      </div>
    </div>
  );
}
