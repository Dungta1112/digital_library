'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { AdminService, AdminDocumentItem } from '@/services/admin.service';
import { DocumentFormModal } from '@/components/admin/document-form-modal';
import { DeleteConfirmModal } from '@/components/ui/delete-confirm-modal';
import {
  Plus,
  MagnifyingGlass,
  PencilSimple,
  Trash,
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
} from '@phosphor-icons/react';

export default function AdminDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AdminDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<AdminDocumentItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canManageDocs = user?.role === 'ADMIN' || user?.role === 'LECTURER';

  const fetchDocs = async () => {
    try {
      const data = await AdminService.getDocuments();
      setDocuments(data);
    } catch (e) {
      console.error('Lỗi tải danh sách tài liệu:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    AdminService.getDocuments()
      .then((data) => {
        if (active) setDocuments(data);
      })
      .catch((e) => {
        console.error('Lỗi tải danh sách tài liệu:', e);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Mở modal Thêm mới
  const handleOpenAdd = () => {
    if (!canManageDocs) return;
    setSelectedDoc(null);
    setIsFormModalOpen(true);
  };

  // Mở modal Chỉnh sửa
  const handleOpenEdit = (doc: AdminDocumentItem) => {
    if (!canManageDocs) return;
    setSelectedDoc(doc);
    setIsFormModalOpen(true);
  };

  // Mở modal Xóa
  const handleOpenDelete = (doc: AdminDocumentItem) => {
    if (!canManageDocs) return;
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  // Xử lý Xóa thực tế qua API
  const handleConfirmDelete = async () => {
    if (!selectedDoc || !canManageDocs) return;
    setDeleting(true);
    try {
      await AdminService.deleteDocument(selectedDoc.id);
      setDocuments((prev) => prev.filter((d) => d.id !== selectedDoc.id));
      setIsDeleteModalOpen(false);
    } catch (err: unknown) {
      console.error('Lỗi xóa tài liệu:', err);
      alert(err instanceof Error ? err.message : 'Không thể xóa tài liệu. Vui lòng thử lại!');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = documents.filter((doc) => {
    const matchSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      !statusFilter ||
      (statusFilter === 'APPROVED' && doc.status === 'APPROVED') ||
      (statusFilter === 'PENDING' && (doc.status === 'PENDING' || doc.status === 'PENDING_REVIEW')) ||
      (statusFilter === 'REJECTED' && doc.status === 'REJECTED');

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Quản Lý Kho Tài Liệu Số
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {canManageDocs
              ? 'Thêm mới, chỉnh sửa thông tin giáo trình và quản lý toàn bộ tệp lưu trữ số hóa.'
              : 'Xem danh sách giáo trình và tài liệu đã được lưu trữ trong hệ thống.'}
          </p>
        </div>
        {canManageDocs && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus weight="bold" className="h-4 w-4" />
            Thêm tài liệu mới
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 shadow-md">
        <div className="relative flex-1 w-full">
          <MagnifyingGlass weight="bold" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên giáo trình, tác giả, chuyên ngành..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="APPROVED">Đã phê duyệt</option>
          <option value="PENDING">Chờ kiểm duyệt</option>
          <option value="REJECTED">Đã từ chối</option>
        </select>
      </div>

      {/* Documents Data Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">Tên Giáo Trình / Tài Liệu</th>
                <th className="px-5 py-4">Tác Giả</th>
                <th className="px-5 py-4">Chuyên Ngành</th>
                <th className="px-5 py-4">Dung Lượng</th>
                <th className="px-5 py-4">Trạng Thái</th>
                <th className="px-5 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Đang tải danh sách tài liệu...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    Không tìm thấy tài liệu phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-bold text-white max-w-xs">
                      <p className="line-clamp-2">{doc.title}</p>
                      <span className="text-[10px] font-normal text-slate-400">
                        {doc.createdAt}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-300 font-medium">
                      {doc.author}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 text-[10px] font-bold text-slate-300">
                        {doc.categoryName}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-400">
                      {doc.fileSizeMb} MB ({doc.totalPages} trang)
                    </td>
                    <td className="px-5 py-4">
                      {doc.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-800/60">
                          <CheckCircle weight="fill" className="h-3 w-3" />
                          Đã duyệt
                        </span>
                      ) : doc.status === 'REJECTED' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-950/80 px-2.5 py-1 text-[10px] font-bold text-red-400 border border-red-800/60">
                          <XCircle weight="fill" className="h-3 w-3" />
                          Từ chối
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/80 px-2.5 py-1 text-[10px] font-bold text-amber-400 border border-amber-800/60">
                          <Clock weight="fill" className="h-3 w-3" />
                          Chờ duyệt
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <Link
                        href={`/library/document/${doc.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                        title="Đọc thử"
                      >
                        <BookOpen weight="bold" className="h-3 w-3" />
                        Đọc
                      </Link>
                      {canManageDocs && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(doc)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                          >
                            <PencilSimple weight="bold" className="h-3 w-3" />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleOpenDelete(doc)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-900/50 bg-red-950/40 px-2.5 py-1.5 text-[11px] font-semibold text-red-400 hover:bg-red-900/60 hover:text-white transition-colors"
                          >
                            <Trash weight="bold" className="h-3 w-3" />
                            Xóa
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm / Chỉnh Sửa Tài liệu */}
      <DocumentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={fetchDocs}
        initialData={selectedDoc}
      />

      {/* Modal Xác Nhận Xóa */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa tài liệu khỏi hệ thống"
        itemName={selectedDoc?.title || ''}
        description="Hành động này sẽ gỡ tài liệu vĩnh viễn khỏi kho dữ liệu PostgreSQL và MinIO. Không thể hoàn tác."
        loading={deleting}
      />
    </div>
  );
}
