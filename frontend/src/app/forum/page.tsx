'use client';
import React, { useState, useEffect } from 'react';
import { ForumService } from '@/services/forum.service';
import { ForumPost } from '@/types/forum';
import { PostCard } from '@/components/feature/Forum/ForumComponents';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { can } = usePermissions();

  useEffect(() => {
    ForumService.getPosts().then(p => {
      setPosts(p);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">Diễn đàn Học thuật</h1>
            <p className="text-xl text-gray-600 font-light tracking-tight leading-relaxed">Trao đổi nghiên cứu, đặt câu hỏi và cộng tác cùng bạn học.</p>
          </div>
          {can('POST_FORUM') && (
            <Button className="h-12 px-6 shadow-md font-semibold shrink-0">
              <span className="mr-2">✍️</span> Bài viết mới
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-gray-100 shadow-sm"></div>)}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
}
