'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin.service';
import type { SystemConfigParam } from '@/types/admin';
import {
  FloppyDisk,
  CheckCircle,
  WarningCircle,
} from '@phosphor-icons/react';

export default function AdminSystemPage() {
  const [configs, setConfigs] = useState<SystemConfigParam[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    AdminService.getConfigs()
      .then((data) => {
        if (active) setConfigs(data);
      })
      .catch((e) => {
        if (active) setErrorMsg(e instanceof Error ? e.message : 'Không thể tải cấu hình hệ thống.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const handleValueChange = (key: string, newValue: string) => {
    setConfigs((prev) =>
      prev.map((c) => (c.key === key ? { ...c, value: newValue } : c))
    );
  };

  const handleSave = async (key: string, value: string) => {
    setSavingKey(key);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await AdminService.updateConfig(key, value);
      setSuccessMsg(`Đã cập nhật cấu hình "${key}" thành công!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể lưu cấu hình.');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Cấu Hình Tham Số AI & Hệ Thống
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Thiết lập các giới hạn tải lên tài liệu, kiểm duyệt và mô hình Trí tuệ Nhân tạo phục vụ tra cứu học thuật.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 p-4 text-xs font-bold text-emerald-400 animate-fadeIn">
          <CheckCircle weight="fill" className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div role="alert" className="flex items-center gap-2 rounded-2xl bg-red-950/60 border border-red-800/60 p-4 text-xs font-bold text-red-400 animate-fadeIn">
          <WarningCircle weight="fill" className="h-4 w-4" />
          <span>{errorMsg}</span>
          {!loading && configs.length === 0 && <button type="button" onClick={() => { setErrorMsg(''); setLoading(true); setReloadKey((value) => value + 1); }} className="ml-auto underline">Thử lại</button>}
        </div>
      )}

      {/* Config Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Đang tải cấu hình hệ thống...
          </div>
        ) : errorMsg && configs.length === 0 ? null : (
          configs.map((config) => (
            <div
              key={config.key}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl"
            >
              <div className="flex-1 max-w-lg">
                <p className="text-xs font-mono font-bold text-cyan-400 mb-1">
                  {config.key}
                </p>
                <p className="text-xs text-slate-300 font-medium">
                  {config.description}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  value={config.value}
                  onChange={(e) => handleValueChange(config.key, e.target.value)}
                  className="w-full sm:w-64 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSave(config.key, config.value)}
                  disabled={savingKey === config.key}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-colors flex-shrink-0"
                >
                  <FloppyDisk weight="bold" className="h-3.5 w-3.5" />
                  {savingKey === config.key ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
