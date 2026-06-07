'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/services/api.client';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

type TabKey = 'overview' | 'history' | 'reviews';

export default function ProfilePage() {
  const { user, isLoading, login, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('Đam mê công nghệ, trí tuệ nhân tạo và nghiên cứu khoa học. Luôn tìm kiếm những góc nhìn mới qua từng trang sách.');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
    if (user) setFullName(user.fullName);
  }, [user, isLoading]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await apiClient.patch<any, any>('/users/me', { fullName });
      if (user && token) {
        login({ ...user, fullName }, token, localStorage.getItem('refresh_token') || undefined);
      }
      setMessage('Cập nhật thành công!');
      setEditing(false);
    } catch (e: any) {
      setMessage('Lỗi: ' + (e.message || 'Không thể cập nhật'));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  const roleLabel = user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'LECTURER' ? 'Giảng viên' : user.role === 'CONTENT_MANAGER' ? 'Kiểm duyệt viên' : 'Sinh viên';
  const roleBadge = user.role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-100' : user.role === 'LECTURER' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100';
  const memberSince = 'Tham gia Tháng 6, 2026';

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'history', label: 'Lịch sử mượn' },
    { key: 'reviews', label: 'Đánh giá & Ghi chú' },
  ];

  const sidebarLinks = [
    { icon: '📊', label: 'Khám phá', href: '/library' },
    { icon: '🔍', label: 'Tìm kiếm', href: '/library' },
    { icon: '📚', label: 'Tủ sách của tôi', href: '/my-documents' },
    { icon: '👤', label: 'Hồ sơ cá nhân', href: '/profile', active: true },
  ];

  const settingsLinks = [
    { icon: '⚙️', label: 'Tài khoản', href: '/settings' },
    { icon: '🔔', label: 'Thông báo', href: '/settings', badge: 3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ========== LEFT SIDEBAR ========== */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-gray-100 sticky top-16 h-[calc(100vh-64px)] shrink-0 z-10">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Main Nav */}
          <nav className="space-y-1 mb-6">
            {sidebarLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  link.active
                    ? 'bg-green-50 text-green-700 shadow-sm border border-green-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Settings Section */}
          <div className="mb-6">
            <p className="px-4 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Cài đặt</p>
            <nav className="space-y-1">
              {settingsLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                  {link.badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={() => { const { logout } = useAuth; }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
          >
            <span className="text-lg">🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 min-w-0">
        {/* Cover Photo */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-10 left-1/2 w-24 h-24 bg-white/15 rounded-full blur-xl" />
          </div>
          <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-white/30 transition-all border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {/* Profile Header */}
        <div className="px-6 md:px-10 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-5 mb-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center text-5xl font-bold text-green-600 border-2 border-white">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-[3px] border-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Name & Meta */}
            <div className="flex-1 pt-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                {editing ? (
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} className="text-2xl font-bold max-w-xs" />
                ) : (
                  user.fullName
                )}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5 font-medium">@{user.email.split('@')[0]}</p>
              <div className="flex items-center flex-wrap gap-3 mt-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${roleBadge}`}>
                  <span>🎓</span> {roleLabel}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {memberSince}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-md shadow-green-600/20 disabled:opacity-50"
                  >
                    {saving ? 'Đang lưu...' : '✓ Lưu'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setFullName(user.fullName); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Tùy chỉnh
                  </button>
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-md shadow-green-600/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Chia sẻ
                  </button>
                </>
              )}
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${message.startsWith('Lỗi') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-0">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === tab.key
                      ? 'text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 md:px-10 py-8">
          {activeTab === 'overview' && <OverviewTab user={user} bio={bio} />}
          {activeTab === 'history' && <HistoryTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
        </div>
      </main>
    </div>
  );
}

/* ===================== TAB: OVERVIEW ===================== */
function OverviewTab({ user, bio }: { user: any; bio: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left Column (2/5) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Bio */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-4">
            <span className="text-lg">👤</span> Giới thiệu
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-green-50/70 rounded-xl border border-green-100/50">
              <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl shrink-0">📖</div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Đã đọc</p>
                <p className="text-2xl font-black text-gray-900 tracking-tight">128</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50/70 rounded-xl border border-blue-100/50">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0">📚</div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Đang đọc</p>
                <p className="text-2xl font-black text-gray-900 tracking-tight">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-4">
            <span className="text-lg">🏷️</span> Sở thích
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Khoa học Máy tính', 'AI & Machine Learning', 'Toán học', 'Vật lý', 'Tiểu thuyết'].map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-semibold rounded-full border border-gray-100 hover:bg-green-50 hover:text-green-700 hover:border-green-100 transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (3/5) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Continue Reading */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
              <span className="text-lg">🕐</span> Tiếp tục đọc
            </h3>
            <button className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
              Xem tất cả →
            </button>
          </div>
          <div className="space-y-4">
            <ReadingCard
              title="Lược Sử Loài Người (Sapiens)"
              author="Yuval Noah Harari"
              type="Ebook"
              progress={68}
              timeLeft="~3 giờ 15 phút"
              color="from-amber-400 to-orange-500"
            />
            <ReadingCard
              title="Clean Code"
              author="Robert C. Martin"
              type="Sách nói"
              progress={32}
              timeLeft="~5 giờ 40 phút"
              color="from-blue-400 to-indigo-500"
            />
            <ReadingCard
              title="Cấu trúc dữ liệu và giải thuật"
              author="Nguyễn Văn A"
              type="Tài liệu"
              progress={85}
              timeLeft="~45 phút"
              color="from-green-400 to-emerald-500"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-5">
            <span className="text-lg">⚡</span> Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            {[
              { action: 'Đã hoàn thành đọc', target: '"Nhập môn Machine Learning"', time: '2 giờ trước', icon: '✅' },
              { action: 'Đã đánh giá 5⭐', target: '"Lập trình Python nâng cao"', time: '1 ngày trước', icon: '⭐' },
              { action: 'Đã tải xuống', target: '"Giáo trình Vật lý đại cương"', time: '2 ngày trước', icon: '⬇️' },
              { action: 'Đã tham gia nhóm', target: '"Nghiên cứu AI - K20"', time: '3 ngày trước', icon: '👥' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-sm shrink-0 group-hover:bg-green-50 transition-colors">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{activity.action}</span>{' '}
                    <span className="font-bold text-gray-900">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== READING CARD ===================== */
function ReadingCard({ title, author, type, progress, timeLeft, color }: {
  title: string; author: string; type: string; progress: number; timeLeft: string; color: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-100 hover:shadow-sm transition-all group">
      {/* Book Cover */}
      <div className={`w-16 h-20 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}>
        <span className="text-white text-2xl">📕</span>
      </div>

      {/* Book Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-gray-900 truncate">{title}</h4>
            <p className="text-xs text-gray-500">{author}</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full shrink-0 uppercase">
            {type}
          </span>
        </div>
        {/* Progress */}
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-gray-700">{progress}% hoàn thành</span>
            <span className="text-gray-400">Còn {timeLeft}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button className="px-4 py-2 text-xs font-bold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors shrink-0 border border-green-100 opacity-0 group-hover:opacity-100">
        Đọc tiếp
      </button>
    </div>
  );
}

/* ===================== TAB: HISTORY ===================== */
function HistoryTab() {
  const history = [
    { title: 'Nhập môn Machine Learning', date: '05/06/2026', status: 'Hoàn thành', type: 'Ebook' },
    { title: 'Lập trình Python nâng cao', date: '03/06/2026', status: 'Hoàn thành', type: 'Tài liệu' },
    { title: 'Giáo trình Vật lý đại cương', date: '01/06/2026', status: 'Đang đọc', type: 'PDF' },
    { title: 'Cấu trúc dữ liệu và giải thuật', date: '28/05/2026', status: 'Đang đọc', type: 'Ebook' },
    { title: 'Mạng máy tính', date: '20/05/2026', status: 'Hoàn thành', type: 'PDF' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Lịch sử đọc & mượn tài liệu</h3>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 text-left">Tài liệu</th>
            <th className="px-6 py-4 text-left">Loại</th>
            <th className="px-6 py-4 text-left">Ngày</th>
            <th className="px-6 py-4 text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {history.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 font-bold text-gray-900">{item.title}</td>
              <td className="px-6 py-4">
                <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{item.type}</span>
              </td>
              <td className="px-6 py-4 text-gray-500">{item.date}</td>
              <td className="px-6 py-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  item.status === 'Hoàn thành'
                    ? 'bg-green-50 text-green-600 border border-green-100'
                    : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                }`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===================== TAB: REVIEWS ===================== */
function ReviewsTab() {
  const reviews = [
    { title: 'Nhập môn Machine Learning', rating: 5, comment: 'Tài liệu rất chi tiết và dễ hiểu. Phù hợp cho người mới bắt đầu.', date: '05/06/2026' },
    { title: 'Lập trình Python nâng cao', rating: 4, comment: 'Nội dung tốt, có nhiều ví dụ thực tế. Tuy nhiên phần OOP cần bổ sung thêm.', date: '03/06/2026' },
    { title: 'Mạng máy tính', rating: 5, comment: 'Giáo trình chuẩn, bao quát đầy đủ kiến thức cần thiết.', date: '20/05/2026' },
  ];

  return (
    <div className="space-y-4">
      {reviews.map((review, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-gray-900">{review.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{review.date}</p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} className={`text-sm ${j < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
