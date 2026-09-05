'use client';

import React, { useState, useEffect } from 'react';
import { X, ChatCircleText } from '@phosphor-icons/react';
import { useForumStore } from '@/hooks/useForumStore';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';
import type { ForumCategory } from '@/types/forum';
import { AnimatePresence, motion } from 'framer-motion';

export function PostCreator() {
  const { createPost, drafts, saveDraft, loadDraft, clearDraft, error } = useForumStore();
  const { can } = usePermissions();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(() => drafts.title || '');
  const [content, setContent] = useState(() => drafts.content || '');
  const [category, setCategory] = useState<ForumCategory>('GENERAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load draft on mount
  useEffect(() => {
    if (user) loadDraft(user.id);
  }, [loadDraft, user]);

  // Debounced auto-save draft to local storage
  useEffect(() => {
    if (title || content) {
      const timer = setTimeout(() => {
        if (user) saveDraft(user.id, title, content);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, content, saveDraft, user]);

  const handleOpen = () => {
    if (!user) return;
    loadDraft(user.id);
    const currentDrafts = useForumStore.getState().drafts;
    if (currentDrafts.title && !title) setTitle(currentDrafts.title);
    if (currentDrafts.content && !content) setContent(currentDrafts.content);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      // Create post via store
      const result = await createPost(title, content, category);
      if (result) {
        clearDraft(user!.id);
        setTitle('');
        setContent('');
        setIsOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!can('POST_FORUM')) return null;

  return (
    <div className="mb-6">
      {/* Inline composer triggers modal */}
      <div 
        onClick={handleOpen}
        className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all select-none"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-800 dark:text-emerald-300 shadow-inner">
          U
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all text-slate-500 dark:text-slate-400 text-sm py-3 px-5 rounded-full flex-grow text-left font-medium">
          Bạn đang muốn chia sẻ tài liệu hay thảo luận điều gì?
        </div>
        <div className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400">
          <ChatCircleText size={22} weight="duotone" />
        </div>
      </div>

      {/* Full Composer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-2xl p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Tạo thảo luận mới
                </h2>
                <button 
                  onClick={handleClose} 
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X weight="bold" className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content - Scrollable if large */}
              <div className="flex-grow overflow-y-auto space-y-4 pr-1">
                {/* Meta Options */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Selector */}
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value as ForumCategory)}
                    aria-label="Danh mục bài viết"
                    className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 py-1.5 px-4 rounded-full border border-emerald-100 dark:border-emerald-900/30 outline-none cursor-pointer"
                  >
                    <option value="GENERAL">Chung</option>
                    <option value="QUESTIONS">Hỏi đáp</option>
                    <option value="RESOURCES">Tài liệu</option>
                    <option value="ANNOUNCEMENTS">Thông báo</option>
                  </select>

                  {/* Draft Notification Badge */}
                  {(drafts.title || drafts.content) && (
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 py-1 px-2.5 rounded-full border border-slate-200/40 dark:border-slate-800">
                      Đã tự lưu nháp
                    </span>
                  )}
                </div>

                {/* Text Inputs */}
                <label htmlFor="feed-post-title" className="sr-only">Tiêu đề bài viết</label>
                <input 
                  id="feed-post-title"
                  type="text" 
                  placeholder="Tiêu đề thảo luận hoặc câu hỏi..." 
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={255}
                />

                <label htmlFor="feed-post-content" className="sr-only">Nội dung bài viết</label>
                <textarea 
                  id="feed-post-content"
                  placeholder="Viết nội dung thảo luận ở đây..." 
                  className="w-full min-h-[160px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-y leading-relaxed text-sm"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
                {error && (
                  <p role="alert" className="text-xs font-semibold text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>

              {/* Upload Tools & Footer */}
              <div className="flex items-center justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleClose} 
                    className="px-6 py-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    disabled={isSubmitting || !title.trim() || !content.trim()} 
                    onClick={handleSubmit} 
                    className="px-7 py-2.5 bg-slate-900 dark:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-full text-sm font-bold active:scale-[0.98] transition-all shadow-sm"
                  >
                    {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
