'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Code,
  ChartLineUp,
  Brain,
  Calculator,
  Translate,
  Briefcase,
  ArrowRight,
  Atom,
} from '@phosphor-icons/react';

export function HomeCategories() {
  const categories = [
    {
      id: 'cntt',
      name: 'Khoa học Máy tính & CNTT',
      code: 'CS-IT',
      description: 'Cơ sở dữ liệu, Lập trình Web/Mobile, Cấu trúc dữ liệu, Trí tuệ nhân tạo, Mạng máy tính.',
      docCount: '1,420+ giáo trình',
      icon: Code,
      query: 'Khoa học máy tính',
      gradient: 'from-blue-600/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    },
    {
      id: 'kinhte',
      name: 'Kinh tế & Tài chính - Ngân hàng',
      code: 'ECO-FIN',
      description: 'Kinh tế vi mô, Kinh tế vĩ mô, Tài chính doanh nghiệp, Đầu tư chứng khoán, Ngân hàng thương mại.',
      docCount: '1,180+ giáo trình',
      icon: ChartLineUp,
      query: 'Kinh tế',
      gradient: 'from-emerald-600/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'toan',
      name: 'Toán cao cấp & Thống kê Dữ liệu',
      code: 'MATH-STAT',
      description: 'Giải tích, Đại số tuyến tính, Xác suất thống kê, Tối ưu hóa, Toán rời rạc ứng dụng.',
      docCount: '860+ giáo trình',
      icon: Calculator,
      query: 'Toán',
      gradient: 'from-purple-600/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    },
    {
      id: 'qtkd',
      name: 'Quản trị Kinh doanh & Marketing',
      code: 'BUS-MKT',
      description: 'Quản trị học, Quản trị nhân sự, Marketing số, Khởi nghiệp kinh doanh, Chuỗi cung ứng.',
      docCount: '950+ giáo trình',
      icon: Briefcase,
      query: 'Quản trị kinh doanh',
      gradient: 'from-amber-600/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    },
    {
      id: 'ngoaingu',
      name: 'Ngoại ngữ & Ngôn ngữ Anh',
      code: 'ENG-LANG',
      description: 'Tiếng Anh học thuật (IELTS/TOEIC), Tiếng Anh chuyên ngành, Ngữ pháp học, Biên phiên dịch.',
      docCount: '780+ giáo trình',
      icon: Translate,
      query: 'Ngoại ngữ',
      gradient: 'from-rose-600/20 to-red-500/10 border-rose-500/30 text-rose-400',
    },
    {
      id: 'vatly',
      name: 'Vật lý & Khoa học Ứng dụng',
      code: 'PHYS-APP',
      description: 'Vật lý đại cương, Điện tử học, Cơ học lượng tử, Khoa học dữ liệu vật lý.',
      docCount: '620+ giáo trình',
      icon: Atom,
      query: 'Vật lý',
      gradient: 'from-indigo-600/20 to-violet-500/10 border-indigo-500/30 text-indigo-400',
    },
  ];

  return (
    <section className="relative bg-slate-900 py-20 lg:py-28 text-white border-t border-slate-800 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 block">
              DANH MỤC ĐÀO TẠO & HỌC PHẦN
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Khám Phá Các Ngành Học Nổi Bật
            </h2>
          </div>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Xem toàn bộ danh mục thư viện
            <ArrowRight weight="bold" className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link
                  href={`/library?q=${encodeURIComponent(cat.query)}`}
                  className={`group relative flex flex-col justify-between h-full p-7 rounded-3xl border bg-gradient-to-br ${cat.gradient} bg-slate-950/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner backdrop-blur-md transition-transform group-hover:scale-110">
                        <Icon weight="duotone" className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold font-mono uppercase text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                        {cat.code}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-semibold">
                    <span className="text-emerald-400 font-bold">{cat.docCount}</span>
                    <span className="text-slate-300 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                      Tra cứu →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
