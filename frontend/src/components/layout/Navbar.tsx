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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
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

  if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'Quản trị', href: '/admin' });
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.06)] backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.5)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-6">
              <Link href="/" className="group flex flex-shrink-0 items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-red-200/80 transition-transform group-hover:scale-105">
                  <Image
                    src="/trung-vuong-university-logo.svg"
                    alt="Đại học Trưng Vương"
                    width={38}
                    height={38}
                    priority
                  />
                </div>
                <span className="hidden flex-col leading-none sm:flex">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-red-700 dark:text-red-400">
                    Đại học Trưng Vương
                  </span>
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Thư viện<span className="text-emerald-600 dark:text-emerald-400">Số AI</span>
                  </span>
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden xl:flex xl:space-x-1">
                {navLinks.map((link) => {
                  const active =
                    pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`inline-flex items-center rounded-xl px-3.5 py-2 text-sm font-bold transition-all ${
                        active
                          ? 'bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Search Bar [Ctrl+K] */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 transition-all shadow-inner group"
              >
                <span className="flex items-center gap-2">
                  <MagnifyingGlass weight="bold" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  Tìm tài liệu, hỏi AI...
                </span>
                <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-xs">
                  <Command weight="bold" className="w-2.5 h-2.5" /> K
                </kbd>
              </button>
            </div>

            {/* Right Action Menu & Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Search Button */}
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
                    className="flex items-center gap-2.5 rounded-full border border-transparent p-1 transition-colors hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <div className="hidden flex-col items-end sm:flex">
                      <span className="text-sm font-bold leading-none text-slate-900 dark:text-white">
                        {user.fullName}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {user.role}
                      </span>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 shadow-sm dark:bg-emerald-900/60 dark:text-emerald-300">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-100 bg-white py-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-1 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user.fullName}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                      >
                        Hồ sơ cá nhân
                      </Link>
                      <Link
                        href="/my-documents"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                      >
                        Tài liệu của tôi
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                      >
                        Cài đặt tài khoản
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block border-t border-purple-100 bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700 transition-colors hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
                        >
                          Cổng Quản trị hệ thống
                        </Link>
                      )}

                      <div className="mt-1 border-t border-slate-100 pt-1 dark:border-slate-800">
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
                <div className="flex items-center gap-2.5">
                  <Link href="/login">
                    <Button variant="secondary" size="sm" className="border-slate-200 dark:border-slate-700 font-bold shadow-sm rounded-xl">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register" className="hidden sm:block">
                    <Button size="sm" className="font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md shadow-emerald-700/20">
                      Bắt đầu ngay
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Sub-bar */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-slate-100 py-2.5 dark:border-slate-800 xl:hidden">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-1 text-xs font-bold shadow-xs transition-colors ${
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
        </div>
      </nav>

      {/* Global Command Palette Quick Search Modal */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
