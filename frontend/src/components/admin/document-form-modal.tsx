'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminService, AdminDocumentItem } from '@/services/admin.service';
import { LibraryService } from '@/services/library.service';
import {
  UploadSimple,
  X,
  CheckCircle,
  WarningCircle,
} from '@phosphor-icons/react';
import { useDialogAccessibility } from '@/hooks/useDialogAccessibility';

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
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [categoriesError, setCategoriesError] = useState('');
  const dialogRef = useDialogAccessibility<HTMLDivElement>(isOpen, onClose, isSubmitting);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await LibraryService.getCategories();
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      } catch (e) {
        setCategoriesError(e instanceof Error ? e.message : 'Không thể tải danh mục.');
      }
    }
    loadCategories();
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- Form inputs must be re-initialized when modal opens or selected document data changes */
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAuthor(initialData.author || initialData.authors?.[0] || '');
      setCategoryName(initialData.categoryName || initialData.category?.name || categories[0]?.name || '');
      setDescription(initialData.description || '');
      setFile(null);
      setError('');
    } else {
      setTitle('');
      setAuthor('');
      setCategoryName('');
      setDescription('');
      setFile(null);
      setError('');
    }
  }, [initialData, isOpen, categories]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Vui lòng nhập tên tài liệu / giáo trình.');
      return;
    }

    if (!categoryName.trim() || categoriesError) {
      setError(categoriesError || 'Vui lòng chọn một chuyên ngành từ hệ thống.');
      return;
    }

    if (!initialData && !file) {
      setError('Vui lòng chọn tệp tài liệu PDF hoặc DOCX để tải lên.');
      return;
    }

    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
    );
    if (!matchedCategory) {
      setError('Chuyên ngành đã chọn không tồn tại trong danh mục của hệ thống.');
      return;
    }
    const resolvedCategoryId = matchedCategory.id;

    setIsSubmitting(true);
    try {
      if (initialData) {
        // Chỉnh sửa tài liệu
        await AdminService.updateDocument(initialData.id, {
          title: title.trim(),
          categoryId: resolvedCategoryId,
          description: description.trim(),
        });
      } else {
        // Thêm tài liệu mới kèm file
        const formData = new FormData();
        formData.append('title', title.trim());
        if (author.trim()) {
          formData.append('author', author.trim());
          formData.append('authors', JSON.stringify([author.trim()]));
        }
        if (description.trim()) {
          formData.append('description', description.trim());
        }
        formData.append('categoryId', resolvedCategoryId);
        formData.append('categoryName', categoryName.trim());
        if (file) {
          formData.append('file', file);
        }

        await AdminService.uploadDocument(formData);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Lỗi khi lưu tài liệu:', err);
      setError(err instanceof Error ? err.message : 'Không thể lưu tài liệu. Vui lòng kiểm tra lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="document-form-title"
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
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-slate-100 shadow-2xl z-10 outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 id="document-form-title" className="text-lg font-bold text-white tracking-tight">
                {initialData ? '✏️ Chỉnh Sửa Thông Tin Giáo Trình' : '➕ Thêm Giáo Trình / Tài Liệu Mới'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {initialData
                  ? 'Cập nhật metadata hiển thị trong kho tài liệu số'
                  : 'Tải tệp tài liệu lên hệ thống để chờ xử lý'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Đóng biểu mẫu tài liệu"
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
                <input
                  type="text"
                  required
                  list="category-suggestions"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Chọn hoặc tự điền (VD: Công nghệ thông tin)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <datalist id="category-suggestions">
                  {categories.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
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
