'use client';

import React from 'react';
import type { ProfileTabKey } from '@/types/profile';
import type { User } from '@/types/auth';
import { 
  UserCircle, 
  ClockCounterClockwise, 
  Files 
} from '@phosphor-icons/react';

interface ProfileTabsProps {
  activeTab: ProfileTabKey;
  onTabChange: (tab: ProfileTabKey) => void;
  user: User;
  historyCount?: number;
  contributionCount?: number;
}

export function ProfileTabs({
  activeTab,
  onTabChange,
  user,
  historyCount,
  contributionCount,
}: ProfileTabsProps) {
  const canUpload = user.role === 'LECTURER' || user.role === 'ADMIN';

  const tabs: { key: ProfileTabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: <UserCircle weight="bold" className="w-4 h-4" />,
    },
    {
      key: 'history',
      label: 'Lịch sử đọc',
      icon: <ClockCounterClockwise weight="bold" className="w-4 h-4" />,
      badge: historyCount,
    },
  ];

  if (canUpload) {
    tabs.push({
      key: 'contributions',
      label: 'Tài liệu đóng góp',
      icon: <Files weight="bold" className="w-4 h-4" />,
      badge: contributionCount,
    });
  }

  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800 mb-6">
      <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`relative flex items-center gap-2 pb-3.5 pt-2 px-1 text-xs sm:text-sm font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
