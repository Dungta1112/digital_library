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
} from '@phosphor-icons/react';

const GRADIENTS = [
  'from-emerald-900 via-teal-800 to-cyan-900',
  'from-blue-950 via-indigo-900 to-slate-900',
  'from-purple-950 via-violet-900 to-indigo-950',
  'from-amber-950 via-orange-900 to-slate-900',
];

export function HomeDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchDocs() {
      setLoading(true);
      setError('');
      try {
        const res = await LibraryService.getDocuments({}, 1, 4, controller.signal);
        if (!controller.signal.aborted) {
          setDocuments(res.data.slice(0, 4));
        }
      } catch (reason: unknown) {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'Không thể tải tài liệu.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchDocs();
    return () => controller.abort();
  }, [reloadKey]);

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
              Nguồn tài liệu giáo trình số hóa chính thức do Giảng viên các khoa biên soạn và đã qua kiểm duyệt học thuật.
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

        {/* Documents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="rounded-3xl border border-red-900/60 bg-red-950/30 p-10 text-center">
            <p className="mb-4 text-sm text-red-300">{error}</p>
            <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="rounded-xl bg-red-700 px-5 py-2.5 text-xs font-bold hover:bg-red-600">Thử lại</button>
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <Books weight="duotone" className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-slate-300 font-bold text-base mb-1">Chưa có tài liệu nào trong kho</p>
            <p className="text-slate-500 text-xs mb-4">Các giáo trình số sẽ xuất hiện tại đây khi được phê duyệt xuất bản.</p>
            <Link
              href="/admin/documents"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
            >
              Tải lên tài liệu mới
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc, idx) => {
              const gradient = GRADIENTS[idx % GRADIENTS.length];

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:-translate-y-1.5"
                >
                  {/* Card Header / Visual Preview */}
                  <div
                    className={`relative h-44 w-full bg-gradient-to-br ${gradient} p-5 flex flex-col justify-between overflow-hidden`}
                  >
                    {/* Decorative Watermark */}
                    <BookOpen
                      weight="thin"
                      className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 text-white/10 group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="flex items-center justify-between z-10">
                      <span className="rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 border border-white/10">
                        {doc.category || 'Chưa cập nhật'}
                      </span>
                      {doc.fileType && (
                        <span className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                          <FilePdf weight="fill" className="h-3 w-3 text-red-400" />
                          {doc.fileType.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Bottom Metadata inside cover */}
                    <div className="z-10">
                      <p className="text-[11px] font-medium text-slate-300 truncate">
                        {doc.authors && doc.authors.length > 0 ? doc.authors.join(', ') : 'Chưa cập nhật tác giả'}
                      </p>
                      {doc.publicationYear && <p className="text-[10px] text-slate-400">Năm XB: {doc.publicationYear}</p>}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <div>
                      {/* Title */}
                      <Link href={`/library/document/${doc.id}`} className="block">
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2 mb-2">
                          {doc.title}
                        </h3>
                      </Link>

                      {/* Abstract / Description */}
                      {(doc.abstract || doc.description) && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{doc.abstract || doc.description}</p>
                      )}
                    </div>

                    {/* Footer Stats & Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye weight="bold" className="h-3.5 w-3.5 text-slate-500" />
                          {doc.viewCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <FloppyDisk weight="bold" className="h-3.5 w-3.5 text-slate-500" />
                          {doc.saveCount ?? 0}
                        </span>
                      </div>

                      <Link
                        href={`/library/document/${doc.id}`}
                        className="inline-flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Đọc ngay
                        <ArrowRight weight="bold" className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
