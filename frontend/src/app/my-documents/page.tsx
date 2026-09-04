'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/api-client';
import { LibraryService } from '@/services/library.service';
import type { Document } from '@/types/library';
import { Button } from '@/components/ui/Button';
import { IngestStatusBadge } from '@/components/feature/Library/IngestStatusBadge';
import { UploadDocumentDialog } from '@/components/feature/Document/UploadDocumentDialog';
import { 
  UploadSimple, 
  Folder, 
  Eye, 
  Download, 
  Trash, 
  Files, 
  BookmarkSimple,
  BookOpen,
} from '@phosphor-icons/react';

interface LecturerDocument {
  id: string;
  title: string;
  description?: string;
  status: 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED' | 'DRAFT';
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  category?: { id: string; name: string };
}

export default function MyDocumentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const canUpload = user?.role === 'LECTURER' || user?.role === 'ADMIN';
  const [activeTab, setActiveTab] = useState<'uploaded' | 'saved'>('saved');
  const [uploadedDocs, setUploadedDocs] = useState<LecturerDocument[]>([]);
  const [favoriteDocs, setFavoriteDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const currentTab = canUpload ? activeTab : 'saved';

  const fetchUploaded = async () => {
    if (!canUpload) return;
    try {
      const res = await apiClient.get<LecturerDocument[] | { items?: LecturerDocument[] }>('/lecturer/documents');
      const items = Array.isArray(res) ? res : (res?.items || []);
      setUploadedDocs(items);
    } catch (e) {
      console.error(e);
      setUploadedDocs([]);
    }
  };

  useEffect(() => {
    let active = true;
    if (!user) return;

    const promise = (currentTab === 'uploaded' && canUpload)
      ? apiClient.get<LecturerDocument[] | { items?: LecturerDocument[] }>('/lecturer/documents').then((res) => {
          const items = Array.isArray(res) ? res : (res?.items || []);
          if (active) setUploadedDocs(items);
        }).catch((e) => {
          console.error(e);
          if (active) setUploadedDocs([]);
        })
      : LibraryService.getFavoriteDocuments().then((favs) => {
          if (active) setFavoriteDocs(favs);
        }).catch((e) => {
          console.error(e);
          if (active) setFavoriteDocs([]);
        });

    promise.finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [user, currentTab, canUpload]);

  const handleDelete = async (docId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
    try {
      await apiClient.delete(`/lecturer/documents/${docId}`);
      fetchUploaded();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnfavorite = async (docId: string) => {
    try {
      await LibraryService.unfavoriteDocument(docId);
      setFavoriteDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch (e) {
      console.error(e);
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED': return { text: 'Đã duyệt', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' };
      case 'PENDING_REVIEW': return { text: 'Chờ duyệt', cls: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50' };
      case 'REJECTED': return { text: 'Từ chối', cls: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50' };
      case 'DRAFT': return { text: 'Bản nháp', cls: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' };
      default: return { text: status, cls: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' };
    }
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-950">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-8 pb-16 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8 mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 transition-colors duration-300">Tủ sách cá nhân</h1>
            <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">
              {canUpload 
                ? 'Quản lý tài liệu giảng dạy đã tải lên và tài liệu yêu thích' 
                : 'Xem danh sách tài liệu bạn đã lưu vào danh sách yêu thích'}
            </p>
          </div>

          {canUpload && activeTab === 'uploaded' && (
            <Button 
              onClick={() => setShowUpload(true)} 
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm rounded-xl h-12 px-6 flex items-center gap-2 active:scale-[0.98] transition-all"
            >
              <UploadSimple weight="bold" className="w-5 h-5" /> Tải lên tài liệu
            </Button>
          )}
        </div>

        {/* Tab Navigation for LECTURER & ADMIN */}
        {canUpload && (
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
            <button
              onClick={() => setActiveTab('uploaded')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'uploaded'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Tài liệu đã tải lên ({uploadedDocs.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'saved'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Tài liệu đã lưu ({favoriteDocs.length})
            </button>
          </div>
        )}

        {/* Upload Document Dialog */}
        <UploadDocumentDialog
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          onSuccess={fetchUploaded}
        />

        {/* Content list */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500 font-medium">Đang tải danh sách tài liệu...</div>
        ) : activeTab === 'uploaded' && canUpload ? (
          uploadedDocs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-16 flex flex-col items-center text-center transition-colors duration-300">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6 shadow-inner">
                <Files weight="duotone" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Chưa có tài liệu tải lên</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm leading-relaxed">
                Bạn chưa tải lên tài liệu nào. Nhấn &ldquo;Tải lên tài liệu&rdquo; phía trên để đóng góp tri thức.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedDocs.map(doc => {
                const st = statusLabel(doc.status);
                return (
                  <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 hover:shadow-md hover:border-emerald-500/30 transition-all group">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2.5">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{doc.title}</h3>
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${st.cls} transition-colors duration-300`}>
                            {st.text}
                          </span>
                          {doc.status === 'APPROVED' && <IngestStatusBadge documentId={doc.id} />}
                        </div>
                        {doc.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">{doc.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                          {doc.category && (
                            <span className="flex items-center gap-1.5"><Folder weight="duotone" className="w-4 h-4 text-slate-400" /> {doc.category.name}</span>
                          )}
                          <span className="flex items-center gap-1.5"><Eye weight="bold" className="w-4 h-4 text-slate-400" /> {doc.viewCount}</span>
                          <span className="flex items-center gap-1.5"><Download weight="bold" className="w-4 h-4 text-slate-400" /> {doc.downloadCount}</span>
                          <span className="text-slate-400">{new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0"
                        title="Xóa tài liệu"
                      >
                        <Trash weight="bold" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Favorites list */
          favoriteDocs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-16 flex flex-col items-center text-center transition-colors duration-300">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6 shadow-inner">
                <BookmarkSimple weight="duotone" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Chưa có tài liệu đã lưu</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm leading-relaxed">
                Bạn chưa lưu tài liệu nào. Hãy khám phá Kho tài liệu và bấm nút &ldquo;Lưu vào yêu thích&rdquo; để xem lại tại đây.
              </p>
              <Link href="/library">
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold px-5 py-2.5">
                  Khám phá kho tài liệu
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteDocs.map((doc) => (
                <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 hover:shadow-md hover:border-emerald-500/30 transition-all group">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2.5">
                        <Link href={`/library/document/${doc.id}`} className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {doc.title}
                        </Link>
                        <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                        {doc.authors && doc.authors.length > 0 ? doc.authors.join(', ') : 'Chưa cập nhật tác giả'}
                        {doc.publicationYear ? ` • Năm ${doc.publicationYear}` : ''}
                      </p>
                      {doc.abstract && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">{doc.abstract}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5"><Eye weight="bold" className="w-4 h-4 text-slate-400" /> {doc.viewCount} lượt đọc</span>
                        <span className="flex items-center gap-1.5"><BookmarkSimple weight="bold" className="w-4 h-4 text-emerald-500" /> {doc.saveCount} lượt lưu</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/library/document/${doc.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                      >
                        <BookOpen weight="bold" className="w-3.5 h-3.5" />
                        Đọc
                      </Link>
                      <button
                        onClick={() => handleUnfavorite(doc.id)}
                        className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                        title="Bỏ lưu khỏi danh sách"
                      >
                        <BookmarkSimple weight="fill" className="w-4 h-4 text-emerald-500 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
