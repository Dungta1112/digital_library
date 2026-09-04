'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StudyGroup, GroupTabType } from '@/types/group';
import { getGroupGradient } from './GroupCard';
import {
  ArrowLeft,
  ChatTeardropText,
  Books,
  UsersThree,
  Info,
  Trash,
  List,
  X,
  Lock,
  Icon,
} from '@phosphor-icons/react';

interface GroupWorkspaceShellProps {
  group: StudyGroup;
  activeTab: GroupTabType;
  onTabChange: (tab: GroupTabType) => void;
  canDeleteGroup: boolean;
  onOpenDeleteModal: () => void;
  isMember: boolean;
  children: React.ReactNode;
}

interface NavTabItem {
  id: GroupTabType;
  label: string;
  icon: Icon;
  badge?: number | string;
}

export function GroupWorkspaceShell({
  group,
  activeTab,
  onTabChange,
  canDeleteGroup,
  onOpenDeleteModal,
  isMember,
  children,
}: GroupWorkspaceShellProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const gradient = getGroupGradient(group.id);
  const initial = group.name.trim().charAt(0).toUpperCase() || 'N';

  const navItems: NavTabItem[] = [
    { id: 'discussion', label: 'Trao đổi', icon: ChatTeardropText },
    { id: 'documents', label: 'Tài liệu nhóm', icon: Books },
    { id: 'members', label: 'Thành viên', icon: UsersThree, badge: group.membersCount },
    { id: 'about', label: 'Giới thiệu', icon: Info },
  ];

  const handleSelectTab = (tab: GroupTabType) => {
    onTabChange(tab);
    setMobileDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* ── Top Workspace Bar ──────────────────────────────────── */}
      <header className="h-14 sm:h-16 px-3 sm:px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile drawer toggle */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Mở thanh điều hướng"
          >
            <List weight="bold" className="w-5 h-5" />
          </button>

          {/* Back to catalog */}
          <Link
            href="/groups"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors shrink-0"
          >
            <ArrowLeft weight="bold" className="w-4 h-4" />
            <span className="hidden sm:inline">Nhóm học tập</span>
          </Link>

          <span className="text-slate-300 dark:text-slate-700">/</span>

          {/* Group Identity */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${gradient} text-white font-bold text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-sm`}
            >
              {initial}
            </div>
            <h1 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {group.name}
            </h1>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!isMember && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/50">
              <Lock weight="bold" className="w-3.5 h-3.5" />
              Chưa tham gia
            </span>
          )}

          {canDeleteGroup && (
            <button
              type="button"
              onClick={onOpenDeleteModal}
              title="Giải tán nhóm học tập"
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 transition-colors"
            >
              <Trash weight="bold" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Giải tán nhóm</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Main Workspace Body ───────────────────────────────── */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* Left Navigation Sidebar (Desktop 240px) */}
        <aside className="hidden md:flex w-60 flex-col flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 justify-between p-3">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Không gian nhóm
              </span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      weight={isActive ? 'fill' : 'duotone'}
                      className={`w-5 h-5 ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Group Info Box */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {group.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {group.description || 'Chưa có mô tả'}
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden animate-fadeIn"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <div
              className="w-72 max-w-[80vw] h-full bg-white dark:bg-slate-900 p-4 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}
                    >
                      {initial}
                    </div>
                    <span className="text-sm font-bold truncate">{group.name}</span>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X weight="bold" className="w-5 h-5" />
                  </button>
                </div>

                <div className="pt-2 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            weight={isActive ? 'fill' : 'duotone'}
                            className={`w-5 h-5 ${
                              isActive
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {canDeleteGroup && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenDeleteModal();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Trash weight="bold" className="w-4 h-4" />
                  Giải tán nhóm
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
