'use client';
import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin.service';
import { AdminUserRecord } from '@/types/admin';
import { Button } from '@/components/ui/Button';

export function UserManagement() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (user: AdminUserRecord) => {
    await AdminService.toggleUserStatus(user.id, user.status);
    alert(`Mock: Trạng thái tài khoản của ${user.fullName} đã bị thay đổi.`);
    fetchUsers();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    await AdminService.updateUserRole(userId, newRole);
    alert('Mock: Đã cập nhật quyền thành công!');
    fetchUsers();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50 transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Quản lý Người dùng & Phân quyền</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Tìm kiếm, xử lý vi phạm và thiết lập vai trò người dùng</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
          <thead className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 text-gray-900 dark:text-gray-200 font-bold uppercase text-xs tracking-wider transition-colors duration-300">
            <tr>
              <th className="px-6 py-5">Tên</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Ngày tham gia</th>
              <th className="px-6 py-5">Vai trò</th>
              <th className="px-6 py-5">Trạng thái</th>
              <th className="px-6 py-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors duration-300">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white transition-colors duration-300">{user.fullName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 font-medium">{new Date(user.joinedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-0 transition-colors duration-300 ${
                        user.role === 'ADMIN' ? 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30' :
                        user.role === 'LECTURER' ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' :
                        user.role === 'CONTENT_MANAGER' ? 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30' :
                        'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                      }`}
                    >
                      <option value="STUDENT">Sinh viên</option>
                      <option value="LECTURER">Giảng viên</option>
                      <option value="CONTENT_MANAGER">Kiểm duyệt viên</option>
                      <option value="ADMIN">Quản trị viên</option>
                    </select>
                </td>
                <td className="px-6 py-4">
                  {user.status === 'ACTIVE' ? (
                    <span className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-md text-xs font-bold border border-green-100 dark:border-green-800/50 inline-block w-[75px] text-center transition-colors duration-300">Hoạt động</span>
                  ) : (
                    <span className="text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2.5 py-1 rounded-md text-xs font-bold border border-red-100 dark:border-red-800/50 inline-block w-[75px] text-center transition-colors duration-300">Đình chỉ</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className={`font-semibold transition-colors duration-300 ${user.status === 'ACTIVE' ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 dark:border-red-800' : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 dark:border-green-800'}`}
                    onClick={() => handleToggle(user)}
                  >
                    {user.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
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
