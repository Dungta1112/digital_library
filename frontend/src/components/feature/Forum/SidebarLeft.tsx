'use client';

import React from 'react';
import { 
  House, 
  Users, 
  BookmarkSimple, 
  Calendar, 
  Gear, 
  Student, 
  UserCircle 
} from '@phosphor-icons/react';
import Link from 'next/link';

export function SidebarLeft() {
  // Mock data representing user context and joined groups
  const joinedGroups = [
    { id: '1', name: 'Nhóm Giải Tích 1', unreadCount: 3, avatar: 'GT' },
    { id: '2', name: 'Cộng đồng AI & ML', unreadCount: 12, avatar: 'AI' },
    { id: '3', name: 'Lập trình Web Nâng Cao', unreadCount: 0, avatar: 'W' },
    { id: '4', name: 'Nghiên cứu Khoa học', unreadCount: 5, avatar: 'KH' },
  ];

  return (
    <aside className="w-full lg:w-[260px] shrink-0 sticky top-[80px] self-start space-y-6 hidden lg:block select-none">
      {/* Navigation Menu */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-1 shadow-sm">
        <Link href="/forum" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold transition-all">
          <House weight="fill" className="w-5 h-5" />
          <span className="text-sm">Bảng tin chính</span>
        </Link>

        <Link href="/groups" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold transition-all">
          <Users weight="duotone" className="w-5 h-5 text-slate-500" />
          <span className="text-sm">Nhóm của bạn</span>
        </Link>

        <Link href="/forum?filter=bookmarks" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold transition-all">
          <BookmarkSimple weight="duotone" className="w-5 h-5 text-slate-500" />
          <span className="text-sm">Bài viết đã lưu</span>
        </Link>

        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold transition-all">
          <Gear weight="duotone" className="w-5 h-5 text-slate-500" />
          <span className="text-sm">Cài đặt</span>
        </Link>
      </div>

      {/* Joined Study Groups Shortcut */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Lối tắt nhóm
          </h4>
          <Link href="/groups" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
            Xem tất cả
          </Link>
        </div>

        <div className="space-y-2">
          {joinedGroups.map(group => (
            <Link 
              key={group.id} 
              href={`/groups/${group.id}`} 
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-all">
                  {group.avatar}
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-all truncate max-w-[140px]">
                  {group.name}
                </span>
              </div>

              {group.unreadCount > 0 && (
                <span className="bg-emerald-600 text-white font-bold text-[10px] min-w-5 h-5 flex items-center justify-center px-1 rounded-full shadow-sm">
                  {group.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* System stats brief */}
      <div className="p-4 rounded-3xl bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/20 dark:border-slate-800/40 text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
        <p className="font-semibold flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Student weight="duotone" className="w-4 h-4 text-emerald-600" />
          AI Library Network © 2026
        </p>
        <p>Phiên bản diễn đàn v2.0 (Meta-UX)</p>
      </div>
    </aside>
  );
}
