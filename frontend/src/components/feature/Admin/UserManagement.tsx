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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900">Quản lý Người dùng & Phân quyền</h2>
        <div className="text-sm text-gray-500">Tìm kiếm, xử lý vi phạm và thiết lập vai trò người dùng</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-white border-b border-gray-200 text-gray-900 font-bold uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-5">Tên</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Ngày tham gia</th>
              <th className="px-6 py-5">Vai trò</th>
              <th className="px-6 py-5">Trạng thái</th>
              <th className="px-6 py-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{user.fullName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 font-medium">{new Date(user.joinedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-0 ${
                        user.role === 'ADMIN' ? 'text-purple-700 bg-purple-50' :
                        user.role === 'LECTURER' ? 'text-blue-700 bg-blue-50' :
                        user.role === 'CONTENT_MANAGER' ? 'text-yellow-700 bg-yellow-50' :
                        'text-green-700 bg-green-50'
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
                    <span className="text-green-700 bg-green-50 px-2.5 py-1 rounded-md text-xs font-bold border border-green-100 inline-block w-[75px] text-center">Hoạt động</span>
                  ) : (
                    <span className="text-red-700 bg-red-50 px-2.5 py-1 rounded-md text-xs font-bold border border-red-100 inline-block w-[75px] text-center">Đình chỉ</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className={`font-semibold ${user.status === 'ACTIVE' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
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
