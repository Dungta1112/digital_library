'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.5)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="group flex flex-shrink-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-red-100 transition-transform group-hover:scale-105">
                <Image
                  src="/trung-vuong-university-logo.svg"
                  alt="Trung Vuong University"
                  width={40}
                  height={40}
                  priority
                />
              </div>
              <span className="hidden flex-col leading-none sm:flex">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-red-700 dark:text-red-400">
                  Trung Vuong
                </span>
                <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Thư viện<span className="text-green-600 dark:text-green-400">Số</span>
                </span>
              </span>
            </Link>

            <div className="hidden lg:ml-10 lg:flex lg:space-x-2">
              {navLinks.map((link) => {
                const active =
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                      active
                        ? 'bg-green-50 text-green-700 shadow-sm dark:bg-green-900/30 dark:text-green-400'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 rounded-full border border-transparent p-1.5 transition-colors hover:border-gray-200 hover:bg-gray-50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                >
                  <div className="hidden flex-col items-end sm:flex">
                    <span className="text-sm font-bold leading-none text-gray-900 dark:text-white">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-700 shadow-sm dark:bg-green-900 dark:text-green-300">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-1 border-b border-gray-100 px-4 py-3 dark:border-slate-800">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{user.fullName}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>

                    <Link href="/profile" className="block px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-green-400">
                      Hồ sơ cá nhân
                    </Link>
                    <Link href="/my-documents" className="block px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-green-400">
                      Tài liệu của tôi
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-green-400">
                      Cài đặt
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="block border-t border-purple-100 bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700 transition-colors hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50">
                        Quản trị hệ thống
                      </Link>
                    )}

                    <div className="mt-1 border-t border-gray-100 pt-1 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
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
                  <Button variant="secondary" size="sm" className="border-gray-200 font-bold shadow-sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button size="sm" className="font-bold shadow-md shadow-green-600/20">
                    Bắt đầu ngay
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="no-scrollbar mt-1 flex gap-2 overflow-x-auto border-t border-gray-50 py-3 dark:border-slate-800 lg:hidden">
          {navLinks.map((link) => {
            const active =
              pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold shadow-sm transition-colors ${
                  active
                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
