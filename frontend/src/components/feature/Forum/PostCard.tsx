'use client';

import React, { useState } from 'react';
import { ForumPost } from '@/types/forum';
import { useForumStore } from '@/hooks/useForumStore';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  ChatCircle, 
  BookmarkSimple, 
  FilePdf, 
  FileDoc, 
  DownloadSimple, 
  Trash,
  LinkSimple
} from '@phosphor-icons/react';
import Link from 'next/link';
import { ReactionButton } from './ReactionButton';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: ForumPost;
}

export function PostCard({ post }: PostCardProps) {
  const { deletePost, reactions } = useForumStore();
  const { can } = usePermissions();

  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const postReactionState = reactions[post.id] || {
    myReaction: undefined,
    counts: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
    total: 0
  };

  const isLongContent = post.content.length > 280;
  const displayContent = expanded || !isLongContent 
    ? post.content 
    : `${post.content.substring(0, 260)}...`;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
    
    setIsDeleting(true);
    const success = await deletePost(post.id);
    if (!success) {
      alert('Không thể xóa bài viết');
      setIsDeleting(false);
    }
  };

  // Mocking file attachment parsing: if post has a tag "tailieu" or "pdf", we render a mock file
  const hasAttachment = post.tags?.some(tag => ['pdf', 'tailieu', 'docs', 'slide'].includes(tag.toLowerCase())) || post.id.charCodeAt(0) % 3 === 0;

  const mockAttachment = {
    name: `Tài liệu học tập - ${post.title}.pdf`,
    size: '2.4 MB',
    type: 'pdf'
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
                {post.authorRole === 'LECTURER' ? 'Giảng viên' : 'Sinh viên'}
              </span>
            </div>
            
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {new Date(post.createdAt).toLocaleDateString('vi-VN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Delete action for creator or admin */}
          {(can('MODERATE_FORUM') || post.authorRole === 'ADMIN') && (
            <button 
              disabled={isDeleting}
              onClick={handleDelete}
              className="w-8 h-8 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors shrink-0"
              title="Xóa bài đăng"
            >
              <Trash size={16} />
            </button>
          )}

          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors shrink-0 ${
              isBookmarked ? 'text-amber-500' : 'text-slate-400'
            }`}
            title="Lưu bài viết"
          >
            <BookmarkSimple size={16} weight={isBookmarked ? 'fill' : 'bold'} />
          </button>
        </div>
      </div>

      {/* Title & Body content */}
      <div className="px-5 py-2">
        <Link href={`/forum/post/${post.id}`} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight mb-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-slate-700 dark:text-slate-350 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
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

      {/* Attachment Section */}
      {hasAttachment && (
        <div className="px-5 py-2">
          <div className="border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0 shadow-inner">
                {mockAttachment.type === 'pdf' ? <FilePdf size={24} weight="duotone" /> : <FileDoc size={24} weight="duotone" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-[340px]">
                  {mockAttachment.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  Tài liệu PDF • {mockAttachment.size}
                </span>
              </div>
            </div>

            <button 
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center shadow-sm active:scale-95 transition-all"
              title="Tải về"
            >
              <DownloadSimple size={15} weight="bold" />
            </button>
          </div>
        </div>
      )}

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
      <div className="px-5 py-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-bold border-b border-slate-100 dark:border-slate-850">
        <div className="flex items-center gap-1">
          {post.likes > 0 && (
            <>
              <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-blue-500 text-white text-[9px] shadow-sm select-none">👍</span>
              {postReactionState.counts.love > 0 && (
                <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] shadow-sm select-none">❤️</span>
              )}
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
        {/* Hover Reaction system */}
        <ReactionButton postId={post.id} />

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
    </article>
  );
}
