'use client';

import React, { useState, useEffect } from 'react';
import { LibraryService } from '@/services/library.service';
import { GroupService } from '@/services/group.service';
import { Document } from '@/types/library';
import { GroupDocumentWrapper } from '@/types/group';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  X,
  MagnifyingGlass,
  BookBookmark,
  CheckCircle,
  Plus,
  SpinnerGap,
} from '@phosphor-icons/react';

interface ShareLibraryDocumentDialogProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
  existingDocIds: string[];
  onDocumentAdded: (docWrapper: GroupDocumentWrapper) => void;
}

export function ShareLibraryDocumentDialog({
  groupId,
  isOpen,
  onClose,
  existingDocIds,
  onDocumentAdded,
}: ShareLibraryDocumentDialogProps) {
  const [search, setSearch] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    const loadDocs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await LibraryService.getDocuments(
          { query: search.trim() || undefined },
          1,
          20,
          controller.signal
        );
        setDocuments(res.data);
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          console.error('Lỗi khi tải tài liệu thư viện:', err);
          setError('Không thể tìm kiếm tài liệu thư viện lúc này.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(loadDocs, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, search]);

  if (!isOpen) return null;

  const handleShare = async (doc: Document) => {
    setAddingId(doc.id);
    setError('');
    try {
      const addedWrapper = await GroupService.addDocumentToGroup(groupId, doc.id);
      onDocumentAdded(addedWrapper);
    } catch (err: unknown) {
      console.error('Lỗi khi chia sẻ tài liệu:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể chia sẻ tài liệu vào nhóm. Vui lòng thử lại.'
      );
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900 transition-all max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Thêm tài liệu từ Thư viện
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Chọn tài liệu trong kho thư viện số để cùng trao đổi và học tập trong nhóm.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="pt-4 pb-3">
          <div className="relative">
            <MagnifyingGlass
              weight="bold"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm tài liệu theo tên, chuyên đề hoặc tác giả..."
              className="pl-10 h-11 rounded-xl text-sm"
              autoFocus
            />
          </div>
        </div>

        {error && (
          <div className="p-3 mb-2 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-xs text-red-600 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        {/* Document Results List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1 py-2">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <SpinnerGap weight="bold" className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="text-xs font-medium">Đang tìm tài liệu thư viện...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <BookBookmark weight="duotone" className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold">Không tìm thấy tài liệu phù hợp</p>
              <p className="text-xs text-slate-400 mt-1">Thử tìm bằng từ khóa khác.</p>
            </div>
          ) : (
            documents.map((doc) => {
              const isAlreadyAdded = existingDocIds.includes(doc.id);
              const isAdding = addingId === doc.id;

              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        {doc.fileType?.toUpperCase() || 'TÀI LIỆU'}
                      </span>
                      {doc.category && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                          • {doc.category}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {doc.authors && doc.authors.length > 0
                        ? doc.authors.join(', ')
                        : 'Thư viện số'}
                    </p>
                  </div>

                  {isAlreadyAdded ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 shrink-0">
                      <CheckCircle weight="fill" className="w-4 h-4" />
                      Đã thêm
                    </span>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => handleShare(doc)}
                      disabled={isAdding}
                      className="h-9 px-3.5 text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5 shadow-sm"
                    >
                      {isAdding ? (
                        <>
                          <SpinnerGap weight="bold" className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang thêm...</span>
                        </>
                      ) : (
                        <>
                          <Plus weight="bold" className="w-3.5 h-3.5" />
                          <span>Chia sẻ vào nhóm</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button variant="secondary" onClick={onClose} className="h-10 px-5 rounded-xl text-xs font-semibold">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
