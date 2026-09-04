'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ForumService } from '@/services/forum.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, ChatCircleText, PaperPlaneTilt, WarningCircle, CheckCircle } from '@phosphor-icons/react';

interface CreateForumPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

function CreateForumPostForm({
  onClose,
  onPostCreated,
  draftKey,
}: {
  onClose: () => void;
  onPostCreated?: () => void;
  draftKey: string;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          return parsed.title || '';
        }
      } catch {
        // ignore parse error
      }
    }
    return '';
  });

  const [content, setContent] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          return parsed.content || '';
        }
      } catch {
        // ignore parse error
      }
    }
    return '';
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const saveDraft = (t: string, c: string) => {
    if (typeof window === 'undefined') return;
    try {
      if (!t.trim() && !c.trim()) {
        localStorage.removeItem(draftKey);
      } else {
        localStorage.setItem(draftKey, JSON.stringify({ title: t, content: c }));
      }
    } catch {
      // ignore storage error
    }
  };

  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(draftKey);
      } catch {
        // ignore
      }
    }
    setTitle('');
    setContent('');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    saveDraft(val, content);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    saveDraft(title, val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề bài viết.');
      return;
    }
    if (title.trim().length > 255) {
      setErrorMsg('Tiêu đề không được vượt quá 255 ký tự.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Vui lòng nhập nội dung thảo luận.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const created = await ForumService.createPost(title.trim(), content.trim());
      setSuccessMsg('Đăng bài thành công!');
      clearDraft();

      if (onPostCreated) {
        onPostCreated();
      }

      setTimeout(() => {
        onClose();
        if (created?.id) {
          router.push(`/forum#post-${created.id}`);
        } else {
          router.push('/forum');
        }
      }, 600);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể đăng bài viết. Vui lòng kiểm tra kết nối và thử lại.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-forum-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <ChatCircleText weight="duotone" className="w-5 h-5" />
            </div>
            <div>
              <h2 id="create-forum-title" className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Tạo bài thảo luận Diễn đàn
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chia sẻ ý kiến, đặt câu hỏi học thuật với cộng đồng Thư viện Trưng Vương
              </p>
            </div>
          </div>
          <button
            onClick={() => !submitting && onClose()}
            disabled={submitting}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            aria-label="Đóng hộp thoại"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 text-xs font-semibold border border-red-200/60 dark:border-red-900/50">
              <WarningCircle weight="fill" className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-900/50">
              <CheckCircle weight="fill" className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="post-title" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Tiêu đề bài viết <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] font-medium ${title.length > 255 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {title.length}/255
              </span>
            </div>
            <Input
              id="post-title"
              type="text"
              placeholder="Ví dụ: Thảo luận phương pháp giải bài tập Cấu trúc dữ liệu..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              disabled={submitting}
              className="rounded-2xl border-slate-200 dark:border-slate-800 text-sm font-medium"
              maxLength={255}
              required
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="post-content" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Nội dung thảo luận <span className="text-red-500">*</span>
            </label>
            <textarea
              id="post-content"
              rows={6}
              placeholder="Trình bày chi tiết nội dung, câu hỏi hoặc tài liệu bạn muốn trao đổi..."
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none transition-all font-normal"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">
              💡 Bản nháp được tự động lưu trên trình duyệt của bạn
            </span>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={submitting}
                className="px-5 rounded-xl font-semibold text-xs border-slate-200 dark:border-slate-800"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={submitting || !title.trim() || !content.trim()}
                className="px-6 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95 transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang đăng...
                  </>
                ) : (
                  <>
                    <PaperPlaneTilt weight="bold" className="w-4 h-4" />
                    Đăng thảo luận
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateForumPostDialog({
  isOpen,
  onClose,
  onPostCreated,
}: CreateForumPostDialogProps) {
  const { user } = useAuth();
  const draftKey = user ? `tvu_forum_draft_${user.id}` : 'tvu_forum_draft_anon';

  if (!isOpen) return null;

  return (
    <CreateForumPostForm
      onClose={onClose}
      onPostCreated={onPostCreated}
      draftKey={draftKey}
    />
  );
}
