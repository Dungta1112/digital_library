'use client';

import React from 'react';
import { 
  Trophy, 
  TrendUp, 
  Megaphone,
  CaretRight
} from '@phosphor-icons/react';
import Link from 'next/link';

export function SidebarRight() {
  const topContributors = [
    { id: '1', name: 'TS. Nguyễn Văn A', points: 1420, role: 'LECTURER', avatar: 'A' },
    { id: '2', name: 'Lê Minh Triết', points: 980, role: 'STUDENT', avatar: 'T' },
    { id: '3', name: 'Trần Thị Thuỷ', points: 850, role: 'STUDENT', avatar: 'T' },
  ];

  const trendingTags = [
    { name: 'DeepLearning', count: 42 },
    { name: 'GiaiTich1', count: 28 },
    { name: 'KinhTeViMo', count: 19 },
    { name: 'React19', count: 15 },
  ];

  const announcements = [
    { id: '1', title: 'Nộp đề cương Nghiên cứu Khoa học trước 30/08', date: '2 ngày trước' },
    { id: '2', title: 'Thư viện số cập nhật hơn 1000 đầu sách ngoại văn mới', date: '5 ngày trước' },
  ];

  return (
    <aside className="w-full lg:w-[280px] shrink-0 sticky top-[80px] self-start space-y-6 hidden lg:block select-none">
      {/* Top Contributors */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Trophy weight="duotone" className="w-5 h-5 text-amber-500" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Thành viên tích cực
          </h4>
        </div>

        <div className="space-y-3">
          {topContributors.map((user, idx) => (
            <div key={user.id} className="flex items-center justify-between p-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                  {user.avatar}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer transition-all">
                    {user.name}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    {user.role === 'LECTURER' ? 'Giảng viên' : 'Sinh viên'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {user.points}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block">điểm</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics (#Hashtags) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 px-1">
          <TrendUp weight="bold" className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Chủ đề nổi bật
          </h4>
        </div>

        <div className="space-y-2">
          {trendingTags.map(tag => (
            <Link 
              key={tag.name} 
              href={`/forum?tag=${tag.name}`}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group"
            >
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-all">
                #{tag.name}
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-all">
                {tag.count} bài
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Announcements / System Notifications */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Megaphone weight="duotone" className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Thông báo hệ thống
          </h4>
        </div>

        <div className="space-y-4">
          {announcements.map(ann => (
            <div key={ann.id} className="border-b border-slate-100 dark:border-slate-800/60 pb-3 last:border-0 last:pb-0">
              <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer line-clamp-2 leading-relaxed">
                {ann.title}
              </h5>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                {ann.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
