'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminService, AdminDocumentItem } from '@/services/admin.service';
import { LibraryService } from '@/services/library.service';
import {
  FilePdf,
  FileDoc,
  UploadSimple,
  X,
  CheckCircle,
  WarningCircle,
} from '@phosphor-icons/react';

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: AdminDocumentItem | null;
}

export function DocumentFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DocumentFormModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([
    { id: '7e67de22-d37c-4c50-8378-ba6890dcee3f', name: 'Khoa học Máy tính' },
    { id: 'd72251db-1829-4ab7-9ab9-1fcd38cdcc92', name: 'Kinh tế & Tài chính' },
    { id: 'dad04b8a-b750-45ae-a9a5-62ae8c2a0f77', name: 'Toán học & Thống kê' },
    { id: 'ca56a709-4f60-4b1a-8050-9401f0873b9d', name: 'Quản trị Kinh doanh' },
    { id: '7f0e5e77-20df-4f64-b855-8cd2df197ce5', name: 'Vật lý & Kỹ thuật' },
    { id: '91cc5c3e-d020-429f-9679-526fa4d1fdaa', name: 'Ngoại ngữ & Ngôn ngữ Anh' },
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await LibraryService.getCategories();
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      } catch (e) {
        console.error('Lỗi khi tải danh mục:', e);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAuthor(initialData.author || '');
      setCategoryId(initialData.categoryId || (categories[0]?.id ?? ''));
      setDescription(initialData.description || '');
      setFile(null);
      setError('');
    } else {
      setTitle('');
      setAuthor('');
      setCategoryId(categories[0]?.id ?? '');
      setDescription('');
      setFile(null);
      setError('');
    }
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Vui lòng nhập tên tài liệu / giáo trình.');
      return;
    }

    if (!initialData && !file) {
      setError('Vui lòng chọn tệp tài liệu PDF hoặc DOCX để tải lên.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData) {
        // Chỉnh sửa tài liệu
        await AdminService.updateDocument(initialData.id, {
          title: title.trim(),
          ...(categoryId ? { categoryId } : {}),
          description: description.trim(),
        });
      } else {
        // Thêm tài liệu mới kèm file
        const formData = new FormData();
        formData.append('title', title.trim());
        if (description.trim()) {
          formData.append('description', description.trim());
        }
        if (categoryId) {
          formData.append('categoryId', categoryId);
        }
        if (file) {
          formData.append('file', file);
        }

        await AdminService.uploadDocument(formData);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Lỗi khi lưu tài liệu:', err);
      setError(err.message || 'Không thể lưu tài liệu. Vui lòng kiểm tra lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSubmitting ? onClose : undefined}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-slate-100 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {initialData ? '✏️ Chỉnh Sửa Thông Tin Giáo Trình' : '➕ Thêm Giáo Trình / Tài Liệu Mới'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {initialData
                  ? 'Cập nhật metadata hiển thị trong kho tài liệu số'
                  : 'Tải tệp số hóa lên MinIO và tự động kích hoạt Vector Embeddings'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X weight="bold" className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-950/60 border border-red-800/60 p-3 text-xs text-red-300">
                <WarningCircle weight="fill" className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Tên giáo trình / Tài liệu <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Giáo trình Hệ Quản trị Cơ sở dữ liệu 2026"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Tác giả / Giảng viên biên soạn <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ví dụ: TS. Nguyễn Văn Minh"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Chuyên ngành đào tạo <span className="text-red-400">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Upload Box (Only when adding new document) */}
            {!initialData && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Tệp tài liệu (PDF, DOCX tối đa 50MB) <span className="text-red-400">*</span>
                </label>
                <div className="relative rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-5 text-center hover:border-blue-500/60 transition-colors">
                  <input
                    type="file"
                    required
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <UploadSimple weight="duotone" className="h-8 w-8 text-blue-400 mb-2" />
                    {file ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <CheckCircle weight="fill" className="h-4 w-4" />
                        <span>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-slate-200">
                          Nhấp để chọn tệp hoặc kéo thả vào đây
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Hỗ trợ định dạng PDF, DOCX
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Mô tả tóm tắt nội dung
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập phần tóm tắt các chương học, kiến thức trọng tâm..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all active:scale-95"
              >
                {isSubmitting ? 'Đang tải lên & Lưu...' : initialData ? 'Lưu cập nhật' : 'Xuất bản tài liệu'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
