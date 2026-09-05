'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Books, Robot } from '@phosphor-icons/react';

export function HomeAIShowcase() {
  return (
    <section className="relative overflow-hidden border-y border-emerald-900/30 bg-slate-950 py-20 text-white lg:py-28">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-xl sm:p-12"
        >
          <Robot weight="duotone" className="mx-auto mb-5 h-12 w-12 text-emerald-400" />
          <h2 className="font-playfair mb-4 text-3xl font-extrabold sm:text-4xl">
            Hỏi đáp theo nguồn tài liệu thực
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Trợ lý AI gửi câu hỏi tới dịch vụ của hệ thống. Nếu yêu cầu thất bại, giao diện giữ câu hỏi để bạn thử lại; nếu API không cung cấp nguồn hợp lệ, giao diện không tự dựng trích dẫn.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/ai" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold hover:bg-emerald-500">
              Mở trợ lý AI <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/library" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold hover:bg-slate-700">
              <Books className="h-4 w-4" /> Khám phá tài liệu
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
