'use client';

import { motion } from 'framer-motion';

import Link from 'next/link';

export function HomeCTA() {
  return (
    <section className="relative py-32 bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden z-10">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto p-12 md:p-16 rounded-[3rem] bg-[rgba(255,255,255,0.72)] dark:bg-slate-900/80 backdrop-blur-[20px] border border-[rgba(22,163,74,0.18)] dark:border-slate-800 text-center overflow-hidden shadow-2xl transition-colors duration-300"
        >
          {/* Subtle gradient glows behind the panel */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute -top-[50%] -left-[20%] w-[70%] h-[150%] bg-green-400/10 blur-[100px] rounded-full transform -rotate-12" />
            <div className="absolute -bottom-[50%] -right-[20%] w-[70%] h-[150%] bg-red-400/10 blur-[100px] rounded-full transform rotate-12" />
          </div>

          <div className="relative z-10">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight max-w-3xl mx-auto transition-colors duration-300">
              Sẵn sàng khám phá tri thức theo cách thông minh hơn?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
              Bắt đầu với thư viện số, đặt câu hỏi cho AI hoặc tham gia cộng đồng học thuật ngay hôm nay.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/library" className="w-full sm:w-auto px-8 py-4 rounded-full bg-green-600 text-white font-medium shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:bg-gradient-to-r hover:from-green-600 hover:to-red-600 hover:shadow-[0_0_35px_rgba(22,163,74,0.4)] transition-all duration-300 transform hover:-translate-y-1 block">
                Khám phá thư viện
              </Link>
              <Link href="/ai" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-medium border border-gray-200 dark:border-slate-700 hover:border-[rgba(22,163,74,0.4)] dark:hover:border-green-800 hover:shadow-[0_0_25px_rgba(22,163,74,0.12)] transition-all duration-300 block">
                Hỏi AI ngay
              </Link>
              <Link href="/forum" className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent text-gray-700 dark:text-gray-300 font-medium hover:text-green-700 dark:hover:text-green-400 transition-colors block">
                Tham gia diễn đàn →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
