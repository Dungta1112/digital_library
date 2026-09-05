'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GroupService } from '@/services/group.service';
import { GroupDocumentWrapper } from '@/types/group';
import { ShareLibraryDocumentDialog } from './ShareLibraryDocumentDialog';
import { Button } from '@/components/ui/Button';
import {
  Books,
  Plus,
  BookOpen,
  Sparkle,
  ArrowSquareOut,
  ArrowsClockwise,
  BookBookmark,
} from '@phosphor-icons/react';

interface GroupDocumentsProps {
  groupId: string;
  canManageDocs: boolean;
  isMember?: boolean;
}

export function GroupDocuments({ groupId, canManageDocs }: GroupDocumentsProps) {
  const [documents, setDocuments] = useState<GroupDocumentWrapper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    GroupService.getGroupDocuments(groupId, controller.signal)
      .then((data) => {
        if (!ignore) {
          setDocuments(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore && !controller.signal.aborted) {
          console.error('Lỗi khi tải tài liệu nhóm:', err);
          setError('Không thể tải danh sách tài liệu nhóm. Vui lòng thử lại.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [groupId, reloadKey]);

  const handleDocumentAdded = () => {
    setIsShareModalOpen(false);
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const handleRefresh = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const existingDocIds = documents.map((d) => d.documentId);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ── Sub-header: Actions Bar ─────────────────────────── */}
      <div className="h-12 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Tài liệu thư viện dùng chung ({documents.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Làm mới danh sách"
          >
            <ArrowsClockwise weight="bold" className="w-4 h-4" />
          </button>

          {canManageDocs && (
            <Button
              onClick={() => setIsShareModalOpen(true)}
              className="h-8 px-3 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <Plus weight="bold" className="w-3.5 h-3.5" />
              <span>Thêm từ thư viện</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Document List Container ─────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Đang tải tài liệu nhóm...</span>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <p className="text-xs text-red-600 dark:text-red-400 mb-3">{error}</p>
            <Button
              variant="secondary"
              onClick={handleRefresh}
              className="h-9 text-xs"
            >
              Thử lại
            </Button>
          </div>
        ) : documents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Books weight="duotone" className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              Chưa có tài liệu thư viện nào trong nhóm
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
              {canManageDocs
                ? 'Bạn có thể chia sẻ các giáo trình, sách chuyên khảo hoặc tài liệu học tập từ Thư viện vào nhóm để các thành viên cùng đọc và nghiên cứu.'
                : 'Trưởng nhóm có thể chia sẻ các tài liệu chuyên ngành từ Thư viện vào không gian học này.'}
            </p>
            {canManageDocs && (
              <Button
                onClick={() => setIsShareModalOpen(true)}
                className="h-10 px-5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/10 flex items-center gap-2"
              >
                <Plus weight="bold" className="w-4 h-4" />
                <span>Thêm tài liệu từ thư viện</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {documents.map((wrapper) => {
              const doc = wrapper.document;
              return (
                <div
                  key={wrapper.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all shadow-sm"
                >
                  <div>
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        {doc.fileType?.toUpperCase() || 'TÀI LIỆU'}
                      </span>
                      {doc.category && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                          {doc.category}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug mb-1 line-clamp-2">
                      {doc.title || 'Chưa cập nhật tiêu đề'}
                    </h4>

                    {/* Author */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-3">
                      {doc.author || 'Chưa cập nhật tác giả'}
                    </p>

                    {/* Shared date */}
                    {wrapper.addedAt && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-4">
                        <BookBookmark weight="duotone" className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          Chia sẻ ngày {new Date(wrapper.addedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/library/read/${doc.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        <BookOpen weight="bold" className="w-3.5 h-3.5" />
                        <span>Đọc</span>
                      </Link>

                      <Link
                        href={`/ai?doc=${doc.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors"
                        title="Hỏi trợ lý AI về tài liệu này"
                      >
                        <Sparkle weight="fill" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Hỏi AI</span>
                      </Link>
                    </div>

                    <Link
                      href={`/library/document/${doc.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-1"
                      title="Xem thông tin chi tiết tài liệu"
                    >
                      <span>Hồ sơ</span>
                      <ArrowSquareOut weight="bold" className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Share Modal (Owner only) ────────────────────────── */}
      {canManageDocs && (
        <ShareLibraryDocumentDialog
          groupId={groupId}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          existingDocIds={existingDocIds}
          onDocumentAdded={handleDocumentAdded}
        />
      )}
    </div>
  );
}
