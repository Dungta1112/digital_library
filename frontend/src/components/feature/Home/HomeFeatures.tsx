'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Books,
  Robot,
  Chats,
  UsersThree,
  ArrowRight,
  ShieldCheck,
  Sparkle,
} from '@phosphor-icons/react';

export function HomeFeatures() {
  const features = [
    {
      id: 'pdf-reader',
      title: 'Kho tài liệu số',
      tagline: 'TRA CỨU VÀ ĐỌC TRỰC TUYẾN',
      description:
        'Tra cứu các giáo trình, bài giảng và tài liệu nghiên cứu hiện có trong hệ thống theo từ khóa hoặc danh mục.',
      icon: Books,
      href: '/library',
      cta: 'Khám phá kho tài liệu',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      badge: 'PDF & DOCX',
      points: [
        'Đọc tài liệu trực tiếp trên trình duyệt',
        'Lưu tài liệu yêu thích bằng tài khoản của bạn',
        'Lọc theo danh mục do hệ thống cung cấp',
      ],
    },
    {
      id: 'ai-rag',
      title: 'Trợ lý AI theo ngữ cảnh',
      tagline: 'HIỂN THỊ NGUỒN KHI API CUNG CẤP',
      description:
        'Đặt câu hỏi chung hoặc chọn một tài liệu làm ngữ cảnh. Câu trả lời và nguồn tham chiếu được hiển thị đúng theo phản hồi của dịch vụ AI.',
      icon: Robot,
      href: '/ai',
      cta: 'Trải nghiệm Trợ lý AI',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      badge: 'Công nghệ RAG AI',
      points: [
        'Giữ câu hỏi để thử lại khi yêu cầu thất bại',
        'Không tự dựng câu trả lời khi dịch vụ gặp lỗi',
        'Chỉ hiện trích dẫn có tài liệu hợp lệ',
      ],
    },
    {
      id: 'forum',
      title: 'Diễn đàn Thảo luận Học thuật',
      tagline: 'KẾT NỐI GIẢNG VIÊN & SINH VIÊN',
      description:
        'Không gian đăng bài và bình luận theo các danh mục được backend hỗ trợ.',
      icon: Chats,
      href: '/forum',
      cta: 'Tham gia diễn đàn',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
      badge: 'Cộng đồng Học thuật',
      points: [
        'Tạo bài với tiêu đề, nội dung và danh mục',
        'Bình luận trên từng chủ đề',
        'Xóa bài theo quyền do hệ thống xác nhận',
      ],
    },
    {
      id: 'study-groups',
      title: 'Nhóm Học tập Chuyên sâu',
      tagline: 'CỘNG TÁC THEO NHÓM',
      description:
        'Tạo, tham gia và trao đổi trong nhóm học tập; chia sẻ tài liệu thư viện khi backend cho phép.',
      icon: UsersThree,
      href: '/groups',
      cta: 'Xem các nhóm học tập',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      badge: 'Không gian Học nhóm',
      points: [
        'Trao đổi bằng bài viết trong nhóm',
        'Chia sẻ tài liệu đã có trong thư viện',
        'Hiển thị quyền thành viên theo dữ liệu API',
      ],
    },
  ];

  return (
    <section className="relative bg-slate-950 py-20 lg:py-28 text-white overflow-hidden border-t border-slate-800">
      {/* Background Lighting */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-full max-w-7xl bg-emerald-600/10 blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
            <Sparkle weight="fill" className="h-3.5 w-3.5" />
            4 Trụ Cột Nền Tảng
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5">
            Hệ Sinh Thái Học Tập & Nghiên Cứu Toàn Diện
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Kết hợp hoàn hảo giữa kho tài liệu chính thống của Trường Đại học Trưng Vương và công nghệ Trí tuệ Nhân tạo hiện đại nhất.
          </p>
        </div>

        {/* 4 Pillars Grid (Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-br p-8 sm:p-10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${item.color} bg-slate-900/80`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner backdrop-blur-md transition-transform group-hover:scale-110">
                      <Icon weight="duotone" className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      {item.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80 mb-2 block">
                    {item.tagline}
                  </span>

                  <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2.5 mb-8 border-t border-white/10 pt-6">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                        <ShieldCheck weight="fill" className="h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA */}
                <Link
                  href={item.href}
                  className="inline-flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20 active:scale-98"
                >
                  <span>{item.cta}</span>
                  <ArrowRight weight="bold" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
