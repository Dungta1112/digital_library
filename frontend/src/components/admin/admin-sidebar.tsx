'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChartPieSlice, Books, ShieldCheck, UsersThree, SlidersHorizontal, House, Sparkle } from '@phosphor-icons/react';

interface AdminSidebarProps {
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  collapsed: propCollapsed,
  setCollapsed: propSetCollapsed,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname() || '/admin';
  const { user } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('adminSidebarCollapsed') === 'true';
  });

  const collapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const setCollapsed = propSetCollapsed !== undefined ? propSetCollapsed : setInternalCollapsed;

  // Persist collapsed state when it changes
  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', String(collapsed));
  }, [collapsed]);

  const baseMenuItems = [
    {
      label: 'Tổng quan (Dashboard)',
      href: '/admin/dashboard',
      icon: ChartPieSlice,
      badge: 'Real-time',
      roles: ['ADMIN', 'CONTENT_MANAGER'],
    },
    {
      label: 'Kho tài liệu (Documents)',
      href: '/admin/documents',
      icon: Books,
      roles: ['ADMIN', 'CONTENT_MANAGER'],
    },
    {
      label: 'Kiểm duyệt (Moderation)',
      href: '/admin/moderation',
      icon: ShieldCheck,
      roles: ['ADMIN', 'CONTENT_MANAGER'],
    },
    {
      label: 'Người dùng & RBAC',
      href: '/admin/users',
      icon: UsersThree,
      roles: ['ADMIN'],
    },
    {
      label: 'Cấu hình AI & Hệ thống',
      href: '/admin/system',
      icon: SlidersHorizontal,
      roles: ['ADMIN'],
    },
  ];

  // Filter items strictly based on user role (deny if unknown)
  const userRole = user?.role || '';
  const menuItems = baseMenuItems.filter((item) => {
    const allowed = item.roles ?? [];
    return allowed.includes(userRole);
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800 bg-slate-950 text-slate-200 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm overflow-hidden shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/trung-vuong-university-logo.svg"
                alt="Đại học Trưng Vương"
                width={32}
                height={32}
                priority
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">
                  Đại học Trưng Vương
                </span>
                <span className="text-sm font-extrabold text-white">
                  Cổng Quản Trị <span className="text-cyan-400">Admin</span>
                </span>
              </div>
            )}
          </Link>
          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            className="hidden lg:block p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <Sparkle weight="duotone" className="h-5 w-5 text-slate-300" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-300 mb-3">
            {collapsed ? '' : 'Phân hệ quản trị'}
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    weight="duotone"
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {item.badge && !collapsed && (
                  <span className="rounded bg-emerald-950/80 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-800/50">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Footer Actions */}
        <div className="border-t border-slate-800/80 p-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <House weight="duotone" className="h-4 w-4 text-emerald-400" />
            <span>{collapsed ? '' : 'Về Trang người dùng'}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
