'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/services/api-client';
import { LibraryService } from '@/services/library.service';
import type { Category } from '@/types/library';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  X, 
  UploadSimple, 
  FilePdf, 
  CheckCircle, 
  WarningCircle, 
  Trash,
  FolderOpen
} from '@phosphor-icons/react';

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UploadDocumentDialog({
  isOpen,
  onClose,
  onSuccess,
}: UploadDocumentDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories
  useEffect(() => {
    if (isOpen) {
      LibraryService.getCategories()
        .then((cats) => setCategories(cats || []))
        .catch(() => setCategories([]));
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      setErrorMsg('Chỉ chấp nhận tệp định dạng PDF.');
      setFile(null);
      return;
    }

    setFile(selected);
    setErrorMsg('');
    if (!title.trim()) {
      // Auto-populate title from file name without extension
      const baseName = selected.name.replace(/\.[^/.]+$/, '');
      setTitle(baseName);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề tài liệu.');
      return;
    }
    if (title.trim().length > 255) {
      setErrorMsg('Tiêu đề tài liệu không được vượt quá 255 ký tự.');
      return;
    }
    if (!file) {
      setErrorMsg('Vui lòng chọn tệp tài liệu PDF để tải lên.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      if (categoryId) {
        formData.append('categoryId', categoryId);
      }
      formData.append('file', file);

      // Post to lecturer upload endpoint
      await apiClient.post('/lecturer/documents', formData);

      setSuccessMsg('Tải lên thành công! Tài liệu đang chờ duyệt (PENDING_REVIEW).');

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        // Reset form & close
        setTitle('');
        setDescription('');
        setCategoryId('');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể tải lên tài liệu. Vui lòng thử lại sau.'
      );
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-doc-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <UploadSimple weight="bold" className="w-5 h-5" />
            </div>
            <div>
              <h2 id="upload-doc-title" className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Đăng tải tài liệu học thuật
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dành cho Giảng viên & Quản trị viên đóng góp giáo trình, bài giảng
              </p>
            </div>
          </div>
          <button
            onClick={() => !uploading && onClose()}
            disabled={uploading}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            aria-label="Đóng hộp thoại"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(85vh-120px)] overflow-y-auto custom-scrollbar">
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

          {/* PDF File Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tệp tài liệu PDF <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="doc-file-input"
              disabled={uploading}
            />

            {!file ? (
              <label
                htmlFor="doc-file-input"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-slate-950/40 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FilePdf weight="duotone" className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nhấp để chọn tệp PDF từ máy tính
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Định dạng hỗ trợ: PDF (tối đa 50MB)
                </span>
              </label>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 rounded-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <FilePdf weight="fill" className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={uploading}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  aria-label="Xóa tệp đã chọn"
                >
                  <Trash weight="bold" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="doc-title" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Tiêu đề tài liệu <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] font-medium ${title.length > 255 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {title.length}/255
              </span>
            </div>
            <Input
              id="doc-title"
              type="text"
              placeholder="Ví dụ: Giáo trình Cấu trúc dữ liệu và Giải thuật"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
              className="rounded-2xl border-slate-200 dark:border-slate-800 text-sm font-medium"
              maxLength={255}
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-1.5">
            <label htmlFor="doc-category" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FolderOpen weight="duotone" className="w-4 h-4 text-emerald-600" />
              Chuyên mục / Ngành học
            </label>
            <select
              id="doc-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={uploading}
              className="w-full h-11 px-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            >
              <option value="">-- Chọn chuyên mục (Tùy chọn) --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="doc-desc" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Mô tả tóm tắt (Tùy chọn)
            </label>
            <textarea
              id="doc-desc"
              rows={3}
              placeholder="Tóm tắt ngắn gọn mục tiêu, nội dung kiến thức của tài liệu này..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none transition-all font-normal"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">
              📋 Tài liệu sau khi đăng sẽ ở trạng thái Chờ duyệt
            </span>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={uploading}
                className="px-5 rounded-xl font-semibold text-xs border-slate-200 dark:border-slate-800"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={uploading || !title.trim() || !file}
                className="px-6 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95 transition-all flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <UploadSimple weight="bold" className="w-4 h-4" />
                    Tải lên tài liệu
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
