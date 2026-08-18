'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LibraryService } from '@/services/library.service';
import type { Document } from '@/types/library';
import {
  Books,
  BookOpen,
  FilePdf,
  Eye,
  FloppyDisk,
  ArrowRight,
  Sparkle,
  BookmarkSimple,
} from '@phosphor-icons/react';

const FALLBACK_DOCUMENTS: Document[] = [
  {
    id: 'doc-csdl-2026',
    title: 'Giáo trình Cơ sở Dữ liệu & Hệ Quản trị Dữ liệu Nâng cao',
    authors: ['TS. Nguyễn Văn Minh', 'ThS. Lê Hoàng Nam'],
    publicationYear: 2026,
    category: 'Khoa học máy tính',
    keywords: ['Cơ sở dữ liệu', 'SQL', 'BCNF', 'Indexing'],
    abstract: 'Hệ thống hóa kiến thức về đại số quan hệ, thiết kế chuẩn hóa 1NF-BCNF, tối ưu hóa truy vấn và kiến trúc cơ sở dữ liệu phân tán.',
    viewCount: 3840,
    saveCount: 920,
    fileType: 'pdf',
    pdfUrl: '',
  },
  {
    id: 'doc-kinhte-vimo',
    title: 'Kinh tế học Vĩ mô: Lý thuyết & Thực tiễn Ứng dụng',
    authors: ['PGS.TS. Trần Thị Mai', 'Khoa Kinh tế'],
    publicationYear: 2025,
    category: 'Kinh tế & Tài chính',
    keywords: ['Vĩ mô', 'Lạm phát', 'Chính sách tài khóa', 'IS-LM'],
    abstract: 'Phân tích tổng cầu, tổng cung, lạm phát, thất nghiệp và các mô hình điều hành chính sách tiền tệ tài khóa tại Việt Nam.',
    viewCount: 2950,
    saveCount: 710,
    fileType: 'pdf',
    pdfUrl: '',
  },
  {
    id: 'doc-toan-caocap',
    title: 'Toán Cao cấp & Giải tích Ứng dụng trong Kỹ thuật Số',
    authors: ['TS. Phạm Đức Tuấn'],
    publicationYear: 2026,
    category: 'Toán học & Thống kê',
    keywords: ['Giải tích', 'Đại số tuyến tính', 'Toán kỹ thuật'],
    abstract: 'Cung cấp nền tảng vi tích phân hàm nhiều biến, phương trình vi phân và các phép biến đổi ma trận phục vụ mô hình hóa.',
    viewCount: 2410,
    saveCount: 560,
    fileType: 'pdf',
    pdfUrl: '',
  },
  {
    id: 'doc-ai-nlp',
    title: 'Nhập môn Trí tuệ Nhân tạo: Từ Học máy đến Mô hình RAG',
    authors: ['TS. Hoàng Quốc Bảo', 'Lab AI Trưng Vương'],
    publicationYear: 2026,
    category: 'Trí tuệ nhân tạo',
    keywords: ['AI', 'Machine Learning', 'RAG', 'Vector DB'],
    abstract: 'Khám phá các thuật toán học máy kinh điển, mạng nơ-ron sâu, mô hình ngôn ngữ lớn (LLMs) và kỹ thuật RAG trong học thuật.',
    viewCount: 4200,
    saveCount: 1350,
    fileType: 'pdf',
    pdfUrl: '',
  },
];

const GRADIENTS = [
  'from-emerald-900 via-teal-800 to-cyan-900',
  'from-blue-950 via-indigo-900 to-slate-900',
  'from-purple-950 via-violet-900 to-indigo-950',
  'from-amber-950 via-orange-900 to-slate-900',
];

export function HomeDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await LibraryService.getDocuments({}, 1, 4);
        if (res.data && res.data.length > 0) {
          setDocuments(res.data.slice(0, 4));
        } else {
          setDocuments(FALLBACK_DOCUMENTS);
        }
      } catch {
        setDocuments(FALLBACK_DOCUMENTS);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, []);

  return (
    <section className="relative bg-slate-950 py-20 lg:py-28 text-white border-t border-slate-800 overflow-hidden">
      {/* Glow Effect */}
      <div className="pointer-events-none absolute right-1/4 top-10 h-72 w-72 rounded-full bg-emerald-600/10 blur-[130px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
              <Sparkle weight="fill" className="h-3.5 w-3.5" />
              TÀI NGUYÊN HỌC THUẬT TIÊU BIỂU
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Giáo Trình & Tài Liệu Xem Nhiều Nhất
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Được sinh viên và giảng viên Trường Đại học Trưng Vương tra cứu và trích dẫn nhiều nhất trong học kỳ này.
            </p>
          </div>

          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5 active:scale-98"
          >
            <Books weight="bold" className="h-4 w-4" />
            Xem toàn bộ kho tài liệu
            <ArrowRight weight="bold" className="h-4 w-4" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[460px] rounded-3xl bg-slate-900 border border-slate-800 animate-pulse"
                />
              ))
            : documents.map((doc, idx) => {
                const coverGrad = GRADIENTS[idx % GRADIENTS.length];

                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/50 hover:shadow-2xl"
                  >
                    {/* Top Book Cover Art */}
                    <div className={`relative h-44 bg-gradient-to-br ${coverGrad} p-5 flex flex-col justify-between overflow-hidden`}>
                      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-md" />
                      <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-black/20 blur-sm" />

                      <div className="relative flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                          <FilePdf weight="fill" className="h-3.5 w-3.5 text-red-400" />
                          PDF
                        </span>
                        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white/90 backdrop-blur-md">
                          Năm {doc.publicationYear}
                        </span>
                      </div>

                      <div className="relative">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                          {doc.category}
                        </span>
                        <p className="line-clamp-2 text-sm font-bold text-white leading-snug">
                          {doc.title}
                        </p>
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold text-emerald-400 mb-2 line-clamp-1">
                        {doc.authors?.join(', ') || 'Đại học Trưng Vương'}
                      </p>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1">
                        {doc.abstract || 'Tài liệu giáo trình học tập chuẩn mực.'}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] font-semibold text-slate-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Eye weight="bold" className="h-3.5 w-3.5 text-slate-400" />
                          {doc.viewCount || 120} lượt đọc
                        </span>
                        <span className="flex items-center gap-1">
                          <FloppyDisk weight="bold" className="h-3.5 w-3.5 text-emerald-400" />
                          {doc.saveCount || 45} lưu
                        </span>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/library/document/${doc.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 py-2.5 text-xs font-bold text-emerald-300 hover:text-white transition-all active:scale-95"
                      >
                        <BookOpen weight="bold" className="h-4 w-4" />
                        Đọc tài liệu ngay
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
