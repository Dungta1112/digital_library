'use client';
import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin.service';
import { AdminReport } from '@/types/admin';
import { Button } from '@/components/ui/Button';

export function ReportManagement() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getReports();
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleProcess = async (reportId: string, action: 'RESOLVE' | 'IGNORE') => {
    await AdminService.processReport(reportId, action);
    alert(`Mock: Đã ${action === 'RESOLVE' ? 'xử lý (Ẩn/Xóa nội dung)' : 'bỏ qua'} báo cáo.`);
    fetchReports();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50 transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Quản lý báo cáo</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Xử lý các báo cáo vi phạm từ người dùng</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
          <thead className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 text-gray-900 dark:text-gray-200 font-bold uppercase text-xs tracking-wider transition-colors duration-300">
            <tr>
              <th className="px-6 py-5">Người báo cáo</th>
              <th className="px-6 py-5">Đối tượng</th>
              <th className="px-6 py-5">Lý do</th>
              <th className="px-6 py-5">Thời gian</th>
              <th className="px-6 py-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors duration-300">
            {reports.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">Không có báo cáo nào cần xử lý.</td></tr>
            ) : reports.map(report => (
              <tr key={report.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white transition-colors duration-300">{report.reporterName}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    {report.targetType}
                  </span>
                  <div className="text-[10px] text-gray-400 mt-1">ID: {report.targetId}</div>
                </td>
                <td className="px-6 py-4 text-red-600 font-medium">{report.reason}</td>
                <td className="px-6 py-4">{new Date(report.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    className="font-semibold bg-red-600 hover:bg-red-700"
                    onClick={() => handleProcess(report.id, 'RESOLVE')}
                  >
                    Xử lý vi phạm
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="font-semibold text-gray-600 hover:bg-gray-100"
                    onClick={() => handleProcess(report.id, 'IGNORE')}
                  >
                    Bỏ qua
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
