'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ForumPost, ForumComment } from '@/types/forum';
import { useForumStore } from '@/hooks/useForumStore';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  ChatCircleText, 
  Trash, 
  Heart, 
  ArrowElbowDownRight, 
  PaperPlaneRight, 
  Image as ImageIcon 
} from '@phosphor-icons/react';

interface CommentSectionProps {
  post: ForumPost;
}

export function CommentSection({ post }: CommentSectionProps) {
  const { addComment, deleteComment } = useForumStore();
  const { can } = usePermissions();

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ForumComment | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      let finalContent = text.trim();
      if (replyingTo) {
        // Prepend mention to content to support backend-compatible threading
        finalContent = `@${replyingTo.authorName} ${finalContent}`;
      }
      await addComment(post.id, finalContent);
      setText('');
      setReplyingTo(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    } catch (err) {
      console.error(err);
      alert('Không thể gửi bình luận');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyClick = (comment: ForumComment) => {
    setReplyingTo(comment);
    setText('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send comment on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Parsing Flat comments into a hierarchical structure for UI rendering
  // If a comment content starts with "@Username ", it is considered a reply.
  // We parse it and group under the original comment if Username matches a previous comment.
  const parseComments = (flatComments: ForumComment[] = []) => {
    const rootComments: (ForumComment & { replies: ForumComment[] })[] = [];
    
    flatComments.forEach(comment => {
      const match = comment.content.match(/^@([^\s:]+)\s(.*)/);
      if (match) {
        const mentionName = match[1];
        const actualContent = match[2];
        
        // Find if there is a parent comment by this user
        const parent = rootComments.find(rc => 
          rc.authorName.replace(/\s+/g, '') === mentionName.replace(/\s+/g, '')
        );

        if (parent) {
          parent.replies.push({
            ...comment,
            content: actualContent // Strip the mention in display for cleaner UI
          });
          return;
        }
      }
      
      // If no match or parent not found, render as root comment
      rootComments.push({
        ...comment,
        replies: []
      });
    });

    return rootComments;
  };

  const parsedComments = parseComments(post.comments || []);
  const isLoggedIn = can('COMMENT_FORUM');

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
      <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-base tracking-tight flex items-center gap-2">
        <ChatCircleText weight="duotone" className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
        Thảo luận cộng đồng ({post.commentsCount})
      </h4>

      {/* Comments List */}
      <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-1">
        {parsedComments.map(comment => (
          <div key={comment.id} className="space-y-4">
            {/* Root Comment */}
            <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 hover:shadow-sm transition-all group relative">
              {/* Delete trigger for moderators */}
              {can('MODERATE_FORUM') && (
                <button 
                  onClick={() => deleteComment(post.id, comment.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Xóa bình luận"
                >
                  <Trash size={15} />
                </button>
              )}

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {comment.authorName.charAt(0)}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {comment.authorName}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      comment.authorRole === 'LECTURER' 
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {comment.authorRole === 'LECTURER' ? 'Giảng viên' : 'Sinh viên'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  {/* Comment interaction controls */}
                  <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    <button className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      <Heart size={13} /> Thích
                    </button>
                    {isLoggedIn && (
                      <button 
                        onClick={() => handleReplyClick(comment)}
                        className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        <ArrowElbowDownRight size={13} /> Phản hồi
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Replies (Nested Level 2) */}
            {comment.replies.map(reply => (
              <div key={reply.id} className="pl-8 sm:pl-10 space-y-4">
                <div className="bg-slate-100/30 dark:bg-slate-950/10 p-3.5 rounded-2xl border border-slate-100/60 dark:border-slate-800/40 relative group">
                  {can('MODERATE_FORUM') && (
                    <button 
                      onClick={() => deleteComment(post.id, reply.id)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash size={13} />
                    </button>
                  )}

                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {reply.authorName.charAt(0)}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-bold text-slate-850 dark:text-slate-200 text-xs">
                          {reply.authorName}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(reply.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <p className="text-slate-650 dark:text-slate-350 text-xs leading-relaxed">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-1.5">
                          @{comment.authorName}
                        </span>
                        {reply.content}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        <button className="flex items-center gap-1 hover:text-emerald-600">
                          <Heart size={12} /> Thích
                        </button>
                        {isLoggedIn && (
                          <button 
                            onClick={() => handleReplyClick(comment)}
                            className="flex items-center gap-1 hover:text-emerald-600"
                          >
                            <ArrowElbowDownRight size={12} /> Phản hồi
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {parsedComments.length === 0 && (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <p className="text-sm font-medium">Chưa có bình luận nào. Hãy bắt đầu cuộc thảo luận!</p>
          </div>
        )}
      </div>

      {/* Comment Form Input */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Replying indicator banner */}
          {replyingTo && (
            <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 px-4 py-2 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
              <span>Đang trả lời bình luận của <strong>{replyingTo.authorName}</strong></span>
              <button 
                type="button" 
                onClick={() => setReplyingTo(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Hủy
              </button>
            </div>
          )}

          {/* Text Area Input */}
          <div className="relative bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all flex items-end gap-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Viết câu trả lời hoặc bình luận... (Enter để gửi)"
              className="flex-grow bg-transparent border-0 outline-none p-0 text-slate-900 dark:text-white placeholder-slate-400 text-xs md:text-sm leading-relaxed resize-none max-h-32 min-h-[24px]"
            />
            
            <div className="flex items-center gap-1 text-slate-400 shrink-0">
              <button 
                type="button" 
                className="p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Đính kèm ảnh"
              >
                <ImageIcon size={18} />
              </button>
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="p-2 rounded-full bg-slate-900 dark:bg-emerald-600 text-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 transition-all active:scale-95"
              >
                <PaperPlaneRight size={15} weight="bold" />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-950/30 p-5 rounded-2xl text-center border border-slate-200/50 dark:border-slate-800/60">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Đăng nhập để đóng góp ý kiến của bạn vào cuộc thảo luận này.
          </p>
        </div>
      )}
    </div>
  );
}
