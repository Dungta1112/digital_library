'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/services/api.client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LockKey, Info } from '@phosphor-icons/react';

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
    return <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-950">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-8 pb-16 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="mb-10 mt-6">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 transition-colors duration-300">Cài đặt</h1>
          <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Quản lý bảo mật và tùy chọn tài khoản</p>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8 mb-6 transition-colors duration-300">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 transition-colors duration-300">
            <LockKey weight="duotone" className="w-6 h-6 text-emerald-600 dark:text-emerald-500" /> 
            Đổi mật khẩu
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Mật khẩu hiện tại</label>
              <Input 
                type="password" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Mật khẩu mới</label>
              <Input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="Ít nhất 8 ký tự" 
                className="w-full h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Xác nhận mật khẩu mới</label>
              <Input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="Nhập lại mật khẩu mới" 
                className="w-full h-12 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
              />
            </div>
          </div>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-sm font-medium border ${message.startsWith('Lỗi') ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50' : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50'} transition-colors duration-300`}>
              {message}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button onClick={handleChangePassword} disabled={saving} className="font-semibold shadow-sm bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-8 h-12 active:scale-[0.98] transition-all">
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8 transition-colors duration-300">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 transition-colors duration-300">
            <Info weight="duotone" className="w-6 h-6 text-emerald-600 dark:text-emerald-500" /> 
            Thông tin hệ thống
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Email liên kết</span>
              <span className="text-slate-900 dark:text-white font-semibold">{user.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Quyền hạn</span>
              <span className="text-slate-900 dark:text-white font-semibold">
                {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'LECTURER' ? 'Giảng viên' : user.role === 'CONTENT_MANAGER' ? 'Kiểm duyệt viên' : 'Sinh viên'}
              </span>
            </div>
            <div className="flex justify-between py-3 transition-colors duration-300">
              <span className="text-slate-500 dark:text-slate-400 font-medium">ID tài khoản</span>
              <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">{user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
