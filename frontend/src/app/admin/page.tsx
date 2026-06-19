'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

import { AdminDashboard } from '@/components/feature/Admin/AdminDashboard';
import { UserManagement } from '@/components/feature/Admin/UserManagement';
import { DocManagement } from '@/components/feature/Admin/DocManagement';
import { ForumManagement } from '@/components/feature/Admin/ForumManagement';
import { ReportManagement } from '@/components/feature/Admin/ReportManagement';
import { SystemConfig } from '@/components/feature/Admin/SystemConfig';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
       if (!user || user.role !== 'ADMIN') {
         router.push('/');
       }
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div></div>;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
    { id: 'users', label: 'Ng.dùng & Phân quyền', icon: '👥' },
    { id: 'docs', label: 'Kiểm duyệt tài liệu', icon: '📑' },
    { id: 'forum', label: 'Kiểm duyệt diễn đàn', icon: '💬' },
    { id: 'reports', label: 'Xử lý báo cáo', icon: '🚩' },
    { id: 'settings', label: 'Cấu hình hệ thống', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'users': return <UserManagement />;
      case 'docs': return <DocManagement />;
      case 'forum': return <ForumManagement />;
      case 'reports': return <ReportManagement />;
      case 'settings': return <SystemConfig />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar - Antd Style */}
      <aside className="w-full md:w-64 bg-[#001529] dark:bg-slate-900 border-r border-transparent dark:border-slate-800 text-white shrink-0 md:min-h-[calc(100vh-64px)] flex flex-col transition-all duration-300">
        <div className="p-5 border-b border-gray-800 dark:border-slate-800 flex items-center gap-3 transition-colors duration-300">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-bold text-white shadow-lg">A</div>
          <span className="font-bold text-lg tracking-wide">Admin Portal</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white font-semibold' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-lg opacity-80">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800 dark:border-slate-800 text-xs text-gray-500 dark:text-gray-400 text-center transition-colors duration-300">
          SDL Admin ©2026
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header (Breadcrumb / Title bar) */}
        <header className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between shrink-0 shadow-sm z-10 transition-colors duration-300">
          <h1 className="text-xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2 transition-colors duration-300">
             {menuItems.find(m => m.id === activeTab)?.icon} 
             {menuItems.find(m => m.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-300">Xin chào, {user?.fullName || 'Quản trị viên'}</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold transition-colors duration-300">
               {user?.fullName?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
