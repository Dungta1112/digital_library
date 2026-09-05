'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { AdminService } from '@/services/admin.service';
import type { SystemStats, AdminDocRecord } from '@/types/admin';
import {
  Books,
  UsersThree,
  Eye,
  ChatCircleText,
  ShieldCheck,
  ArrowRight,
  Sparkle,
} from '@phosphor-icons/react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalDocuments: 0,
    totalGroups: 0,
    activeUsersToday: 0,
  });
  const [pendingDocs, setPendingDocs] = useState<AdminDocRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadDashboardData() {
      setLoading(true);
      setError('');
      try {
        const [statsData, pendingData] = await Promise.all([
          AdminService.getStats(controller.signal),
          AdminService.getPendingDocuments(controller.signal),
        ]);
        if (!controller.signal.aborted) {
          setStats(statsData);
          setPendingDocs(pendingData);
        }
      } catch (reason: unknown) {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'Không thể tải dữ liệu quản trị.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadDashboardData();
    return () => controller.abort();
  }, [reloadKey]);

  const isAdmin = user?.role === 'ADMIN';

  const statCards = [
    {
      title: 'Tổng Số Giáo Trình / Tài Liệu',
      value: stats.totalDocuments,
      subtext: 'Đã số hóa và kiểm duyệt',
      icon: Books,
      color: 'text-emerald-400',
      bg: 'from-emerald-950/40 to-slate-900 border-emerald-800/40',
      href: '/admin/documents',
      roles: ['ADMIN', 'CONTENT_MANAGER'],
    },
    {
      title: 'Tổng Người Dùng Học Tập',
      value: stats.totalUsers,
      subtext: 'Sinh viên, Giảng viên & Quản trị',
      icon: UsersThree,
      color: 'text-blue-400',
      bg: 'from-blue-950/40 to-slate-900 border-blue-800/40',
      href: '/admin/users',
      roles: ['ADMIN'],
    },
    {
      title: 'Lượt Xem & Đọc Tài Liệu',
      value: stats.activeUsersToday,
      subtext: 'Tổng lượt truy cập học thuật',
      icon: Eye,
      color: 'text-cyan-400',
      bg: 'from-cyan-950/40 to-slate-900 border-cyan-800/40',
      href: '/admin/documents',
      roles: ['ADMIN', 'CONTENT_MANAGER'],
    },
    {
      title: 'Nhóm Học Tập & Nghiên Cứu',
      value: stats.totalGroups,
      subtext: 'Không gian cộng tác học thuật',
      icon: ChatCircleText,
      color: 'text-amber-400',
      bg: 'from-amber-950/40 to-slate-900 border-amber-800/40',
      href: '/groups',
      roles: ['ADMIN', 'CONTENT_MANAGER'],
    },
  ].filter(card => card.roles.includes(user?.role || ''));

  return (
    <div className="space-y-8">
      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 rounded-2xl border border-red-900/60 bg-red-950/40 p-4 text-xs font-semibold text-red-300">
          <span>{error}</span>
          <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="shrink-0 font-bold underline">Thử lại</button>
        </div>
      )}
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/50 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-bold text-blue-400 mb-3">
              <Sparkle weight="fill" className="h-3.5 w-3.5 text-cyan-400" />
              Cổng Điều Hành Học Thuật Số
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bảng Điều Khiển Hệ Thống Quản Trị
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Giám sát tình trạng vận hành của Thư viện số Đại học Trưng Vương, phê duyệt tài liệu và phân quyền tài khoản người dùng.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/documents"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95"
            >
              <Books weight="bold" className="h-4 w-4" />
              Quản lý kho tài liệu
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Primary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className={`group flex flex-col justify-between rounded-3xl border bg-gradient-to-br p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${card.bg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner">
                    <Icon weight="duotone" className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <span className="text-slate-400 group-hover:text-white transition-colors">
                    <ArrowRight weight="bold" className="h-4 w-4" />
                  </span>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {card.title}
                </p>

                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                  {loading ? '...' : card.value}
                </p>
              </div>

              <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-white/5">
                {card.subtext}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Moderation Queue & System Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Moderation (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck weight="duotone" className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Hàng Đợi Kiểm Duyệt Tài Liệu</h3>
            </div>
            <Link
              href="/admin/moderation"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Xem tất cả ({pendingDocs.length}) →
            </Link>
          </div>

          {!loading && !error && pendingDocs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
              <ShieldCheck weight="fill" className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-200">Không có tài liệu nào đang chờ duyệt</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Mọi tài liệu gửi lên đã được xử lý hoàn tất.</p>
            </div>
          ) : !error && (
            <div className="space-y-3">
              {pendingDocs.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4 transition-colors hover:border-slate-700"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-bold text-white truncate">{doc.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Gửi bởi: <span className="text-slate-300 font-semibold">{doc.uploadedBy}</span> • {doc.uploadDate}
                    </p>
                  </div>
                  <Link
                    href="/admin/moderation"
                    className="rounded-xl bg-blue-600/20 border border-blue-500/40 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition-all flex-shrink-0"
                  >
                    Duyệt ngay
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Action Hub (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Thao Tác Quản Trị Nhanh</h3>
            <p className="text-xs text-slate-400 mb-5">Truy cập nhanh các chức năng nghiệp vụ trọng tâm</p>

            <div className="space-y-2.5">
              <Link
                href="/admin/documents"
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs font-semibold text-slate-200 hover:border-blue-500/50 hover:bg-slate-900 transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <Books weight="duotone" className="h-4 w-4 text-emerald-400" />
                  Quản lý Kho Tài liệu
                </span>
                <ArrowRight weight="bold" className="h-3.5 w-3.5 text-slate-400" />
              </Link>

              <Link
                href="/admin/moderation"
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs font-semibold text-slate-200 hover:border-blue-500/50 hover:bg-slate-900 transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck weight="duotone" className="h-4 w-4 text-amber-400" />
                  Hàng đợi Kiểm duyệt
                </span>
                <ArrowRight weight="bold" className="h-3.5 w-3.5 text-slate-400" />
              </Link>

              {isAdmin && (
                <>
                  <Link
                    href="/admin/users"
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs font-semibold text-slate-200 hover:border-blue-500/50 hover:bg-slate-900 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <UsersThree weight="duotone" className="h-4 w-4 text-blue-400" />
                      Phân quyền & Khóa tài khoản User
                    </span>
                    <ArrowRight weight="bold" className="h-3.5 w-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/admin/system"
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs font-semibold text-slate-200 hover:border-blue-500/50 hover:bg-slate-900 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <Books weight="duotone" className="h-4 w-4 text-cyan-400" />
                      Cấu hình Tham số Hệ thống
                    </span>
                    <ArrowRight weight="bold" className="h-3.5 w-3.5 text-slate-400" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
