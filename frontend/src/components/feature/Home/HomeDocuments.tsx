'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LibraryService } from '@/services/library.service';
import type { Document } from '@/types/library';

export function HomeDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await LibraryService.getDocuments({}, 1, 4);
        setDocuments(res.data);
      } catch (error) {
        console.error('Failed to load documents', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, []);

  return (
    <section className="relative py-24 bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden z-10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              Tài liệu nổi bật
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              Khám phá các tài liệu học tập, nghiên cứu và học liệu số được cập nhật trong hệ thống.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/library" className="px-6 py-3 rounded-full border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-medium hover:border-green-600 dark:hover:border-green-500 hover:text-green-700 dark:hover:text-green-400 hover:shadow-[0_0_15px_rgba(22,163,74,0.1)] transition-all whitespace-nowrap inline-block">
              Xem tất cả tài liệu →
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-gray-100 dark:bg-slate-800 animate-pulse transition-colors duration-300" />
            ))
          ) : (
            documents.map((doc, index) => (
              <Link href={`/library/document/${doc.id}`} key={doc.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group h-full flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-[rgba(22,163,74,0.3)] dark:hover:border-green-800 hover:shadow-[0_10px_40px_rgba(22,163,74,0.08)] transition-all duration-300"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      Năm {doc.publicationYear}
                    </span>
                    <span className="px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md bg-green-50 dark:bg-slate-800/50 text-green-700 dark:text-green-400 transition-colors duration-300">
                      {doc.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                    {doc.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-grow line-clamp-3 transition-colors duration-300">
                    {doc.abstract}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between mt-auto transition-colors duration-300">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0 duration-300">
                      Xem chi tiết
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:bg-green-600 dark:group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
