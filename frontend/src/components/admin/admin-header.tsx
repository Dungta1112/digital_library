'use client';

import Link from 'next/link';
import { House, SignOut, List } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
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
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 sm:px-8 backdrop-blur-md">
      {/* Left: Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-4 sm:gap-6">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
            title="Mở menu quản trị"
          >
            <List weight="bold" className="h-5 w-5" />
          </button>
        )}

        {/* Return to Public Site button */}
        <Link href="/" title="Quay lại trang người dùng" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
          <House weight="duotone" className="h-5 w-5 text-emerald-400" />
          <span className="hidden sm:inline">Trang người dùng</span>
        </Link>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-400 border-l border-slate-800 pl-4 sm:pl-6">
          <span className="hidden md:inline">Quản trị</span>
          <span className="hidden md:inline">/</span>
          <span className="text-white font-bold truncate max-w-[160px] sm:max-w-none">{currentTitle}</span>
        </div>
      </div>

      {/* Right: Theme Toggle & Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />

        {/* Admin User Badge */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-3 sm:pl-4">
          <div className="hidden md:flex flex-col text-right leading-tight">
            <span className="text-xs font-bold text-white truncate max-w-[140px]">
              {user?.fullName || 'Quản trị viên'}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              {user?.role || 'ADMIN'}
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
