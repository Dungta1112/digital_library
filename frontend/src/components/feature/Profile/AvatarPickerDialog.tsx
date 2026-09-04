'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { ProfileService } from '@/services/profile.service';
import { AVATAR_PRESETS, getFullAvatarUrl } from '@/data/avatar-catalog';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Button } from '@/components/ui/Button';
import type { AvatarTheme } from '@/types/profile';
import {
  X,
  Check,
  Sparkle,
  WarningCircle,
  CheckCircle,
  UserSwitch,
  Palette,
} from '@phosphor-icons/react';

interface AvatarPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const THEME_TABS: { key: 'all' | AvatarTheme; label: string }[] = [
  { key: 'all', label: 'Tất cả (16)' },
  { key: 'emerald', label: 'Nghiên cứu' },
  { key: 'navy', label: 'Công nghệ' },
  { key: 'amber', label: 'Giảng dạy' },
  { key: 'violet', label: 'AI & Toán học' },
];

export function AvatarPickerDialog({
  isOpen,
  onClose,
  onSuccess,
}: AvatarPickerDialogProps) {
  const { user, updateUser, refreshUser } = useAuth();

  const [selectedUrl, setSelectedUrl] = useState<string | null>(() => user?.avatarUrl || null);
  const [activeTheme, setActiveTheme] = useState<'all' | AvatarTheme>('all');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !user) return null;

  const filteredPresets = activeTheme === 'all'
    ? AVATAR_PRESETS
    : AVATAR_PRESETS.filter((p) => p.theme === activeTheme);

  const isInitialsSelected = selectedUrl === null || selectedUrl === '';

  const handleSelectPreset = (url: string) => {
    setSelectedUrl(url);
    setErrorMsg('');
  };

  const handleSelectInitials = () => {
    setSelectedUrl('');
    setErrorMsg('');
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Backend UpdateProfileDto uses @IsUrl().
      // If user chose a preset, construct absolute URL if needed.
      let finalAvatarUrl: string | undefined = undefined;

      if (selectedUrl && selectedUrl.trim() !== '') {
        finalAvatarUrl = getFullAvatarUrl(selectedUrl);
      }

      const updatedUser = await ProfileService.updateProfile({
        avatarUrl: finalAvatarUrl,
      });

      // Update Auth context
      updateUser({ avatarUrl: updatedUser.avatarUrl });
      await refreshUser();

      setSuccessMsg('Đã cập nhật ảnh đại diện thành công!');

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể lưu ảnh đại diện. Vui lòng thử lại sau.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-picker-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Palette weight="duotone" className="w-5 h-5" />
            </div>
            <div>
              <h2 id="avatar-picker-title" className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Chọn ảnh đại diện học thuật
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                16 biểu tượng bản quyền phong cách Đại học Trưng Vương
              </p>
            </div>
          </div>
          <button
            onClick={() => !saving && onClose()}
            disabled={saving}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            aria-label="Đóng hộp thoại"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 text-xs font-semibold border border-red-200/60 dark:border-red-900/50">
              <WarningCircle weight="fill" className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-900/50">
              <CheckCircle weight="fill" className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Live Preview Card */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800">
            <div className="relative">
              <UserAvatar
                avatarUrl={selectedUrl}
                name={user.fullName}
                size="xl"
                className="ring-4 ring-emerald-500/20 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full shadow-xs">
                <Sparkle weight="fill" className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-center sm:text-left min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Xem trước ảnh đại diện
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {user.fullName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isInitialsSelected
                  ? 'Đang chọn: Chữ cái tên viết tắt mặc định'
                  : `Đang chọn: ${AVATAR_PRESETS.find((p) => p.url === selectedUrl)?.name || 'Ảnh tùy chọn'}`}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSelectInitials}
              className={`text-xs font-bold rounded-xl border ${isInitialsSelected ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <UserSwitch weight="bold" className="w-4 h-4 mr-1.5" />
              Dùng chữ cái tên
            </Button>
          </div>

          {/* Theme Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {THEME_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTheme(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTheme === tab.key
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Avatar Grid (16 items) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {filteredPresets.map((preset) => {
              const isSelected = selectedUrl === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`group relative flex flex-col items-center p-3 rounded-2xl border transition-all text-left ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-xs mb-2 transition-transform group-hover:scale-105">
                    <Image
                      src={preset.url}
                      alt={preset.alt}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Check weight="bold" className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 text-center line-clamp-1 w-full">
                    {preset.name}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 text-center">
                    {preset.themeLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            🔒 Ảnh đại diện được lưu an toàn vào tài khoản
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
              className="px-5 rounded-xl font-semibold text-xs border-slate-200 dark:border-slate-800"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95 transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu ảnh đại diện'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
