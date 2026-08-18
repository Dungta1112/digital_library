'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import {
  Bell,
  Clock,
  ShieldCheck,
  SignOut,
  User,
} from '@phosphor-icons/react';

export function AdminHeader() {
  const pathname = usePathname() || '/admin/dashboard';
  const { user, logout } = useAuth();

  const routeNames: Record<string, string> = {
    '/admin': 'Bảng điều khiển',
    '/admin/dashboard': 'Bảng điều khiển & Thống kê',
    '/admin/documents': 'Quản lý Kho tài liệu số',
    '/admin/moderation': 'Hàng đợi Kiểm duyệt tài liệu',
    '/admin/users': 'Quản lý Người dùng & Phân quyền RBAC',
    '/admin/system': 'Cấu hình Hệ thống & Tham số AI',
  };

  const currentTitle = routeNames[pathname] || 'Quản trị hệ thống';

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 sm:px-8 backdrop-blur-md">
      {/* Left: Breadcrumbs & Current Page Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span>Quản trị</span>
          <span>/</span>
          <span className="text-white font-bold">{currentTitle}</span>
        </div>
      </div>

      {/* Right: Actions, System Status & Admin Profile */}
      <div className="flex items-center gap-4">
        {/* System Online Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 text-[11px] font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Hệ thống hoạt động 24/7</span>
        </div>

        <ThemeToggle />

        {/* Admin User Badge */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="hidden md:flex flex-col text-right leading-tight">
            <span className="text-xs font-bold text-white truncate max-w-[140px]">
              {user?.fullName || 'Quản trị viên'}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              ADMIN
            </span>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-bold text-xs text-white shadow-md shadow-blue-600/30">
            {user?.fullName?.charAt(0).toUpperCase() || 'A'}
          </div>

          <button
            onClick={() => logout()}
            title="Đăng xuất"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
          >
            <SignOut weight="bold" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
