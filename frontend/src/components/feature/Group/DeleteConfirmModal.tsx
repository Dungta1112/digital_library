'use client';

import React, { useState } from 'react';
import { StudyGroup } from '@/types/group';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Warning, Trash, X } from '@phosphor-icons/react';

interface DeleteConfirmModalProps {
  group: StudyGroup;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeleteConfirmModal({
  group,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) {
  const [typedName, setTypedName] = useState('');
  const isMatch = typedName.trim().toLowerCase() === group.name.trim().toLowerCase();

  if (!isOpen) return null;

  const handleClose = () => {
    if (loading) return;
    setTypedName('');
    onClose();
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch || loading) return;
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900 transition-all">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X weight="bold" className="h-5 w-5" />
        </button>

        {/* Warning Icon */}
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 ring-8 ring-red-50/50 dark:ring-red-900/20">
          <Warning weight="duotone" className="h-8 w-8" />
        </div>

        {/* Title & Warning description */}
        <h3 className="mb-2 text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Giải tán phòng học nhóm?
        </h3>
        <p className="mb-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Nhóm học tập <strong className="text-slate-900 dark:text-white">&ldquo;{group.name}&rdquo;</strong> sẽ được chuyển sang trạng thái ngừng hoạt động và không còn xuất hiện trong danh sách nhóm. Các tài liệu gốc trên Thư viện số của trường vẫn được lưu trữ an toàn.
        </p>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Nhập tên nhóm để xác nhận: <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold select-all">&ldquo;{group.name}&rdquo;</span>
            </label>
            <Input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Nhập chính xác tên nhóm..."
              disabled={loading}
              className="h-11 w-full rounded-xl text-sm"
              autoFocus
            />
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto h-11 px-5 rounded-xl font-semibold"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={!isMatch || loading}
              className="w-full sm:w-auto h-11 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Trash weight="bold" className="h-4 w-4" />
              {loading ? 'Đang giải tán...' : 'Xác nhận giải tán nhóm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
