'use client';

import React, { useEffect, useState } from 'react';
import { X } from '@phosphor-icons/react';
import { useDialogAccessibility } from '@/hooks/useDialogAccessibility';

interface TextActionDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (value: string) => Promise<boolean | void>;
}

export function TextActionDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  loading = false,
  onClose,
  onConfirm,
}: TextActionDialogProps) {
  const [value, setValue] = useState('');
  const dialogRef = useDialogAccessibility<HTMLDivElement>(isOpen, onClose, loading);

  /* eslint-disable react-hooks/set-state-in-effect -- each action starts with a blank user-entered note */
  useEffect(() => {
    if (isOpen) setValue('');
  }, [isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="text-action-title" className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl outline-none">
        <button type="button" onClick={onClose} disabled={loading} aria-label="Đóng hộp thoại" className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <h2 id="text-action-title" className="pr-10 text-lg font-bold">{title}</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">{description}</p>
        <form
          className="mt-5 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const trimmed = value.trim();
            if (!trimmed || loading) return;
            const result = await onConfirm(trimmed);
            if (result !== false) onClose();
          }}
        >
          <label htmlFor="action-note" className="block text-xs font-bold text-slate-300">Ghi chú bắt buộc</label>
          <textarea id="action-note" value={value} onChange={(event) => setValue(event.target.value)} disabled={loading} required rows={4} className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300">Hủy</button>
            <button type="submit" disabled={loading || !value.trim()} aria-busy={loading} className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{loading ? 'Đang xử lý...' : confirmLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
