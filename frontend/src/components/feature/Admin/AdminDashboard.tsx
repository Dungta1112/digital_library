'use client';
import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin.service';
import { SystemStats } from '@/types/admin';

export function StatCard({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-semibold mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value.toLocaleString()}</h3>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminService.getStats().then(s => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu tổng quan...</div>;
  }

  // Fake chart data
  const chartData = [40, 60, 45, 80, 50, 90, 75];
  const maxVal = Math.max(...chartData);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Tổng số người dùng" value={stats.totalUsers} icon="👥" color="bg-blue-100 text-blue-700" />
        <StatCard title="Tổng số tài liệu" value={stats.totalDocuments} icon="📚" color="bg-green-100 text-green-700" />
        <StatCard title="Nhóm học tập" value={stats.totalGroups} icon="🎓" color="bg-purple-100 text-purple-700" />
        <StatCard title="Hoạt động hôm nay" value={stats.activeUsersToday} icon="🔥" color="bg-orange-100 text-orange-700" />
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Lưu lượng truy cập tuần qua</h3>
        <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
          {chartData.map((val, idx) => (
            <div key={idx} className="w-full flex flex-col items-center gap-2 group">
              <div 
                className="w-full bg-blue-100 group-hover:bg-blue-500 transition-all rounded-t-lg relative"
                style={{ height: `${(val / maxVal) * 100}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded font-bold transition-opacity">
                  {val}k
                </div>
              </div>
              <span className="text-xs font-medium text-gray-400">T{idx + 2 === 8 ? 'CN' : idx + 2}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
           <h3 className="text-lg font-bold text-gray-900 mb-4">Hoạt động hệ thống</h3>
           <div className="space-y-4">
             <div className="flex items-center gap-4 text-sm">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <p className="flex-1 text-gray-600">Người dùng <span className="font-bold text-gray-900">Jane Doe</span> vừa tải lên tài liệu mới</p>
               <span className="text-gray-400">5p trước</span>
             </div>
             <div className="flex items-center gap-4 text-sm">
               <div className="w-2 h-2 rounded-full bg-orange-500"></div>
               <p className="flex-1 text-gray-600">Có 2 báo cáo vi phạm mới trên Diễn đàn</p>
               <span className="text-gray-400">10p trước</span>
             </div>
             <div className="flex items-center gap-4 text-sm">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <p className="flex-1 text-gray-600">Người dùng mới <span className="font-bold text-gray-900">John Smith</span> vừa đăng ký</p>
               <span className="text-gray-400">1h trước</span>
             </div>
           </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">🚀</div>
           <div>
             <h3 className="text-lg font-bold mb-2 opacity-90">Phiên bản Hệ thống</h3>
             <p className="text-3xl font-black tracking-tight mb-1">v2.4.0</p>
             <p className="text-sm opacity-80 mb-6">Cập nhật lần cuối: Hôm nay</p>
           </div>
           <div>
             <p className="text-sm font-medium">Trạng thái: <span className="text-green-300 font-bold ml-1">Hoạt động ổn định</span></p>
           </div>
        </div>
      </div>
    </div>
  );
}
