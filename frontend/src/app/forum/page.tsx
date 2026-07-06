'use client';
import React, { useState, useEffect } from 'react';
import { ForumService } from '@/services/forum.service';
import { ForumPost } from '@/types/forum';
import { PostCard } from '@/components/feature/Forum/ForumComponents';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';
import { PencilSimple, X } from '@phosphor-icons/react';

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { can } = usePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    ForumService.getPosts().then(p => {
      setPosts(p);
      setLoading(false);
    });
  }, []);

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSubmitting(true);
    try {
      const newPost = await ForumService.createPost(newTitle, newContent);
      setPosts([newPost, ...posts]);
      setIsModalOpen(false);
      setNewTitle('');
      setNewContent('');
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi đăng bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors duration-300">Diễn đàn Học thuật</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light tracking-tight leading-relaxed transition-colors duration-300">Trao đổi nghiên cứu, đặt câu hỏi và cộng tác cùng bạn học.</p>
          </div>
          {can('POST_FORUM') && (
            <Button onClick={() => setIsModalOpen(true)} className="h-12 px-6 shadow-sm font-semibold shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl active:scale-[0.98] transition-all flex items-center gap-2">
              <PencilSimple weight="bold" className="w-5 h-5" /> Bài viết mới
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300"></div>)}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Tạo bài viết mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                 <X weight="bold" className="w-5 h-5" />
              </button>
            </div>
            
            <input 
              type="text" 
              placeholder="Tiêu đề bài viết" 
              className="w-full mb-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea 
              placeholder="Nội dung chi tiết..." 
              className="w-full mb-6 min-h-[200px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm resize-y"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="rounded-xl font-medium">Hủy</Button>
              <Button disabled={isSubmitting || !newTitle.trim() || !newContent.trim()} onClick={handleCreatePost} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium active:scale-[0.98] transition-all">
                {isSubmitting ? 'Đang đăng...' : 'Đăng bài viết'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
