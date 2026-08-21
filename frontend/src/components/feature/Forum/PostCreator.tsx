'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Image, 
  Paperclip, 
  Globe, 
  Users, 
  Lock, 
  Trash 
} from '@phosphor-icons/react';
import { useForumStore } from '@/hooks/useForumStore';
import { usePermissions } from '@/hooks/usePermissions';
import { AnimatePresence, motion } from 'framer-motion';

export function PostCreator() {
  const { createPost, drafts, saveDraft, clearDraft, loadDraft } = useForumStore();
  const { can } = usePermissions();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [visibility, setVisibility] = useState<'public' | 'group' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<{ id: string; file: File; url: string; type: string }[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Sync state with store draft if store draft changes (on load)
  useEffect(() => {
    if (drafts.title && !title) setTitle(drafts.title);
    if (drafts.content && !content) setContent(drafts.content);
  }, [drafts]);

  // Debounced auto-save draft to local storage
  useEffect(() => {
    if (title || content) {
      const timer = setTimeout(() => {
        saveDraft(title, content);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, content]);

  const handleOpen = () => {
    loadDraft();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'file'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(f => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      // Create post via store
      const result = await createPost(title, content, category);
      if (result) {
        // Clear files
        files.forEach(f => URL.revokeObjectURL(f.url));
        setFiles([]);
        setTitle('');
        setContent('');
        setIsOpen(false);
      }
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi tạo bài viết');
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
          <Image size={22} weight="duotone" />
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
                  {/* Visibility selector */}
                  <div className="relative">
                    <select 
                      value={visibility} 
                      onChange={e => setVisibility(e.target.value as any)}
                      className="appearance-none bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 py-1.5 pl-8 pr-6 rounded-full border border-slate-200/50 dark:border-slate-700/50 outline-none cursor-pointer"
                    >
                      <option value="public">Công khai</option>
                      <option value="group">Nhóm học tập</option>
                      <option value="private">Chỉ mình tôi</option>
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      {visibility === 'public' && <Globe size={13} weight="bold" />}
                      {visibility === 'group' && <Users size={13} weight="bold" />}
                      {visibility === 'private' && <Lock size={13} weight="bold" />}
                    </div>
                  </div>

                  {/* Category Selector */}
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
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
                <input 
                  type="text" 
                  placeholder="Tiêu đề thảo luận hoặc câu hỏi..." 
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                
                <textarea 
                  placeholder="Viết nội dung thảo luận ở đây. Bạn có thể kéo thả tài liệu hoặc ảnh vào trình soạn thảo..." 
                  className="w-full min-h-[160px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-y leading-relaxed text-sm"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />

                {/* Media Attachment Grid Preview */}
                {files.length > 0 && (
                  <div className={`grid gap-2 mb-4 ${
                    files.length === 1 ? 'grid-cols-1' : 
                    files.length === 2 ? 'grid-cols-2' : 
                    files.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
                  }`}>
                    {files.map(f => (
                      <div 
                        key={f.id} 
                        className="relative rounded-2xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden group aspect-video bg-slate-50 dark:bg-slate-950"
                      >
                        {f.type === 'image' ? (
                          <img src={f.url} alt="upload" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                            <Paperclip size={32} weight="duotone" className="text-slate-400 mb-1" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-full">
                              {f.file.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {(f.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        )}
                        <button 
                          onClick={() => removeFile(f.id)}
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-sm"
                        >
                          <Trash size={14} weight="bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Tools & Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1.5">
                  <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*,application/pdf,.doc,.docx"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1.5"
                    title="Đính kèm ảnh"
                  >
                    <Image size={20} weight="bold" className="text-emerald-600" />
                    <span className="text-xs font-bold hidden sm:inline text-slate-600 dark:text-slate-300">Ảnh/Video</span>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1.5"
                    title="Đính kèm tài liệu"
                  >
                    <Paperclip size={20} weight="bold" className="text-blue-500" />
                    <span className="text-xs font-bold hidden sm:inline text-slate-600 dark:text-slate-300">Tài liệu</span>
                  </button>
                </div>

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
