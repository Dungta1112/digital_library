'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/services/api.client';
import { LibraryService } from '@/services/library.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

interface MyDocument {
  id: string;
  title: string;
  description?: string;
  status: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  category?: { id: string; name: string };
}

export default function MyDocumentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<MyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  // Upload form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any, any>('/lecturer/documents');
      const items = Array.isArray(res) ? res : (res?.items || []);
      setDocuments(items);
    } catch (e) {
      console.error(e);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
      LibraryService.getCategories().then(setCategories);
    }
  }, [user]);

  const handleUpload = async () => {
    if (!title.trim()) {
      setUploadMsg('Lỗi: Vui lòng nhập tiêu đề tài liệu');
      return;
    }
    setUploading(true);
    setUploadMsg('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (description) formData.append('description', description);
      if (categoryId) formData.append('categoryId', categoryId);
      if (file) formData.append('file', file);

      await apiClient.post('/lecturer/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadMsg('Tải lên thành công! Tài liệu đang chờ duyệt.');
      setTitle('');
      setDescription('');
      setCategoryId('');
      setFile(null);
      setShowUpload(false);
      fetchDocuments();
    } catch (e: any) {
      setUploadMsg('Lỗi: ' + (e.message || 'Không thể tải lên'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
    try {
      await apiClient.delete(`/lecturer/documents/${docId}`);
      fetchDocuments();
    } catch (e) {
      console.error(e);
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED': return { text: 'Đã duyệt', cls: 'bg-green-50 text-green-700 border-green-100' };
      case 'PENDING_REVIEW': return { text: 'Chờ duyệt', cls: 'bg-yellow-50 text-yellow-700 border-yellow-100' };
      case 'REJECTED': return { text: 'Từ chối', cls: 'bg-red-50 text-red-700 border-red-100' };
      case 'DRAFT': return { text: 'Bản nháp', cls: 'bg-gray-50 text-gray-600 border-gray-200' };
      default: return { text: status, cls: 'bg-gray-50 text-gray-600 border-gray-200' };
    }
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>;
  }

  const canUpload = user.role === 'LECTURER' || user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-50/50 pt-8 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10 mt-6 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Tài liệu của tôi</h1>
            <p className="text-gray-500">
              {canUpload 
                ? 'Quản lý và tải lên tài liệu giảng dạy' 
                : 'Xem danh sách tài liệu yêu thích của bạn'}
            </p>
          </div>
          {canUpload && (
            <Button 
              onClick={() => setShowUpload(!showUpload)} 
              className="font-bold shadow-md"
            >
              {showUpload ? '✕ Đóng' : '+ Tải lên tài liệu'}
            </Button>
          )}
        </div>

        {/* Upload Form */}
        {showUpload && canUpload && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8 animate-in slide-in-from-top-2">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-xl">📤</span> Tải lên tài liệu mới
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề <span className="text-red-500">*</span></label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề tài liệu" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Mô tả ngắn về tài liệu..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Chuyên mục</label>
                <select 
                  value={categoryId} 
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">-- Chọn chuyên mục --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tệp đính kèm (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer file:transition-colors"
                />
              </div>
            </div>

            {uploadMsg && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${uploadMsg.startsWith('Lỗi') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {uploadMsg}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button onClick={handleUpload} disabled={uploading} className="font-bold shadow-md">
                {uploading ? 'Đang tải lên...' : 'Tải lên'}
              </Button>
              <Button variant="secondary" onClick={() => setShowUpload(false)}>Hủy</Button>
            </div>
          </div>
        )}

        {/* Document List */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải danh sách tài liệu...</div>
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa có tài liệu nào</h3>
            <p className="text-gray-500 text-sm mb-6">
              {canUpload 
                ? 'Bạn chưa tải lên tài liệu nào. Bấm nút "Tải lên tài liệu" phía trên để bắt đầu.' 
                : 'Bạn chưa có tài liệu nào trong thư viện cá nhân.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map(doc => {
              const st = statusLabel(doc.status);
              return (
                <div key={doc.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-bold text-gray-900 truncate">{doc.title}</h3>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${st.cls}`}>
                          {st.text}
                        </span>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{doc.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        {doc.category && (
                          <span className="flex items-center gap-1">📁 {doc.category.name}</span>
                        )}
                        <span className="flex items-center gap-1">👁 {doc.viewCount} lượt xem</span>
                        <span className="flex items-center gap-1">⬇ {doc.downloadCount} tải về</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    {canUpload && (
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
                        title="Xóa tài liệu"
                      >
                        🗑
                      </button>
                    )}
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
