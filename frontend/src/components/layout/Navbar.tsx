'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname() || '/';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Thư viện', href: '/library' },
    { name: 'Trợ lý AI', href: '/ai' },
    { name: 'Diễn đàn', href: '/forum' },
    { name: 'Nhóm học tập', href: '/groups' },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'Quản trị', href: '/admin' });
  }

  return (
    <nav className="bg-white dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.5)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/60 transition-colors">
                <span className="text-xl">🎓</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white hidden sm:block">Thư viện<span className="text-green-600 dark:text-green-400">Số</span></span>
            </Link>
            <div className="hidden lg:ml-10 lg:flex lg:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-24 h-9 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-lg" />
              </div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 p-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                >
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">{user.fullName}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{user.role}</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center font-bold shadow-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 mb-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{user.fullName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    <Link href="/profile" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      Hồ sơ cá nhân
                    </Link>
                    <Link href="/my-documents" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      Tài liệu của tôi
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      Cài đặt
                    </Link>
                    
                    {user?.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border-t border-purple-100 dark:border-purple-900/50">
                        Quản trị hệ thống
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 dark:border-slate-800 mt-1 pt-1">
                      <button 
                        onClick={() => { setIsDropdownOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="secondary" size="sm" className="font-bold border-gray-200 shadow-sm">Đăng nhập</Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button size="sm" className="font-bold shadow-md shadow-green-600/20">Bắt đầu ngay</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* Mobile Navigation */}
        <div className="lg:hidden overflow-x-auto py-3 flex gap-2 no-scrollbar border-t border-gray-50 dark:border-slate-800 mt-1">
           {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`whitespace-nowrap px-4 py-1.5 text-xs font-bold rounded-full border shadow-sm transition-colors ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
}
