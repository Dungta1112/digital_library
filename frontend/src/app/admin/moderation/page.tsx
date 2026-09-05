'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin.service';
import type { AdminDocRecord, AdminReport } from '@/types/admin';
import { TextActionDialog } from '@/components/ui/text-action-dialog';
import {
  ShieldCheck,
  Check,
  X,
  Warning,
  FilePdf,
} from '@phosphor-icons/react';

export default function AdminModerationPage() {
  const [pendingDocs, setPendingDocs] = useState<AdminDocRecord[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingAction, setPendingAction] = useState<{
    kind: 'REJECT_DOCUMENT' | 'RESOLVE_REPORT' | 'REJECT_REPORT';
    id: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([AdminService.getPendingDocuments(), AdminService.getReports()])
      .then(([docsData, reportsData]) => {
        if (active) {
          setPendingDocs(docsData);
          setReports(reportsData);
        }
      })
      .catch((e) => {
        if (active) setLoadError(e instanceof Error ? e.message : 'Không thể tải dữ liệu kiểm duyệt.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const handleApprove = async (docId: string) => {
    setActionLoading(docId);
    setActionError('');
    try {
      await AdminService.approveDocument(docId);
      setPendingDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Lỗi phê duyệt tài liệu.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReasonAction = async (note: string) => {
    if (!pendingAction) return false;
    setActionLoading(pendingAction.id);
    setActionError('');
    try {
      if (pendingAction.kind === 'REJECT_DOCUMENT') {
        await AdminService.rejectDocument(pendingAction.id, note);
        setPendingDocs((prev) => prev.filter((document) => document.id !== pendingAction.id));
      } else {
        await AdminService.resolveReport(
          pendingAction.id,
          pendingAction.kind === 'RESOLVE_REPORT' ? 'RESOLVED' : 'REJECTED',
          note
        );
        setReports((prev) => prev.filter((report) => report.id !== pendingAction.id));
      }
      return true;
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Không thể hoàn tất thao tác kiểm duyệt.');
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <TextActionDialog
        isOpen={pendingAction !== null}
        title={pendingAction?.kind === 'REJECT_DOCUMENT' ? 'Từ chối tài liệu' : 'Xử lý báo cáo'}
        description="Nhập ghi chú cụ thể. Nội dung này sẽ được gửi nguyên văn tới API kiểm duyệt."
        confirmLabel="Xác nhận"
        loading={Boolean(pendingAction && actionLoading === pendingAction.id)}
        onClose={() => setPendingAction(null)}
        onConfirm={handleReasonAction}
      />
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Hàng Đợi Kiểm Duyệt Học Thuật
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Phê duyệt các giáo trình do Giảng viên gửi lên và xử lý các báo cáo vi phạm nội dung diễn đàn.
        </p>
      </div>

      {(loadError || actionError) && (
        <div role="alert" className="flex items-center justify-between gap-4 rounded-2xl border border-red-900/60 bg-red-950/40 p-4 text-xs font-semibold text-red-300">
          <span>{loadError || actionError}</span>
          {loadError && <button type="button" onClick={() => { setLoadError(''); setLoading(true); setReloadKey((value) => value + 1); }} className="font-bold underline">Thử lại</button>}
        </div>
      )}

      {/* 1. Pending Documents Queue */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck weight="duotone" className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Tài Liệu Chờ Phê Duyệt ({pendingDocs.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Đang tải danh sách chờ duyệt...
          </div>
        ) : loadError ? null : pendingDocs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-10 text-center">
            <ShieldCheck weight="fill" className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-200">Không có tài liệu nào chờ kiểm duyệt</p>
            <p className="text-xs text-slate-500 mt-0.5">Tất cả tài liệu gửi lên đã được duyệt và xuất bản vào kho.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 transition-colors hover:border-slate-700"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/50 shrink-0">
                    <FilePdf weight="duotone" className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{doc.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Người gửi: <span className="text-slate-300 font-semibold">{doc.uploadedBy}</span> • Ngày gửi: {doc.uploadDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleApprove(doc.id)}
                    disabled={actionLoading === doc.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                  >
                    <Check weight="bold" className="h-3.5 w-3.5" />
                    Duyệt xuất bản
                  </button>
                  <button
                    onClick={() => setPendingAction({ kind: 'REJECT_DOCUMENT', id: doc.id })}
                    disabled={actionLoading === doc.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-950/60 border border-red-800/60 px-3.5 py-1.5 text-xs font-bold text-red-400 hover:bg-red-900/60 hover:text-white disabled:opacity-50 transition-colors"
                  >
                    <X weight="bold" className="h-3.5 w-3.5" />
                    Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Flagged Reports Queue */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Warning weight="duotone" className="h-5 w-5 text-red-400" />
            <h2 className="text-base font-bold text-white">
              Báo Cáo Vi Phạm Nội Dung ({reports.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Đang tải danh sách báo cáo...
          </div>
        ) : loadError ? null : reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-10 text-center">
            <p className="text-sm font-bold text-slate-200">Không có báo cáo vi phạm nào</p>
            <p className="text-xs text-slate-500 mt-0.5">Diễn đàn và kho tài liệu đang hoạt động an toàn và chuẩn mực.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-red-950/80 border border-red-800/60 px-2 py-0.5 text-[10px] font-bold text-red-400">
                      {report.targetType}
                    </span>
                    <span className="text-[11px] text-slate-400">Báo cáo bởi: {report.reportedBy} • {report.createdAt}</span>
                  </div>
                  <p className="text-xs font-semibold text-white">Lý do: &ldquo;{report.reason}&rdquo;</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setPendingAction({ kind: 'RESOLVE_REPORT', id: report.id })}
                    disabled={actionLoading === report.id}
                    className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    Đã xử lý
                  </button>
                  <button
                    onClick={() => setPendingAction({ kind: 'REJECT_REPORT', id: report.id })}
                    disabled={actionLoading === report.id}
                    className="rounded-xl bg-red-950/40 border border-red-800/50 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-900/60 transition-colors"
                  >
                    Bỏ qua
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
