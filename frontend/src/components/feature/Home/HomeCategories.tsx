'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Books, WarningCircle } from '@phosphor-icons/react';
import { LibraryService } from '@/services/library.service';
import type { Category } from '@/types/library';

export function HomeCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const retry = useCallback(() => setReloadKey((value) => value + 1), []);

  /* eslint-disable react-hooks/set-state-in-effect -- reload state is controlled by retry */
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    LibraryService.getCategories(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setCategories(items.slice(0, 6));
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'Không thể tải danh mục tài liệu.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reloadKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-slate-900 py-20 text-white lg:py-28">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-emerald-400">Danh mục từ thư viện</span>
            <h2 className="font-playfair text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">Khám phá theo lĩnh vực</h2>
          </div>
          <Link href="/library" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300">
            Xem toàn bộ thư viện <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Đang tải danh mục">
            {[1, 2, 3].map((item) => <div key={item} className="h-40 animate-pulse rounded-3xl border border-slate-800 bg-slate-950/60" />)}
          </div>
        ) : error ? (
          <div role="alert" className="rounded-3xl border border-red-900/60 bg-red-950/30 p-8 text-center">
            <WarningCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
            <p className="mb-4 text-sm text-red-300">{error}</p>
            <button type="button" onClick={retry} className="rounded-xl bg-red-700 px-5 py-2.5 text-xs font-bold hover:bg-red-600">Thử lại</button>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center text-sm text-slate-400">
            Chưa có danh mục tài liệu được công bố.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <motion.div key={category.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <Link href={`/library?categoryId=${encodeURIComponent(category.id)}`} className="group flex h-full min-h-40 flex-col justify-between rounded-3xl border border-slate-700 bg-slate-950/70 p-7 transition-all hover:-translate-y-1 hover:border-emerald-500/50">
                  <Books weight="duotone" className="mb-5 h-8 w-8 text-emerald-400" />
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-white group-hover:text-emerald-300">{category.name}</h3>
                    {category.description && <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">{category.description}</p>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
