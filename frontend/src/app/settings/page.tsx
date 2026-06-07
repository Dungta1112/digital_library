'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/services/api.client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Lỗi: Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.length < 8) {
      setMessage('Lỗi: Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      await apiClient.patch('/users/me/password', { currentPassword, newPassword });
      setMessage('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setMessage('Lỗi: ' + (e.message || 'Không thể đổi mật khẩu'));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-8 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="mb-10 mt-6">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Cài đặt</h1>
          <p className="text-gray-500">Quản lý bảo mật và tùy chọn tài khoản</p>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-xl">🔒</span> Đổi mật khẩu
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
              <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu mới</label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Ít nhất 8 ký tự" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Xác nhận mật khẩu mới</label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu mới" />
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${message.startsWith('Lỗi') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}

          <div className="mt-6">
            <Button onClick={handleChangePassword} disabled={saving} className="font-bold shadow-md">
              {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">ℹ️</span> Thông tin tài khoản
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Email</span>
              <span className="text-gray-900 font-semibold">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Vai trò</span>
              <span className="text-gray-900 font-semibold">
                {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'LECTURER' ? 'Giảng viên' : user.role === 'CONTENT_MANAGER' ? 'Kiểm duyệt viên' : 'Sinh viên'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 font-medium">ID tài khoản</span>
              <span className="text-gray-400 font-mono text-xs">{user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
