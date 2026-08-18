'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartPieSlice,
  Books,
  ShieldCheck,
  UsersThree,
  SlidersHorizontal,
  ArrowSquareOut,
  House,
  Sparkle,
} from '@phosphor-icons/react';

export function AdminSidebar() {
  const pathname = usePathname() || '/admin';

  const menuItems = [
    {
      label: 'Tổng quan (Dashboard)',
      href: '/admin/dashboard',
      icon: ChartPieSlice,
      badge: 'Real-time',
    },
    {
      label: 'Kho tài liệu (Documents)',
      href: '/admin/documents',
      icon: Books,
    },
    {
      label: 'Kiểm duyệt (Moderation)',
      href: '/admin/moderation',
      icon: ShieldCheck,
    },
    {
      label: 'Người dùng & RBAC',
      href: '/admin/users',
      icon: UsersThree,
    },
    {
      label: 'Cấu hình AI & Hệ thống',
      href: '/admin/system',
      icon: SlidersHorizontal,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-200 transition-all duration-300">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-red-500/30 overflow-hidden shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/trung-vuong-university-logo.svg"
              alt="Đại học Trưng Vương"
              width={34}
              height={34}
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">
              Đại học Trưng Vương
            </span>
            <span className="text-sm font-extrabold text-white">
              Cổng Quản Trị <span className="text-cyan-400">Admin</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-300 mb-3">
          Phân hệ quản trị
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
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
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="rounded bg-emerald-950/80 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-800/50">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Footer Actions */}
      <div className="border-t border-slate-800/80 p-4 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          <div className="flex items-center gap-2.5">
            <House weight="duotone" className="h-4 w-4 text-emerald-400" />
            <span>Về Trang người dùng</span>
          </div>
          <ArrowSquareOut weight="bold" className="h-3.5 w-3.5 text-slate-400" />
        </Link>
      </div>
    </aside>
  );
}
