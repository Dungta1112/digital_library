'use client';

import React, { useState } from 'react';
import { ForumPost } from '@/types/forum';
import { useForumStore } from '@/hooks/useForumStore';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';
import { DeleteConfirmModal } from '@/components/ui/delete-confirm-modal';
import { 
  ChatCircle, 
  Trash,
  LinkSimple
} from '@phosphor-icons/react';
import Link from 'next/link';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: ForumPost;
}

export function PostCard({ post }: PostCardProps) {
  const { deletePost } = useForumStore();
  const { can } = usePermissions();
  const { user } = useAuth();

  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const isAuthor = Boolean(user?.id && post.authorId && user.id === post.authorId);
  const canModerate = can('MODERATE_FORUM');
  const canDelete = isAuthor || canModerate;

  const isLongContent = post.content.length > 280;
  const displayContent = expanded || !isLongContent 
    ? post.content 
    : `${post.content.substring(0, 260)}...`;

  const handleDelete = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError('');
    const success = await deletePost(post.id, !isAuthor && canModerate);
    if (!success) {
      setDeleteError('Không thể xóa bài viết. Bài viết vẫn được giữ nguyên.');
    }
    setIsDeleting(false);
    return success;
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col select-none">
      
      {/* Upper header action area */}
      <div className="p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
            {post.authorName.charAt(0)}
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 dark:text-white text-sm hover:underline cursor-pointer">
                {post.authorName}
              </span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                post.authorRole === 'LECTURER' 
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {post.authorRole === 'LECTURER'
                  ? 'Giảng viên'
                  : post.authorRole === 'STUDENT'
                    ? 'Sinh viên'
                    : post.authorRole === 'ADMIN'
                      ? 'Quản trị viên'
                      : 'Chưa cập nhật'}
              </span>
            </div>
            
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN', {
                day: 'numeric', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Chưa cập nhật thời gian'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Delete action for creator or admin */}
          {canDelete && (
            <button 
              disabled={isDeleting}
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-8 h-8 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors shrink-0"
              title="Xóa bài đăng"
              aria-label={`Xóa bài viết ${post.title}`}
            >
              <Trash size={16} />
            </button>
          )}

        </div>
      </div>

      {deleteError && (
        <p role="alert" className="mx-5 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
          {deleteError}
        </p>
      )}

      {/* Title & Body content */}
      <div className="px-5 py-2">
        <Link href={`/forum/post/${post.id}`} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight mb-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>

        {isLongContent && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-1 focus:outline-none"
          >
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}
      </div>

      {/* Tags list */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-5 py-2 flex flex-wrap gap-1.5">
          {post.tags.map(tag => (
            <Link 
              key={tag} 
              href={`/forum?tag=${tag}`}
              className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 px-2.5 py-1 rounded-full transition-all"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Social counters summary bar */}
      <div className="px-5 py-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1">
          {post.likes > 0 && (
            <>
              <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-blue-500 text-white text-[9px] shadow-sm select-none">👍</span>
              <span className="ml-1 text-slate-500 dark:text-slate-400 hover:underline cursor-pointer">
                {post.likes} lượt thích
              </span>
            </>
          )}
        </div>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="hover:underline"
        >
          {post.commentsCount} bình luận
        </button>
      </div>

      {/* Social actions interact panel */}
      <div className="px-3 py-1.5 flex items-center justify-between gap-1 shrink-0 bg-slate-50/30 dark:bg-slate-950/10">
        {/* Comment toggle trigger */}
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-bold text-sm flex-1 outline-none"
        >
          <ChatCircle weight="bold" className="w-5 h-5" />
          <span>Bình luận</span>
        </button>

        {/* Post detail navigation */}
        <Link 
          href={`/forum/post/${post.id}`}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-bold text-sm flex-1 outline-none text-center"
        >
          <LinkSimple weight="bold" className="w-5 h-5" />
          <span>Chi tiết</span>
        </Link>
      </div>

      {/* Comments section (inline expanded toggle) */}
      {showComments && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-200">
          <CommentSection post={post} />
        </div>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteDialogOpen}
        onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xóa bài viết?"
        itemName={post.title}
        description="Bài viết chỉ được gỡ khỏi giao diện sau khi máy chủ xác nhận xóa thành công."
        loading={isDeleting}
      />
    </article>
  );
}
