'use client';
import React from 'react';
import { AdminUserRecord } from '@/types/admin';
import { Button } from '@/components/ui/Button';
import { AdminService } from '@/services/admin.service';

export function StatCard({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-semibold mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value.toLocaleString()}</h3>
      </div>
    </div>
  );
}

export function UserTable({ users, onUpdate }: { users: AdminUserRecord[], onUpdate: () => void }) {
  const handleToggle = async (user: AdminUserRecord) => {
    // Optimistically update in a real app, or refetch
    await AdminService.toggleUserStatus(user.id, user.status);
    // Since we're using mock JSON, changes won't persist across reloads unless we use localStorage.
    // We'll just alert for the MVP demo.
    alert(`Mock: Đã thay đổi trạng thái người dùng. (Trong môi trường thực, trạng thái sẽ chuyển thành ${user.status === 'ACTIVE' ? 'ĐÌNH CHỈ' : 'HOẠT ĐỘNG'})`);
    onUpdate();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-900 font-bold uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-5">Tên</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Vai trò</th>
              <th className="px-6 py-5">Ngày tham gia</th>
              <th className="px-6 py-5">Trạng thái</th>
              <th className="px-6 py-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{user.fullName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider uppercase ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'FACULTY' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{new Date(user.joinedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {user.status === 'ACTIVE' ? (
                    <span className="text-green-700 bg-green-50 px-2.5 py-1 rounded-md text-xs font-bold flex items-center w-max gap-1.5 border border-green-100 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Hoạt động
                    </span>
                  ) : (
                    <span className="text-red-700 bg-red-50 px-2.5 py-1 rounded-md text-xs font-bold flex items-center w-max gap-1.5 border border-red-100 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Đình chỉ
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className={`font-semibold ${user.status === 'ACTIVE' ? 'hover:text-red-600 hover:border-red-300' : 'hover:text-green-600 hover:border-green-300'}`}
                    onClick={() => handleToggle(user)}
                  >
                    {user.status === 'ACTIVE' ? 'Đình chỉ' : 'Kích hoạt'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
