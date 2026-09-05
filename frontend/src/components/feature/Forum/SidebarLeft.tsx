'use client';

import React from 'react';
import { 
  House, 
  Users, 
  Gear, 
  Student, 
} from '@phosphor-icons/react';
import Link from 'next/link';

export function SidebarLeft() {
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

        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold transition-all">
          <Gear weight="duotone" className="w-5 h-5 text-slate-500" />
          <span className="text-sm">Cài đặt</span>
        </Link>
      </div>

      {/* System stats brief */}
      <div className="p-4 rounded-3xl bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/20 dark:border-slate-800/40 text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
        <p className="font-semibold flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Student weight="duotone" className="w-4 h-4 text-emerald-600" />
          AI Library Network © 2026
        </p>
      </div>
    </aside>
  );
}
