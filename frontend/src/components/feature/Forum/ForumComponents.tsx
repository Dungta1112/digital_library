'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ChatCircle,
  Heart,
  Image as ImageIcon,
  PaperPlaneTilt,
  Trash,
  UploadSimple,
  User,
  X,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';
import type {
  CreateCommentInput,
  ForumAttachment,
  ForumComment,
  ForumPost,
} from '@/types/forum';

const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const categoryStyles: Record<string, string> = {
  'Hỏi đáp học tập':
    'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/60',
  'Tài liệu':
    'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800/60',
  'Đồ án':
    'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/60',
  'Thông báo':
    'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800/60',
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    STUDENT: 'Sinh viên',
    LECTURER: 'Giảng viên',
    FACULTY: 'Giảng viên',
    ADMIN: 'Quản trị',
  };
  return labels[role] || role;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AttachmentPicker({
  attachments,
  onChange,
}: {
  attachments: ForumAttachment[];
  onChange: (attachments: ForumAttachment[]) => void;
}) {
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setError('');
    const remainingSlots = MAX_IMAGES - attachments.length;
    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    if (remainingSlots <= 0) {
      setError(`Chỉ có thể đính kèm tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Chỉ hỗ trợ file ảnh.');
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError('Mỗi ảnh cần nhỏ hơn 5MB.');
        return false;
      }
      return true;
    });

    const nextAttachments = await Promise.all(
      validFiles.map(async (file) => ({
        id: `image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: 'image' as const,
        url: await readFileAsDataUrl(file),
        name: file.name,
        size: file.size,
        alt: file.name,
      }))
    );

    onChange([...attachments, ...nextAttachments]);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
        >
          <UploadSimple weight="bold" className="h-4 w-4" />
          Thêm ảnh
        </button>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {attachments.length}/{MAX_IMAGES} ảnh, tối đa 5MB/ảnh
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      {attachments.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
            >
              <img
                src={attachment.url}
                alt={attachment.alt || attachment.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  onChange(attachments.filter((item) => item.id !== attachment.id))
                }
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Xóa ảnh"
              >
                <X weight="bold" className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ImageGallery({
  attachments,
  compact = false,
}: {
  attachments?: ForumAttachment[];
  compact?: boolean;
}) {
  const images = attachments?.filter((item) => item.type === 'image') || [];
  const [activeImage, setActiveImage] = useState<ForumAttachment | null>(null);

  if (images.length === 0) return null;

  const visibleImages = compact ? images.slice(0, 3) : images;

  return (
    <>
      <div
        className={`grid gap-3 ${
          compact
            ? 'grid-cols-3'
            : images.length === 1
              ? 'grid-cols-1'
              : 'grid-cols-2'
        }`}
      >
        {visibleImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setActiveImage(image);
            }}
            className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-left dark:border-slate-700 dark:bg-slate-800 ${
              compact ? 'aspect-square' : 'aspect-[16/10]'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt || image.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {compact && index === 2 && images.length > 3 && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 text-lg font-bold text-white">
                +{images.length - 2}
              </div>
            )}
          </button>
        ))}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-4"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Đóng ảnh"
          >
            <X weight="bold" className="h-5 w-5" />
          </button>
          <img
            src={activeImage.url}
            alt={activeImage.alt || activeImage.name}
            className="max-h-[86vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

export function PostCard({ post }: { post: ForumPost }) {
  const categoryClass =
    categoryStyles[post.category] ||
    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  return (
    <Link href={`/forum/post/${post.id}`} className="group block">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${categoryClass}`}
          >
            {post.category}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {formatDate(post.createdAt)}
          </span>
        </div>

        <h3 className="mb-3 text-xl font-bold leading-snug text-slate-950 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
          {post.title}
        </h3>

        <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {post.content}
        </p>

        <ImageGallery attachments={post.attachments} compact />

        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <User weight="duotone" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-slate-900 dark:text-white">
                {post.authorName}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {roleLabel(post.authorRole)}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Heart weight="duotone" className="h-4 w-4" />
              {post.likes}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ChatCircle weight="duotone" className="h-4 w-4" />
              {post.commentsCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function CommentItem({ comment }: { comment: ForumComment }) {
  const { can } = usePermissions();

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {comment.authorName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-950 dark:text-white">
                {comment.authorName}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {roleLabel(comment.authorRole)}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {new Date(comment.createdAt).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>

        {can('MODERATE_FORUM') ? (
          <button className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300">
            <Trash weight="bold" className="h-3.5 w-3.5" />
            Xóa
          </button>
        ) : (
          <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-red-500">
            <Heart weight="duotone" className="h-5 w-5" />
            {comment.likes}
          </button>
        )}
      </div>

      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
        {comment.content}
      </p>

      <div className="mt-4">
        <ImageGallery attachments={comment.attachments} />
      </div>
    </article>
  );
}

export function CommentForm({
  onSubmit,
}: {
  onSubmit: (input: CreateCommentInput) => Promise<void>;
}) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<ForumAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const { can } = usePermissions();

  const handleSubmit = async () => {
    if (!text.trim() && attachments.length === 0) return;
    setLoading(true);
    await onSubmit({ content: text.trim(), attachments });
    setText('');
    setAttachments([]);
    setLoading(false);
  };

  if (!can('COMMENT_FORUM')) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-5 font-medium text-slate-600 dark:text-slate-400">
          Vui lòng đăng nhập để tham gia thảo luận cùng cộng đồng.
        </p>
        <Link href="/login">
          <Button variant="secondary" className="rounded-xl">
            Đăng nhập
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950 dark:text-white">
        <ChatCircle weight="duotone" className="h-5 w-5 text-emerald-600" />
        Bình luận
      </h4>
      <textarea
        className="mb-4 min-h-[130px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-base text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        placeholder="Viết bình luận hoặc đính kèm ảnh minh họa..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <AttachmentPicker attachments={attachments} onChange={setAttachments} />

      <div className="mt-5 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading || (!text.trim() && attachments.length === 0)}
          className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
        >
          <PaperPlaneTilt weight="bold" className="mr-2 h-4 w-4" />
          {loading ? 'Đang gửi...' : 'Gửi bình luận'}
        </Button>
      </div>
    </div>
  );
}

export function EmptyForumState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <ImageIcon weight="duotone" className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-950 dark:text-white">
        Chưa có bài viết phù hợp
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Thử đổi bộ lọc hoặc tạo bài viết mới để bắt đầu thảo luận.
      </p>
    </div>
  );
}
