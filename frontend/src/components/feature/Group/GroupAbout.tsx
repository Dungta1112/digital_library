'use client';

import React from 'react';
import { StudyGroup } from '@/types/group';
import { getGroupGradient } from './GroupCard';
import { Button } from '@/components/ui/Button';
import {
  Crown,
  UsersThree,
  Calendar,
  Compass,
  CheckCircle,
  Sparkle,
} from '@phosphor-icons/react';

interface GroupAboutProps {
  group: StudyGroup;
  isMember: boolean;
  onJoin: () => Promise<void>;
  isActionLoading: boolean;
}

export function GroupAbout({ group, isMember, onJoin, isActionLoading }: GroupAboutProps) {
  const gradient = getGroupGradient(group.id);
  const initial = group.name.trim().charAt(0).toUpperCase() || 'N';

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Main Group Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-emerald-900/10 flex-shrink-0`}
            >
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md">
                  {group.visibility === 'PRIVATE' ? 'Nhóm hạn chế' : 'Nhóm công khai'}
                </span>
                {isMember && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle weight="fill" className="w-3.5 h-3.5" />
                    Đã là thành viên
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {group.name}
              </h2>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Mục tiêu & Nội dung nhóm học tập
            </h4>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {group.description || 'Chưa có mô tả chi tiết cho nhóm học tập này.'}
            </p>
          </div>

          {/* Key Facts / Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Crown weight="duotone" className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400 font-medium">Trưởng nhóm</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {group.ownerName || 'Trưởng nhóm'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UsersThree weight="duotone" className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Quy mô nhóm</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {group.membersCount} thành viên
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Calendar weight="duotone" className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Ngày thành lập</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {group.createdAt
                    ? new Date(group.createdAt).toLocaleDateString()
                    : 'Học kỳ hiện tại'}
                </div>
              </div>
            </div>
          </div>

          {!isMember && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Tham gia ngay để cùng trao đổi và truy cập kho tài liệu của nhóm.
              </span>
              <Button
                onClick={onJoin}
                disabled={isActionLoading}
                className="h-11 px-6 rounded-xl font-bold shadow-md shadow-emerald-600/10 shrink-0"
              >
                {isActionLoading ? 'Đang tham gia...' : 'Tham gia nhóm'}
              </Button>
            </div>
          )}
        </div>

        {/* Study Group Community Guide */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Compass weight="duotone" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hướng dẫn tham gia & học tập hiệu quả
            </h3>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <Sparkle weight="fill" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Gửi lời chào và câu hỏi:</strong> Thành viên mới có thể mở tab <em>Trao đổi</em> để tự giới thiệu mục tiêu học tập hoặc đặt câu hỏi về bài tập.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Sparkle weight="fill" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Cùng đọc tài liệu thư viện:</strong> Vào tab <em>Tài liệu nhóm</em> để mở đọc trực tiếp các giáo trình dùng chung hoặc sử dụng nút <em>Hỏi AI</em> để được giải đáp chuyên sâu.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Sparkle weight="fill" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Tôn trọng và văn minh:</strong> Giữ thái độ học thuật, tích cực hỗ trợ bạn học và tuân thủ nội quy Thư viện Số Đại học Trưng Vương.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
