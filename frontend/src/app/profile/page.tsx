'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/services/api.client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { 
  Compass, MagnifyingGlass, Books, UserCircle, Gear, Bell, SignOut, 
  User, CheckCircle, Star, DownloadSimple, Users, BookOpenText, 
  ArrowRight, Book, GraduationCap, CalendarBlank, PencilSimple, ShareNetwork, ClockCounterClockwise
} from '@phosphor-icons/react';

type TabKey = 'overview' | 'history' | 'reviews';

export default function ProfilePage() {
  const { user, isLoading, login, token, logout } = useAuth();
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const roleLabel = user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'LECTURER' ? 'Giảng viên' : user.role === 'CONTENT_MANAGER' ? 'Kiểm duyệt viên' : 'Sinh viên';
  const roleBadge = user.role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50' : user.role === 'LECTURER' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50' : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
  const memberSince = 'Tham gia Tháng 6, 2026';

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'history', label: 'Lịch sử mượn' },
    { key: 'reviews', label: 'Đánh giá & Ghi chú' },
  ];

  const sidebarLinks = [
    { icon: <Compass weight="duotone" className="w-5 h-5" />, label: 'Khám phá', href: '/library' },
    { icon: <MagnifyingGlass weight="duotone" className="w-5 h-5" />, label: 'Tìm kiếm', href: '/library' },
    { icon: <Books weight="duotone" className="w-5 h-5" />, label: 'Tủ sách của tôi', href: '/my-documents' },
    { icon: <UserCircle weight="duotone" className="w-5 h-5" />, label: 'Hồ sơ cá nhân', href: '/profile', active: true },
  ];

  const settingsLinks = [
    { icon: <Gear weight="duotone" className="w-5 h-5" />, label: 'Cài đặt tài khoản', href: '/settings' },
    { icon: <Bell weight="duotone" className="w-5 h-5" />, label: 'Thông báo', href: '/settings', badge: 3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* ========== LEFT SIDEBAR ========== */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 sticky top-16 h-[calc(100vh-64px)] shrink-0 z-10 transition-colors duration-300">
        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          {/* Main Nav */}
          <nav className="space-y-1.5 mb-8">
            {sidebarLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  link.active
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Settings Section */}
          <div className="mb-6">
            <p className="px-4 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hệ thống</p>
            <nav className="space-y-1.5">
              {settingsLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent transition-all"
                >
                  {link.icon}
                  {link.label}
                  {link.badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-slate-200/80 dark:border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all w-full"
          >
            <SignOut weight="bold" className="w-5 h-5" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 min-w-0">
        {/* Cover Photo - Darker, academic feel */}
        <div className="relative h-56 md:h-72 bg-emerald-950 overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-800 via-emerald-950 to-slate-950"></div>
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>

        {/* Profile Header */}
        <div className="px-6 md:px-12 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-36 h-36 rounded-[2rem] bg-white dark:bg-slate-900 p-1.5 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full rounded-[1.7rem] bg-emerald-50 dark:bg-slate-800 flex items-center justify-center text-5xl font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-slate-700">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Name & Meta */}
            <div className="flex-1 pt-4 pb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                {editing ? (
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} className="text-2xl font-bold max-w-xs bg-white dark:bg-slate-800" />
                ) : (
                  user.fullName
                )}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">@{user.email.split('@')[0]}</p>
              <div className="flex items-center flex-wrap gap-4 mt-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border uppercase tracking-wider ${roleBadge}`}>
                  <GraduationCap weight="bold" className="w-4 h-4" /> {roleLabel}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CalendarBlank weight="bold" className="w-4 h-4 text-slate-400" />
                  {memberSince}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 pb-2 md:pb-4 mt-4 md:mt-0">
              {editing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-11 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm active:scale-95 transition-all font-semibold"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => { setEditing(false); setFullName(user.fullName); }}
                    className="h-11 px-6 rounded-xl font-semibold"
                  >
                    Hủy
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setEditing(true)}
                    className="h-11 px-5 rounded-xl font-semibold shadow-sm flex items-center gap-2"
                  >
                    <PencilSimple weight="bold" className="w-4 h-4" /> Tùy chỉnh
                  </Button>
                  <Button className="h-11 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm active:scale-95 transition-all font-semibold flex items-center gap-2">
                    <ShareNetwork weight="bold" className="w-4 h-4" /> Chia sẻ
                  </Button>
                </>
              )}
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${message.startsWith('Lỗi') ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50' : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50'}`}>
              {message}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex gap-8 px-2">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative pb-4 pt-2 text-sm font-bold transition-all uppercase tracking-wider ${
                    activeTab === tab.key
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 md:px-12 py-8">
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8 transition-colors duration-300">
          <h3 className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
            <UserCircle weight="duotone" className="w-6 h-6 text-emerald-600 dark:text-emerald-500" /> 
            Giới thiệu
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{bio}</p>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8 transition-colors duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-start gap-3 p-5 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle weight="bold" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Đã đọc</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">128</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <BookOpenText weight="bold" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Đang đọc</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8 transition-colors duration-300">
          <h3 className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
            <Books weight="duotone" className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            Sở thích
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {['Khoa học Máy tính', 'AI & Machine Learning', 'Toán học', 'Vật lý', 'Tiểu thuyết'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[13px] font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 dark:hover:border-emerald-800 transition-colors cursor-pointer shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (3/5) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Continue Reading */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white tracking-tight">
              <ClockCounterClockwise weight="duotone" className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
              Tiếp tục đọc
            </h3>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors flex items-center gap-1">
              Xem tất cả <ArrowRight weight="bold" className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <ReadingCard
              title="Lược Sử Loài Người (Sapiens)"
              author="Yuval Noah Harari"
              type="Ebook"
              progress={68}
              timeLeft="~3 giờ 15 phút"
              color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            />
            <ReadingCard
              title="Clean Code"
              author="Robert C. Martin"
              type="Sách nói"
              progress={32}
              timeLeft="~5 giờ 40 phút"
              color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            />
            <ReadingCard
              title="Cấu trúc dữ liệu và giải thuật"
              author="Nguyễn Văn A"
              type="Tài liệu"
              progress={85}
              timeLeft="~45 phút"
              color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8 transition-colors duration-300">
          <h3 className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            <UserCircle weight="duotone" className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            Hoạt động gần đây
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:to-transparent dark:before:from-slate-800">
            {[
              { action: 'Đã hoàn thành đọc', target: '"Nhập môn Machine Learning"', time: '2 giờ trước', icon: <CheckCircle weight="fill" className="w-5 h-5 text-emerald-500" /> },
              { action: 'Đã đánh giá 5⭐', target: '"Lập trình Python nâng cao"', time: '1 ngày trước', icon: <Star weight="fill" className="w-5 h-5 text-amber-500" /> },
              { action: 'Đã tải xuống', target: '"Giáo trình Vật lý đại cương"', time: '2 ngày trước', icon: <DownloadSimple weight="bold" className="w-5 h-5 text-blue-500" /> },
              { action: 'Đã tham gia nhóm', target: '"Nghiên cứu AI - K20"', time: '3 ngày trước', icon: <Users weight="bold" className="w-5 h-5 text-indigo-500" /> },
            ].map((activity, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-transform group-hover:scale-110">
                  {activity.icon}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-sm group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-colors">
                  <div className="flex flex-col mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{activity.action}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-[15px]">{activity.target}</span>
                  </div>
                  <time className="text-xs font-medium text-slate-400 dark:text-slate-500">{activity.time}</time>
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
    <div className="flex items-center gap-5 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all group">
      {/* Book Cover */}
      <div className={`w-16 h-20 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${color}`}>
        <Book weight="duotone" className="w-8 h-8 opacity-80" />
      </div>

      {/* Book Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="min-w-0">
            <h4 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{title}</h4>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{author}</p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md shrink-0 uppercase tracking-wider">
            {type}
          </span>
        </div>
        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-2 font-medium">
            <span className="text-slate-700 dark:text-slate-300">{progress}% hoàn thành</span>
            <span className="text-slate-400">Còn {timeLeft}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button className="w-10 h-10 flex items-center justify-center text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
        <ArrowRight weight="bold" className="w-5 h-5" />
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
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <BookOpenText weight="duotone" className="w-6 h-6 text-emerald-600" />
          Lịch sử đọc & mượn tài liệu
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-8 py-5">Tài liệu</th>
              <th className="px-8 py-5">Loại</th>
              <th className="px-8 py-5">Ngày mượn</th>
              <th className="px-8 py-5">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-8 py-5 font-bold text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.title}</td>
                <td className="px-8 py-5">
                  <span className="text-[11px] font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md uppercase tracking-wider">{item.type}</span>
                </td>
                <td className="px-8 py-5 text-slate-500 dark:text-slate-400 font-medium">{item.date}</td>
                <td className="px-8 py-5">
                  <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border ${
                    item.status === 'Hoàn thành'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50'
                      : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="space-y-6">
      {reviews.map((review, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8 hover:shadow-md hover:border-emerald-500/30 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{review.title}</h4>
              <p className="text-xs text-slate-400 font-medium">{review.date}</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/30">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} weight={j < review.rating ? "fill" : "regular"} className={`w-4 h-4 ${j < review.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
