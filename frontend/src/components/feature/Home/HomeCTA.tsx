'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';

export function HomeCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-slate-950 transition-colors duration-300 overflow-hidden z-10 border-t border-slate-900">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-[1px] w-8 bg-emerald-500/50" />
            <span className="text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase">
              Bắt đầu ngay hôm nay
            </span>
            <div className="h-[1px] w-8 bg-emerald-500/50" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
            Sẵn sàng khám phá tri thức <br className="hidden md:block" />
            theo cách thông minh hơn?
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Hàng ngàn tài liệu học thuật cùng sự hỗ trợ của trí tuệ nhân tạo đang chờ bạn khám phá.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/library" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm hover:shadow-emerald-500/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              Khám phá thư viện
            </Link>
            <Link 
              href="/ai" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 text-white font-medium border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              Hỏi AI ngay
              <ArrowRight weight="bold" className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(circle at center, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </section>
  );
}
