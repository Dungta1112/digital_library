'use client';

import React from 'react';
import { StudyGroup } from '@/types/group';
import Link from 'next/link';
import { UsersThree, CheckCircle, ArrowRight, Crown, Clock } from '@phosphor-icons/react';

const GRADIENTS = [
  'from-emerald-600 to-teal-700',
  'from-teal-600 to-cyan-700',
  'from-cyan-600 to-blue-700',
  'from-emerald-700 to-green-800',
  'from-teal-700 to-emerald-900',
];

export function getGroupGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export function GroupCard({ group, currentUserId }: { group: StudyGroup; currentUserId?: string }) {
  const gradient = getGroupGradient(group.id);
  const initial = group.name.trim().charAt(0).toUpperCase() || 'N';

  const isOwner = Boolean(currentUserId && group.ownerId === currentUserId);

  return (
    <div className="relative group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 transition-all duration-300 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/5 flex flex-col justify-between">
      <div>
        {/* Header row: Avatar + Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white font-bold text-lg flex items-center justify-center shadow-md shadow-emerald-900/10 flex-shrink-0`}
            >
              {initial}
            </div>
            <div>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
                {group.visibility === 'PUBLIC'
                  ? 'Công khai'
                  : group.visibility === 'UNKNOWN'
                    ? 'Chưa rõ quyền truy cập'
                    : 'Hạn chế truy cập'}
              </span>
            </div>
          </div>

          {/* Membership status badge */}
          {group.membershipStatus === 'PENDING' ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/50">
              <Clock weight="bold" className="w-3.5 h-3.5" />
              Đang chờ duyệt
            </span>
          ) : isOwner ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full">
              <Crown weight="fill" className="w-3.5 h-3.5 text-amber-500" />
              Trưởng nhóm
            </span>
          ) : group.isJoined ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <CheckCircle weight="fill" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Đã tham gia
            </span>
          ) : null}
        </div>

        {/* Group Name */}
        <Link href={`/groups/${group.id}`} className="block focus:outline-none">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {group.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {group.description || 'Chưa có mô tả chi tiết cho nhóm học tập này.'}
        </p>
      </div>

      {/* Footer: Member count + Action button */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          <UsersThree weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
          <span>{group.membersCount} thành viên</span>
        </div>

        <Link
          href={`/groups/${group.id}`}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          {group.isJoined ? 'Mở nhóm' : 'Xem nhóm'}
          <ArrowRight weight="bold" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
