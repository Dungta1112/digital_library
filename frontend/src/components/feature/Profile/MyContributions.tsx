'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { LecturerDocumentItem } from '@/types/profile';
import { ProfileService } from '@/services/profile.service';
import { Button } from '@/components/ui/Button';
import {
  UploadSimple,
  Files,
  Eye,
  DownloadSimple,
  Trash,
  EyeSlash,
  WarningCircle,
  Plus,
  ArrowSquareOut,
  Clock,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react';

interface MyContributionsProps {
  documents: LecturerDocumentItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenUpload: () => void;
  onRefresh: () => void;
}

export function MyContributions({
  documents,
  loading,
  error,
  onRetry,
  onOpenUpload,
  onRefresh,
}: MyContributionsProps) {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const formatDateTime = (dateStr?: string): string => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: LecturerDocumentItem['status']) => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Đã duyệt & Đang phát hành',
          icon: <CheckCircle weight="fill" className="w-3.5 h-3.5" />,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
        };
      case 'PENDING_REVIEW':
        return {
          label: 'Đang chờ duyệt',
          icon: <Clock weight="fill" className="w-3.5 h-3.5" />,
          classes: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60',
        };
      case 'REJECTED':
        return {
          label: 'Bị từ chối',
          icon: <XCircle weight="fill" className="w-3.5 h-3.5" />,
          classes: 'bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/60',
        };
      case 'HIDDEN':
        return {
          label: 'Đang ẩn',
          icon: <EyeSlash weight="fill" className="w-3.5 h-3.5" />,
          classes: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        };
      default:
        return {
          label: status,
          icon: null,
          classes: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
        };
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài liệu "${title}"?`)) {
      return;
    }
    setActionInProgress(id);
    setActionError('');
    try {
      await ProfileService.deleteLecturerDocument(id);
      onRefresh();
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Không thể xóa tài liệu.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleHide = async (id: string) => {
    setActionInProgress(id);
    setActionError('');
    try {
      await ProfileService.hideLecturerDocument(id);
      onRefresh();
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Không thể ẩn tài liệu.');
    } finally {
      setActionInProgress(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="h-6 w-48 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto mb-3">
          <WarningCircle weight="bold" className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Không thể tải danh sách tài liệu đóng góp
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
          {error}
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={onRetry}
          className="text-xs font-bold px-4 py-2 rounded-xl"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <Files weight="duotone" className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Tài liệu đã đóng góp ({documents.length})
          </h3>
        </div>
        <Button
          type="button"
          onClick={onOpenUpload}
          className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus weight="bold" className="w-3.5 h-3.5" />
          Tải tài liệu mới
        </Button>
      </div>

      {actionError && (
        <div className="mt-4 p-3.5 rounded-2xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 text-xs font-semibold border border-red-200 flex items-center gap-2">
          <WarningCircle weight="fill" className="w-4 h-4 shrink-0 text-red-500" />
          <span>{actionError}</span>
        </div>
      )}

      {/* List */}
      <div className="mt-4">
        {documents.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <UploadSimple weight="duotone" className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Chưa có tài liệu nào được tải lên
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              Đóng góp giáo trình, bài giảng và tài liệu nghiên cứu cho sinh viên và cộng đồng Đại học Trưng Vương.
            </p>
            <Button
              type="button"
              onClick={onOpenUpload}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs inline-flex items-center gap-1.5"
            >
              <Plus weight="bold" className="w-4 h-4" />
              Tải tài liệu đầu tiên
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {documents.map((doc) => {
              const status = getStatusBadge(doc.status);
              const isWorking = actionInProgress === doc.id;

              return (
                <div
                  key={doc.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Files weight="duotone" className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {doc.title}
                        </h4>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.classes}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </div>

                      {doc.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-normal">
                          {doc.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        {doc.category?.name && (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            {doc.category.name}
                          </span>
                        )}
                        <span>Ngày đăng: {formatDateTime(doc.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <Eye weight="bold" className="w-3.5 h-3.5" />
                          {doc.viewCount || 0} lượt xem
                        </span>
                        <span className="flex items-center gap-1">
                          <DownloadSimple weight="bold" className="w-3.5 h-3.5" />
                          {doc.downloadCount || 0} tải về
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    {doc.status === 'APPROVED' && (
                      <Link
                        href={`/library/${doc.id}`}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-950/40 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors shadow-2xs"
                        title="Xem trang tài liệu"
                        aria-label="Xem trang tài liệu"
                      >
                        <ArrowSquareOut weight="bold" className="w-4 h-4" />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => handleHide(doc.id)}
                      disabled={isWorking}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
                      title="Ẩn/Hiện tài liệu"
                      aria-label="Ẩn/Hiện tài liệu"
                    >
                      <EyeSlash weight="bold" className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id, doc.title)}
                      disabled={isWorking}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:text-slate-300 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Xóa tài liệu"
                      aria-label="Xóa tài liệu"
                    >
                      <Trash weight="bold" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
