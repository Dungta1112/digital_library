'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Warning, Trash, X } from '@phosphor-icons/react';
import { useDialogAccessibility } from '@/hooks/useDialogAccessibility';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean | void>;
  title?: string;
  itemName?: string;
  description?: string;
  loading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa dữ liệu',
  itemName,
  description = 'Khi xóa, dữ liệu sẽ bị gỡ vĩnh viễn khỏi hệ thống và không thể khôi phục.',
  loading = false,
}: DeleteConfirmModalProps) {
  const dialogRef = useDialogAccessibility<HTMLDivElement>(isOpen, onClose, loading);
  if (!isOpen) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const result = await onConfirm();
    if (result !== false) onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-confirm-title">
        {/* Backdrop */}
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!loading ? onClose : undefined}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-2xl z-10 outline-none"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Đóng hộp thoại xác nhận"
          >
            <X weight="bold" className="h-4 w-4" />
          </button>

          {/* Warning Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-950/60 text-red-400 border border-red-800/60">
            <Warning weight="duotone" className="h-6 w-6" />
          </div>

          <h3 id="delete-confirm-title" className="mb-2 text-lg font-bold text-white tracking-tight">
            {title}
          </h3>

          {itemName && (
            <p className="mb-2 text-xs font-semibold text-red-300 bg-red-950/30 p-2.5 rounded-xl border border-red-900/40 line-clamp-2">
              &ldquo;{itemName}&rdquo;
            </p>
          )}

          <p className="mb-6 text-xs leading-relaxed text-slate-400">
            {description}
          </p>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              aria-busy={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-600/30 hover:bg-red-500 disabled:opacity-50 transition-colors"
            >
              <Trash weight="bold" className="h-3.5 w-3.5" />
              {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export const DeleteModal = DeleteConfirmModal;
