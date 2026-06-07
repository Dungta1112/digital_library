'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <span className="text-xl">🎓</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:block">Thư viện<span className="text-green-600">Số</span></span>
            </Link>
            <div className="hidden lg:ml-10 lg:flex lg:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                      ? 'bg-green-50 text-green-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-24 h-9 bg-gray-100 animate-pulse rounded-lg" />
              </div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-900 leading-none">{user.fullName}</span>
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{user.role}</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold shadow-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link href="/profile" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
                      Hồ sơ cá nhân
                    </Link>
                    <Link href="/my-documents" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
                      Tài liệu của tôi
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors">
                      Cài đặt
                    </Link>
                    
                    {user?.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors border-t border-purple-100">
                        Quản trị hệ thống
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button 
                        onClick={() => { setIsDropdownOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors"
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
        <div className="lg:hidden overflow-x-auto py-3 flex gap-2 no-scrollbar border-t border-gray-50 mt-1">
           {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`whitespace-nowrap px-4 py-1.5 text-xs font-bold rounded-full border shadow-sm transition-colors ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
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
