'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookOpenText,
  CalendarBlank,
  Camera,
  ChatCircle,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  PencilSimple,
  ShareNetwork,
  UserCircle,
  X,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types/auth';
import type { Document } from '@/types/library';
import type { ForumPost } from '@/types/forum';
import type { UpdateProfileInput } from '@/services/profile.service';

type TabKey = 'overview' | 'documents' | 'posts';

interface ProfileViewProps {
  user: User;
  documents: Document[];
  forumPosts: ForumPost[];
  isOwner?: boolean;
  onSave?: (input: UpdateProfileInput) => Promise<void>;
}

function roleLabel(role: User['role']) {
  const labels = {
    ADMIN: 'Quản trị viên',
    LECTURER: 'Giảng viên',
    CONTENT_MANAGER: 'Kiểm duyệt viên',
    STUDENT: 'Sinh viên',
  };
  return labels[role];
}

function roleClass(role: User['role']) {
  if (role === 'ADMIN') return 'border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300';
  if (role === 'LECTURER') return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-300';
  return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/20 dark:text-emerald-300';
}

function formatJoinedDate(value?: string) {
  if (!value) return 'Tham gia Tháng 6, 2026';
  return `Tham gia ${new Date(value).toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  })}`;
}

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ProfileView({
  user,
  documents,
  forumPosts,
  isOwner = false,
  onSave,
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [draftName, setDraftName] = useState(user.fullName);
  const [draftBio, setDraftBio] = useState(
    user.bio || 'Chưa có giới thiệu cá nhân.'
  );
  const [draftAvatar, setDraftAvatar] = useState(user.avatarUrl || '');
  const [draftCover, setDraftCover] = useState(user.coverUrl || '');
  const [draftInterests, setDraftInterests] = useState(
    (user.interests || []).join(', ')
  );
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const displayName = editing ? draftName : user.fullName;
  const displayBio = editing ? draftBio : user.bio || 'Chưa có giới thiệu cá nhân.';
  const displayAvatar = editing ? draftAvatar : user.avatarUrl;
  const displayCover = editing ? draftCover : user.coverUrl;
  const displayInterests = editing
    ? draftInterests
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : user.interests || [];

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'documents', label: 'Tài liệu riêng', count: documents.length },
    { key: 'posts', label: 'Bài diễn đàn', count: forumPosts.length },
  ];

  const handleImageSelect = async (
    file: File | undefined,
    target: 'avatar' | 'cover'
  ) => {
    if (!file || !file.type.startsWith('image/')) return;
    const dataUrl = await readImage(file);
    if (target === 'avatar') setDraftAvatar(dataUrl);
    if (target === 'cover') setDraftCover(dataUrl);
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    setMessage('');
    try {
      await onSave({
        fullName: draftName.trim(),
        bio: draftBio.trim(),
        avatarUrl: draftAvatar,
        coverUrl: draftCover,
        interests: draftInterests
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setEditing(false);
      setMessage('Cập nhật hồ sơ thành công.');
    } catch (error) {
      console.error(error);
      setMessage('Không thể cập nhật hồ sơ.');
    } finally {
      setSaving(false);
    }
  };

  const closeEditor = () => {
    setDraftName(user.fullName);
    setDraftBio(user.bio || '');
    setDraftAvatar(user.avatarUrl || '');
    setDraftCover(user.coverUrl || '');
    setDraftInterests((user.interests || []).join(', '));
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative h-60 overflow-hidden bg-emerald-950 md:h-72">
        {displayCover ? (
          <img
            src={displayCover}
            alt="Ảnh nền hồ sơ"
            className="h-full w-full object-cover opacity-55"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#047857,#022c22_42%,#020617)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
        {editing && (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-white"
          >
            <ImageIcon weight="bold" className="h-4 w-4" />
            Đổi ảnh nền
          </button>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleImageSelect(event.target.files?.[0], 'cover')}
        />
      </div>

      <main className="container mx-auto max-w-6xl px-4 pb-12">
        <section className="relative -mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-xl dark:border-slate-900 dark:bg-slate-800">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-black text-emerald-600">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                {editing && (
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-x-0 bottom-0 flex h-11 items-center justify-center gap-2 bg-slate-950/75 text-xs font-bold text-white"
                  >
                    <Camera weight="bold" className="h-4 w-4" />
                    Đổi ảnh
                  </button>
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    handleImageSelect(event.target.files?.[0], 'avatar')
                  }
                />
              </div>

              <div className="min-w-0 pb-1">
                {editing ? (
                  <input
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    className="mb-2 h-12 w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-4 text-2xl font-bold text-slate-950 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                ) : (
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                    {displayName}
                  </h1>
                )}
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  @{user.username || user.email.split('@')[0]}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${roleClass(user.role)}`}
                  >
                    <GraduationCap weight="bold" className="h-4 w-4" />
                    {roleLabel(user.role)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <CalendarBlank weight="bold" className="h-4 w-4" />
                    {formatJoinedDate(user.joinedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {isOwner && editing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !draftName.trim()}
                    className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                  <Button variant="secondary" onClick={closeEditor} className="rounded-xl">
                    <X weight="bold" className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                </>
              ) : (
                <>
                  {isOwner && (
                    <Button
                      variant="secondary"
                      onClick={() => setEditing(true)}
                      className="rounded-xl"
                    >
                      <PencilSimple weight="bold" className="mr-2 h-4 w-4" />
                      Tùy chỉnh
                    </Button>
                  )}
                  <Button className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800">
                    <ShareNetwork weight="bold" className="mr-2 h-4 w-4" />
                    Chia sẻ
                  </Button>
                </>
              )}
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/20 dark:text-emerald-300">
              {message}
            </div>
          )}

          <div className="mt-8 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative pb-4 text-sm font-bold uppercase tracking-wide transition-colors ${
                    activeTab === tab.key
                      ? 'text-emerald-600 dark:text-emerald-300'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                  {typeof tab.count === 'number' && (
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.key && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6">
          {activeTab === 'overview' && (
            <OverviewPanel
              bio={displayBio}
              editing={editing}
              draftBio={draftBio}
              setDraftBio={setDraftBio}
              interests={displayInterests}
              draftInterests={draftInterests}
              setDraftInterests={setDraftInterests}
              documentCount={documents.length}
              postCount={forumPosts.length}
            />
          )}
          {activeTab === 'documents' && <DocumentsPanel documents={documents} />}
          {activeTab === 'posts' && <ForumPostsPanel posts={forumPosts} />}
        </section>
      </main>
    </div>
  );
}

function OverviewPanel({
  bio,
  editing,
  draftBio,
  setDraftBio,
  interests,
  draftInterests,
  setDraftInterests,
  documentCount,
  postCount,
}: {
  bio: string;
  editing: boolean;
  draftBio: string;
  setDraftBio: (value: string) => void;
  interests: string[];
  draftInterests: string;
  setDraftInterests: (value: string) => void;
  documentCount: number;
  postCount: number;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950 dark:text-white">
          <UserCircle weight="duotone" className="h-6 w-6 text-emerald-600" />
          Giới thiệu
        </h2>
        {editing ? (
          <textarea
            value={draftBio}
            onChange={(event) => setDraftBio(event.target.value)}
            className="min-h-[140px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
            {bio}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">
          Thống kê hồ sơ
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Tài liệu riêng" value={documentCount} />
          <StatCard label="Bài diễn đàn" value={postCount} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950 dark:text-white">
          <BookOpenText weight="duotone" className="h-6 w-6 text-emerald-600" />
          Chủ đề quan tâm
        </h2>
        {editing ? (
          <input
            value={draftInterests}
            onChange={(event) => setDraftInterests(event.target.value)}
            placeholder="AI, Thư viện số, Frontend..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {interests.length > 0 ? (
              interests.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {item}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">Chưa thêm chủ đề quan tâm.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function DocumentsPanel({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return <EmptyPanel title="Chưa có tài liệu riêng" description="Người dùng này chưa có tài liệu công khai." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {documents.map((document) => (
        <Link
          key={document.id}
          href={`/library/document/${document.id}`}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
              <FileText weight="duotone" className="h-6 w-6" />
            </div>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {document.fileType || 'Tài liệu'}
            </span>
          </div>
          <h3 className="line-clamp-2 text-lg font-bold text-slate-950 dark:text-white">
            {document.title}
          </h3>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            {document.authors.join(', ')}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {document.abstract}
          </p>
        </Link>
      ))}
    </div>
  );
}

function ForumPostsPanel({ posts }: { posts: ForumPost[] }) {
  if (posts.length === 0) {
    return <EmptyPanel title="Chưa có bài diễn đàn" description="Người dùng này chưa đăng bài nghiên cứu nào trên diễn đàn." />;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/forum/post/${post.id}`}
          className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <ChatCircle weight="duotone" className="h-4 w-4" />
              {post.commentsCount} bình luận
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {post.content}
          </p>
        </Link>
      ))}
    </div>
  );
}

function EmptyPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
