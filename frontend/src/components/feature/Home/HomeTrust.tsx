'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Books,
  Student,
  Robot,
  CheckCircle,
  ShieldCheck,
  Lightning,
  Clock,
  Sparkle,
} from '@phosphor-icons/react';

export function HomeTrust() {
  const stats = [
    {
      id: 'stat-docs',
      number: '15,000+',
      label: 'Tài liệu & Giáo trình số',
      sublabel: 'Được kiểm duyệt và chuẩn hóa toàn văn',
      icon: Books,
      color: 'text-emerald-400',
    },
    {
      id: 'stat-users',
      number: '10,000+',
      label: 'Sinh viên & Giảng viên',
      sublabel: 'Trường Đại học Trưng Vương học tập thường xuyên',
      icon: Student,
      color: 'text-blue-400',
    },
    {
      id: 'stat-ai',
      number: '120,000+',
      label: 'Câu hỏi AI đã giải đáp',
      sublabel: 'Hỗ trợ tra cứu trích dẫn số trang chính xác',
      icon: Robot,
      color: 'text-cyan-400',
    },
    {
      id: 'stat-accuracy',
      number: '100%',
      label: 'Đối soát Nguồn học liệu',
      sublabel: 'Phản hồi không bịa đặt (Anti-Hallucination)',
      icon: ShieldCheck,
      color: 'text-amber-400',
    },
  ];

  const badges = [
    { label: 'Hệ thống số hóa 24/7', icon: Clock },
    { label: 'Tốc độ phản hồi < 2 giây', icon: Lightning },
    { label: 'Chuẩn tiếp cận WCAG 2.1 AA', icon: CheckCircle },
    { label: 'Trích dẫn trang tự động', icon: Sparkle },
  ];

  return (
    <section className="relative bg-slate-950 py-20 lg:py-28 text-white border-t border-slate-800 overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-full max-w-5xl bg-emerald-600/10 blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
            <Sparkle weight="fill" className="h-3.5 w-3.5" />
            HIỆU NĂNG & ĐỘ TIN CẬY HỌC THUẬT
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Đồng Hành Cùng Sự Nghiệp Học Tập & Nghiên Cứu
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Hệ thống thư viện số Trường Đại học Trưng Vương được xây dựng nhằm mang lại trải nghiệm tra cứu tri thức chuẩn xác, nhanh chóng và tin cậy nhất.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white mb-6">
                    <Icon weight="duotone" className={`h-6 w-6 ${item.color}`} />
                  </div>

                  <p className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                    {item.number}
                  </p>

                  <h3 className="text-base font-bold text-slate-200 mb-2">
                    {item.label}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-4 mt-2">
                  {item.sublabel}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Quality Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {badges.map((b) => {
            const BIcon = b.icon;

            return (
              <div
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-5 py-2.5 text-xs font-bold text-slate-300 shadow-md backdrop-blur-md"
              >
                <BIcon weight="fill" className="h-4 w-4 text-emerald-400" />
                <span>{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
