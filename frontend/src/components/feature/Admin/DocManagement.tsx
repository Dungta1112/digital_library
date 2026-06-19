'use client';
import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin.service';
import { AdminDocRecord } from '@/types/admin';
import { Button } from '@/components/ui/Button';

export function DocManagement() {
  const [docs, setDocs] = useState<AdminDocRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getPendingDocs();
      setDocs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleReview = async (docId: string, action: 'APPROVE' | 'REJECT') => {
    let reason = undefined;
    if (action === 'REJECT') {
      reason = prompt('Nhập lý do từ chối tài liệu này:');
      if (reason === null) return; // User cancelled
    }
    
    await AdminService.reviewDoc(docId, action, reason);
    alert(`Mock: Đã ${action === 'APPROVE' ? 'phê duyệt' : 'từ chối'} tài liệu.`);
    fetchDocs();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50 transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Quản lý tài liệu</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Duyệt hoặc từ chối các tài liệu mới tải lên</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
          <thead className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 text-gray-900 dark:text-gray-200 font-bold uppercase text-xs tracking-wider transition-colors duration-300">
            <tr>
              <th className="px-6 py-5">Tiêu đề tài liệu</th>
              <th className="px-6 py-5">Tác giả</th>
              <th className="px-6 py-5">Người tải lên</th>
              <th className="px-6 py-5">Ngày tải</th>
              <th className="px-6 py-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors duration-300">
            {docs.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">Không có tài liệu nào chờ duyệt.</td></tr>
            ) : docs.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white transition-colors duration-300">{doc.title}</td>
                <td className="px-6 py-4">{doc.author}</td>
                <td className="px-6 py-4">{doc.uploadedBy}</td>
                <td className="px-6 py-4 font-medium">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    className="font-semibold bg-green-600 hover:bg-green-700"
                    onClick={() => handleReview(doc.id, 'APPROVE')}
                  >
                    Phê duyệt
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="font-semibold text-red-600 hover:bg-red-50"
                    onClick={() => handleReview(doc.id, 'REJECT')}
                  >
                    Từ chối
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
