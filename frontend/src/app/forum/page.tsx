'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from 'react';
import {
  MagnifyingGlass,
  PencilSimple,
  Sparkle,
  TrendUp,
  X,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import {
  AttachmentPicker,
  EmptyForumState,
  PostCard,
} from '@/components/feature/Forum/ForumComponents';
import { usePermissions } from '@/hooks/usePermissions';
import { ForumService } from '@/services/forum.service';
import type { ForumAttachment, ForumPost } from '@/types/forum';

const CATEGORIES = [
  'Tất cả',
  'Hỏi đáp học tập',
  'Tài liệu',
  'Đồ án',
  'Thông báo',
];

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const { can } = usePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Hỏi đáp học tập');
  const [newTags, setNewTags] = useState('');
  const [attachments, setAttachments] = useState<ForumAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    ForumService.getPosts(
      selectedCategory === 'Tất cả' ? undefined : selectedCategory
    ).then((data) => {
      if (!mounted) return;
      setPosts(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [selectedCategory]);

  const filteredPosts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return posts;
    return posts.filter((post) => {
      const haystack = [post.title, post.content, post.authorName, ...post.tags]
        .join(' ')
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [posts, searchTerm]);

  const totalComments = posts.reduce(
    (total, post) => total + post.commentsCount,
    0
  );
  const totalImages = posts.reduce(
    (total, post) => total + (post.attachments?.length || 0),
    0
  );

  const resetComposer = () => {
    setNewTitle('');
    setNewContent('');
    setNewCategory('Hỏi đáp học tập');
    setNewTags('');
    setAttachments([]);
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSubmitting(true);
    try {
      const newPost = await ForumService.createPost({
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        tags: newTags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        attachments,
      });
      setPosts((currentPosts) => [newPost, ...currentPosts]);
      setIsModalOpen(false);
      resetComposer();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi đăng bài.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 transition-colors dark:bg-slate-950">
      <div className="container mx-auto max-w-6xl px-4">
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/20 dark:text-emerald-300">
                <Sparkle weight="fill" className="h-3.5 w-3.5" />
                Cộng đồng học tập
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                Diễn đàn trao đổi tài liệu và kinh nghiệm học tập
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                Đăng câu hỏi, chia sẻ ảnh minh họa, góp ý đồ án và thảo luận
                theo từng chủ đề.
              </p>
            </div>

            {can('POST_FORUM') && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="h-12 shrink-0 rounded-xl bg-emerald-700 px-6 text-white hover:bg-emerald-800"
              >
                <PencilSimple weight="bold" className="mr-2 h-5 w-5" />
                Bài viết mới
              </Button>
            )}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
              <p className="text-xs font-bold uppercase text-slate-500">
                Bài viết
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                {posts.length}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
              <p className="text-xs font-bold uppercase text-slate-500">
                Bình luận
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                {totalComments}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
              <p className="text-xs font-bold uppercase text-slate-500">
                Ảnh đã chia sẻ
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
                {totalImages}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="relative mb-5">
              <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm bài viết..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
                <TrendUp weight="duotone" className="h-4 w-4 text-emerald-600" />
                Danh mục
              </p>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`flex h-10 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-semibold transition-colors ${
                      selectedCategory === category
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyForumState />
            )}
          </main>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  Tạo bài viết mới
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Có thể đính kèm ảnh để mô tả lỗi, tài liệu hoặc giao diện.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
                aria-label="Đóng"
              >
                <X weight="bold" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tiêu đề bài viết"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
              />

              <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                >
                  {CATEGORIES.filter((category) => category !== 'Tất cả').map(
                    (category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                  )}
                </select>
                <input
                  type="text"
                  placeholder="Tag, cách nhau bằng dấu phẩy"
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  value={newTags}
                  onChange={(event) => setNewTags(event.target.value)}
                />
              </div>

              <textarea
                placeholder="Nội dung chi tiết..."
                className="min-h-[180px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                value={newContent}
                onChange={(event) => setNewContent(event.target.value)}
              />

              <AttachmentPicker
                attachments={attachments}
                onChange={setAttachments}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                onClick={handleCreatePost}
                className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
              >
                {isSubmitting ? 'Đang đăng...' : 'Đăng bài viết'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
