'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { QuickSearchModal } from '@/components/feature/Home/QuickSearchModal';
import { MagnifyingGlass, Command } from '@phosphor-icons/react';

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname() || '/';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Kho tài liệu', href: '/library' },
    { name: 'Trợ lý AI', href: '/ai' },
    { name: 'Diễn đàn', href: '/forum' },
    { name: 'Nhóm học tập', href: '/groups' },
  ];

  if (user?.role === 'ADMIN' || user?.role === 'CONTENT_MANAGER') {
    navLinks.push({ name: 'Quản trị', href: '/admin/dashboard' });
  }

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.06)] backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          
          {/* 1. Logo & Tên Trường (Bên trái) */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-red-200/80 transition-transform group-hover:scale-105">
              <Image
                src="/trung-vuong-university-logo.svg"
                alt="Đại học Trưng Vương"
                width={38}
                height={38}
                priority
              />
            </div>
            <div className="hidden flex-col leading-none sm:flex">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-red-700 dark:text-red-400">
                Đại học Trưng Vương
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Thư viện<span className="text-emerald-600 dark:text-emerald-400">Số AI</span>
              </span>
            </div>
          </Link>

          {/* 2. Menu Điều Hướng Chính (Ở giữa - Tuyệt đối chống rớt dòng chữ) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`whitespace-nowrap flex-shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs ring-1 ring-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/60'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. Ô Tìm kiếm & Profile bên phải */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Search Button Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center justify-between w-44 lg:w-56 px-3.5 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 transition-all shadow-inner group"
            >
              <span className="flex items-center gap-2 truncate">
                <MagnifyingGlass weight="bold" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="truncate">Tìm tài liệu, hỏi AI...</span>
              </span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[9px] font-bold text-slate-600 dark:text-slate-300 shadow-xs flex-shrink-0">
                <Command weight="bold" className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Tìm kiếm (Ctrl+K)"
            >
              <MagnifyingGlass weight="bold" className="w-5 h-5" />
            </button>

            <ThemeToggle />

            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 transition-colors hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                >
                  <div className="hidden flex-col items-end sm:flex leading-tight">
                    <span className="text-xs font-bold text-slate-900 dark:text-white max-w-[120px] truncate">
                      {user.fullName}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 font-bold text-xs text-white shadow-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-100 bg-white py-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-fadeIn">
                    <div className="mb-1 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullName}</p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
                      <span className="mt-1 inline-block rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      href="/my-documents"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                    >
                      Tài liệu của tôi
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                    >
                      Cài đặt tài khoản
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block border-t border-purple-100 bg-purple-50/80 px-4 py-2 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/50"
                      >
                        ⚡ Không gian Quản trị Admin
                      </Link>
                    )}

                    <div className="mt-1 border-t border-slate-100 pt-1 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="secondary" size="sm" className="border-slate-200 dark:border-slate-700 text-xs font-bold shadow-xs rounded-xl px-3 py-1.5">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button size="sm" className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm px-3 py-1.5">
                    Bắt đầu ngay
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-slate-100 py-2 dark:border-slate-800 lg:hidden px-4">
          {navLinks.map((link) => {
            const active =
              pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`whitespace-nowrap flex-shrink-0 rounded-full border px-3 py-1 text-xs font-bold shadow-xs transition-colors ${
                  active
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Global Quick Search Modal */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export const Header = Navbar;
