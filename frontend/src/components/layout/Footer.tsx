'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  Globe,
  FacebookLogo,
  TiktokLogo,
  YoutubeLogo,
  Clock,
  ShieldCheck,
  Books,
} from '@phosphor-icons/react';

export function Footer() {
  const pathname = usePathname() || '/';
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="relative bg-slate-950 text-white border-t border-slate-800 transition-colors">
      {/* Top Banner with University Highlight */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ring-2 ring-red-500/30 overflow-hidden shrink-0">
                <Image
                  src="/trung-vuong-university-logo.svg"
                  alt="Trường Đại học Trưng Vương"
                  width={44}
                  height={44}
                  priority
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Trường Đại học Trưng Vương (Trung Vuong University)
                </h3>
                <p className="text-xs text-slate-400">
                  Hệ thống Thư viện số & Nền tảng Học thuật Tích hợp Trí tuệ Nhân tạo AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 px-4 py-2 text-xs font-bold text-emerald-400 border border-emerald-800/60">
                <Clock weight="fill" className="h-4 w-4" />
                Hệ thống mở cửa 24/7 (Always Open)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Contact Info */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Contact Information (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Thông Tin Liên Hệ & Trụ Sở
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin weight="fill" className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Địa chỉ:</strong> Tòa nhà Hồ Gươm Plaza, Số 102 Trần Phú, Phường Mộ Lao / Hà Đông, TP. Hà Nội, Việt Nam.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone weight="fill" className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Hotline tuyển sinh & hỗ trợ:</strong>{' '}
                  <a href="tel:0981266225" className="hover:text-emerald-400 transition-colors font-semibold">
                    098 126 62 25
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeSimple weight="fill" className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Email chính thức:</strong>{' '}
                  <a href="mailto:tuyensinhchinhquy@tv-uni.edu.vn" className="hover:text-emerald-400 transition-colors font-semibold">
                    tuyensinhchinhquy@tv-uni.edu.vn
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Globe weight="fill" className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Website trường:</strong>{' '}
                  <a href="https://tv-uni.edu.vn" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors font-semibold">
                    tv-uni.edu.vn
                  </a>
                </span>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com/TruongDaihocTrungVuong"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all text-slate-400"
                title="Facebook: TruongDaihocTrungVuong"
              >
                <FacebookLogo weight="fill" className="h-5 w-5" />
              </a>
              <a
                href="https://tiktok.com/@daihoctrungvuong"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-pink-600 hover:border-pink-500 hover:text-white transition-all text-slate-400"
                title="Kênh số: daihoctrungvuong"
              >
                <TiktokLogo weight="fill" className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@daihoctrungvuong"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-600 hover:border-red-500 hover:text-white transition-all text-slate-400"
                title="Youtube: daihoctrungvuong"
              >
                <YoutubeLogo weight="fill" className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Khám Phá
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-emerald-400 transition-colors">
                  Kho tài liệu giáo trình
                </Link>
              </li>
              <li>
                <Link href="/ai" className="hover:text-emerald-400 transition-colors">
                  Trợ lý AI RAG
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-emerald-400 transition-colors">
                  Diễn đàn học thuật
                </Link>
              </li>
              <li>
                <Link href="/groups" className="hover:text-emerald-400 transition-colors">
                  Nhóm học tập môn học
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Resources (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Tài Nguyên
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/library?q=Khoa+học+máy+tính" className="hover:text-emerald-400 transition-colors">
                  Công nghệ thông tin
                </Link>
              </li>
              <li>
                <Link href="/library?q=Kinh+tế" className="hover:text-emerald-400 transition-colors">
                  Kinh tế - Tài chính
                </Link>
              </li>
              <li>
                <Link href="/library?q=Toán" className="hover:text-emerald-400 transition-colors">
                  Toán học & Thống kê
                </Link>
              </li>
              <li>
                <Link href="/library?q=Quản+trị" className="hover:text-emerald-400 transition-colors">
                  Quản trị kinh doanh
                </Link>
              </li>
              <li>
                <Link href="/library?q=Ngoại+ngữ" className="hover:text-emerald-400 transition-colors">
                  Ngôn ngữ Anh
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Policy & Security (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Chính Sách & Bảo Mật
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tài liệu học thuật được bảo vệ bản quyền thuộc Trường Đại học Trưng Vương và các tác giả. Hệ thống đảm bảo an toàn dữ liệu và tuân thủ các quy chuẩn học thuật liêm chính.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <ShieldCheck weight="fill" className="h-4 w-4 text-emerald-400" />
              <span>Chứng nhận Dữ liệu Học thuật Số</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Trường Đại học Trưng Vương. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-6">
            <span>Phiên bản số hóa TV-DigitalLibrary v2.5</span>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Điều khoản dịch vụ
            </Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Quy định bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}