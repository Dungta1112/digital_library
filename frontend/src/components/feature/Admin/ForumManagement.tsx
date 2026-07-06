'use client';
import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin.service';
import { AdminForumPost } from '@/types/admin';
import { Button } from '@/components/ui/Button';

export function ForumManagement() {
  const [posts, setPosts] = useState<AdminForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getForumPosts();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleModerate = async (postId: string, action: 'DELETE' | 'LOCK') => {
    if (confirm(`Bạn có chắc muốn ${action === 'DELETE' ? 'XÓA' : 'KHÓA'} bài viết này?`)) {
      await AdminService.moderatePost(postId, action);
      alert(`Mock: Đã ${action === 'DELETE' ? 'xóa' : 'khóa'} bài viết.`);
      fetchPosts();
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50 transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Quản lý diễn đàn</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Kiểm duyệt các bài viết vi phạm</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
          <thead className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 text-gray-900 dark:text-gray-200 font-bold uppercase text-xs tracking-wider transition-colors duration-300">
            <tr>
              <th className="px-6 py-5">Tiêu đề bài viết</th>
              <th className="px-6 py-5">Nội dung tóm tắt</th>
              <th className="px-6 py-5">Tác giả</th>
              <th className="px-6 py-5 text-center">Số lượt Report</th>
              <th className="px-6 py-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors duration-300">
            {posts.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">Không có bài viết nào cần kiểm duyệt.</td></tr>
            ) : posts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white transition-colors duration-300">{post.title}</td>
                <td className="px-6 py-4 italic truncate max-w-xs">{post.contentSnippet}</td>
                <td className="px-6 py-4">{post.authorName}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${post.reportsCount > 5 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {post.reportsCount}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="font-semibold text-orange-600 hover:bg-orange-50"
                    onClick={() => handleModerate(post.id, 'LOCK')}
                  >
                    Khóa chủ đề
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="font-semibold text-red-600 hover:bg-red-50"
                    onClick={() => handleModerate(post.id, 'DELETE')}
                  >
                    Xóa bài viết
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
