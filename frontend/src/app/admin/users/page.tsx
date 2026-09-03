'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin.service';
import type { AdminUserRecord, RoleOption } from '@/types/admin';
import {
  MagnifyingGlass,
  Lock,
  LockOpen,
  CheckCircle,
} from '@phosphor-icons/react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([AdminService.getUsers(), AdminService.getRoles()])
      .then(([userData, rolesData]) => {
        if (active) {
          setUsers(userData);
          setRoles(rolesData);
        }
      })
      .catch((e) => {
        console.error('Lỗi tải danh sách người dùng:', e);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    setUpdatingId(userId);
    try {
      await AdminService.updateUserRole(userId, newRoleId);
      const roleObj = roles.find((r) => r.id === newRoleId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: roleObj?.code || u.role } : u))
      );
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Không thể đổi vai trò người dùng.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleLock = async (user: AdminUserRecord) => {
    setUpdatingId(user.id);
    const isLocked = user.status === 'LOCKED';
    try {
      if (isLocked) {
        await AdminService.unlockUser(user.id);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: 'ACTIVE' } : u))
        );
      } else {
        await AdminService.lockUser(user.id);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: 'LOCKED' } : u))
        );
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Lỗi thay đổi trạng thái khóa.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Quản Lý Người Dùng & Phân Quyền RBAC
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Xem danh sách tài khoản, phân quyền vai trò (Admin, Giảng viên, Sinh viên) và quản lý trạng thái hoạt động.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 shadow-md">
        <div className="relative flex-1 w-full">
          <MagnifyingGlass weight="bold" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo họ tên hoặc địa chỉ email..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-48 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên (ADMIN)</option>
          <option value="LECTURER">Giảng viên (LECTURER)</option>
          <option value="STUDENT">Sinh viên (STUDENT)</option>
          <option value="CONTENT_MANAGER">Kiểm duyệt viên (CONTENT_MGR)</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">Thành Viên</th>
                <th className="px-5 py-4">Địa Chỉ Email</th>
                <th className="px-5 py-4">Phân Quyền Vai Trò</th>
                <th className="px-5 py-4">Trạng Thái</th>
                <th className="px-5 py-4">Ngày Tham Gia</th>
                <th className="px-5 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-bold text-xs text-white">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 font-mono">
                      {user.email}
                    </td>
                    <td className="px-5 py-4">
                      {roles.length > 0 ? (
                        <select
                          value={roles.find((r) => r.code === user.role)?.id || user.role}
                          disabled={updatingId === user.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 focus:border-blue-500 focus:outline-none disabled:opacity-50"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name} ({role.code})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-semibold">{user.role}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {user.status === 'LOCKED' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-950/80 px-2.5 py-1 text-[10px] font-bold text-red-400 border border-red-800/60">
                          <Lock weight="fill" className="h-3 w-3" />
                          Đã khóa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-800/60">
                          <CheckCircle weight="fill" className="h-3 w-3" />
                          Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {user.createdAt}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleToggleLock(user)}
                        disabled={updatingId === user.id}
                        className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-50 ${
                          user.status === 'LOCKED'
                            ? 'bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/60'
                            : 'bg-red-950/80 border border-red-800/60 text-red-400 hover:bg-red-900/60'
                        }`}
                      >
                        {user.status === 'LOCKED' ? (
                          <>
                            <LockOpen weight="bold" className="h-3 w-3" />
                            Mở khóa
                          </>
                        ) : (
                          <>
                            <Lock weight="bold" className="h-3 w-3" />
                            Khóa tài khoản
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
