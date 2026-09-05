'use client';

import React, { useEffect, useState } from 'react';
import type { User } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { ProfileService } from '@/services/profile.service';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Camera,
  PencilSimple,
  Check,
  X,
  GraduationCap,
  ShieldCheck,
  ChalkboardTeacher,
  Student,
  ChatCircleText,
  UploadSimple,
} from '@phosphor-icons/react';

interface ProfileHeroProps {
  user: User;
  onOpenAvatarPicker: () => void;
  onOpenForumComposer: () => void;
  onOpenDocumentUpload: () => void;
}

export function ProfileHero({
  user,
  onOpenAvatarPicker,
  onOpenForumComposer,
  onOpenDocumentUpload,
}: ProfileHeroProps) {
  const { updateUser } = useAuth();

  const [isEditingName, setIsEditingName] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(user.fullName);
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState('');

  /* eslint-disable react-hooks/set-state-in-effect -- reflect the latest server-confirmed profile */
  useEffect(() => {
    setFullNameInput(user.fullName);
  }, [user.fullName]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const canUpload = user.role === 'LECTURER' || user.role === 'ADMIN';

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Quản trị viên',
          icon: <ShieldCheck weight="bold" className="w-4 h-4" />,
          classes: 'bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50',
        };
      case 'LECTURER':
        return {
          label: 'Giảng viên',
          icon: <ChalkboardTeacher weight="bold" className="w-4 h-4" />,
          classes: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
        };
      case 'CONTENT_MANAGER':
        return {
          label: 'Kiểm duyệt viên',
          icon: <GraduationCap weight="bold" className="w-4 h-4" />,
          classes: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50',
        };
      default:
        return {
          label: 'Sinh viên',
          icon: <Student weight="bold" className="w-4 h-4" />,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
        };
    }
  };

  const roleInfo = getRoleBadge(user.role);

  const handleSaveName = async () => {
    if (!fullNameInput.trim()) {
      setNameError('Họ và tên không được để trống.');
      return;
    }
    if (fullNameInput.trim().length > 120) {
      setNameError('Họ và tên không được vượt quá 120 ký tự.');
      return;
    }
    setSavingName(true);
    setNameError('');
    try {
      const updated = await ProfileService.updateProfile({ fullName: fullNameInput.trim() });
      updateUser(updated);
      setIsEditingName(false);
    } catch (e: unknown) {
      setNameError(e instanceof Error ? e.message : 'Không thể lưu tên mới.');
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setFullNameInput(user.fullName);
    setNameError('');
    setIsEditingName(false);
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
      {/* 1. Academic Gradient Cover */}
      <div className="relative h-36 sm:h-48 w-full bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-200/80 uppercase tracking-widest bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
            Hồ sơ học thuật cá nhân
          </span>
        </div>
      </div>

      {/* 2. Hero Body */}
      <div className="px-6 sm:px-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-14 sm:-mt-16 relative z-10">
          
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* Avatar with Change Button */}
            <div className="relative group shrink-0">
              <div className="p-1 rounded-[2.2rem] bg-white dark:bg-slate-900 shadow-xl">
                <UserAvatar
                  avatarUrl={user.avatarUrl}
                  name={user.fullName}
                  size="2xl"
                  className="rounded-[2rem]"
                />
              </div>
              <button
                type="button"
                onClick={onOpenAvatarPicker}
                className="absolute bottom-2 right-2 p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all group-hover:ring-4 group-hover:ring-emerald-500/20"
                title="Đổi ảnh đại diện"
                aria-label="Đổi ảnh đại diện"
              >
                <Camera weight="bold" className="w-4 h-4" />
              </button>
            </div>

            {/* Name, Email, Role */}
            <div className="min-w-0 space-y-1.5 pb-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                      disabled={savingName}
                      maxLength={120}
                      aria-label="Họ và tên"
                      className="h-10 text-base font-bold max-w-xs rounded-xl"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={savingName || !fullNameInput.trim()}
                      className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
                      title="Lưu họ tên"
                    >
                      <Check weight="bold" className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={savingName}
                      className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
                      title="Hủy"
                    >
                      <X weight="bold" className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate max-w-md">
                      {user.fullName}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Chỉnh sửa họ tên"
                      aria-label="Chỉnh sửa họ tên"
                    >
                      <PencilSimple weight="bold" className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {nameError && (
                <p role="alert" className="text-xs font-semibold text-red-500">{nameError}</p>
              )}

              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                {user.email}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs uppercase tracking-wider ${roleInfo.classes}`}>
                  {roleInfo.icon}
                  {roleInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 shrink-0 pt-2 md:pt-0">
            <Button
              type="button"
              onClick={onOpenForumComposer}
              className="h-10 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95 transition-all flex items-center gap-2"
            >
              <ChatCircleText weight="bold" className="w-4 h-4" />
              Đăng bài diễn đàn
            </Button>

            {canUpload && (
              <Button
                type="button"
                variant="secondary"
                onClick={onOpenDocumentUpload}
                className="h-10 px-4 rounded-xl font-bold text-xs border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs flex items-center gap-2"
              >
                <UploadSimple weight="bold" className="w-4 h-4 text-emerald-600" />
                Đăng tài liệu
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
