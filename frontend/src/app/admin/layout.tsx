'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { ShieldWarning } from '@phosphor-icons/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      // Optional auto-redirect if not logged in or not admin
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-blue-500 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-400">Đang xác thực quyền Quản trị...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-6 text-white">
        <div className="max-w-md rounded-3xl border border-red-800/60 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/80 text-red-400 border border-red-800/60">
            <ShieldWarning weight="duotone" className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white">Không Có Quyền Truy Cập</h2>
          <p className="mb-6 text-xs text-slate-400 leading-relaxed">
            Khu vực này chỉ dành cho tài khoản có vai trò <strong className="text-emerald-400">ADMIN</strong> của Trường Đại học Trưng Vương.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
          >
            Trở về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* 1. Left Fixed Sidebar */}
      <AdminSidebar />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col pl-64 min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
