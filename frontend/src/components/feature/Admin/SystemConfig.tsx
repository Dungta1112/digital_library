'use client';
import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin.service';
import { SystemConfigParam } from '@/types/admin';
import { Button } from '@/components/ui/Button';

export function SystemConfig() {
  const [configs, setConfigs] = useState<SystemConfigParam[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getSystemConfigs();
      setConfigs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleChange = (key: string, value: any) => {
    setConfigs(prev => prev.map(c => c.key === key ? { ...c, value } : c));
  };

  const handleSave = async (key: string, value: any) => {
    setSavingKey(key);
    await AdminService.updateSystemConfig(key, value);
    alert('Mock: Đã lưu cấu hình thành công!');
    setSavingKey(null);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  const groups = ['GENERAL', 'LIBRARY', 'SECURITY'];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Cấu hình hệ thống</h2>
        <div className="text-sm text-gray-500">Thay đổi các tham số hoạt động của hệ thống</div>
      </div>
      
      <div className="p-6">
        {groups.map(group => {
          const groupConfigs = configs.filter(c => c.group === group);
          if (groupConfigs.length === 0) return null;
          
          return (
            <div key={group} className="mb-8 last:mb-0">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                {group === 'GENERAL' ? 'Cài đặt chung' : group === 'LIBRARY' ? 'Thư viện số' : 'Bảo mật'}
              </h3>
              
              <div className="space-y-4">
                {groupConfigs.map(config => (
                  <div key={config.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{config.label}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{config.key}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {config.type === 'boolean' ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={config.value as boolean}
                            onChange={(e) => handleChange(config.key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      ) : (
                        <input 
                          type={config.type} 
                          className="border border-gray-300 rounded-lg text-sm px-3 py-2 w-32 focus:ring-green-500 focus:border-green-500"
                          value={config.value as string | number}
                          onChange={(e) => handleChange(config.key, config.type === 'number' ? Number(e.target.value) : e.target.value)}
                        />
                      )}
                      <Button 
                        size="sm"
                        disabled={savingKey === config.key}
                        onClick={() => handleSave(config.key, config.value)}
                        className="shadow-sm"
                      >
                        {savingKey === config.key ? 'Đang lưu...' : 'Lưu'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
