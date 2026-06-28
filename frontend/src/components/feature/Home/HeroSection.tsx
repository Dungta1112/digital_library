'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { KnowledgeScene } from './KnowledgeScene';
import { Robot, MagnifyingGlass, Chats } from '@phosphor-icons/react';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Pin the Hero section on scroll and create narrative animation
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
        animation: gsap.timeline()
          .to(textContentRef.current, {
            opacity: 0,
            y: -80,
            scale: 0.94,
            ease: 'power2.inOut',
          }, 0)
          .to(sceneRef.current, {
            y: -60,
            scale: 0.9,
            opacity: 0.2,
            ease: 'power2.inOut',
          }, 0)
          .to(overlayRef.current, {
            opacity: 1,
            ease: 'power2.inOut',
          }, 0)
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] overflow-hidden bg-white dark:bg-slate-950 flex items-center transition-colors duration-300">
      {/* Background Layer: Clean and subtle noise instead of generic orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent pointer-events-none transition-colors duration-300" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full">
        {/* Left: Text Content - Editorial scale & Left-aligned */}
        <div ref={textContentRef} className="flex flex-col justify-center text-left max-w-2xl pt-20 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[2px] w-12 bg-emerald-700/40 dark:bg-emerald-500/40" />
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-emerald-800 dark:text-emerald-400 uppercase">
              Thư viện số thông minh
            </span>
          </motion.div>

          <h1 className="font-playfair text-5xl md:text-6xl lg:text-[5rem] font-bold leading-[1.05] text-slate-900 dark:text-white mb-6 tracking-tight">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Khám phá tri thức
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-emerald-700 dark:text-emerald-400 mt-2"
            >
              cùng AI học thuật.
            </motion.div>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-[55ch]"
          >
            Nền tảng thư viện số tích hợp tìm kiếm tài liệu, trợ lý AI, diễn đàn học thuật và nhóm học tập dành cho sinh viên, giảng viên và nhà nghiên cứu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link href="/library" className="px-8 py-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-sm transition-all duration-300 active:scale-[0.98] flex items-center gap-2">
              Khám phá thư viện
            </Link>
            <Link href="/ai" className="px-8 py-4 rounded-full bg-transparent text-slate-800 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-800 hover:border-emerald-700 hover:text-emerald-700 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all duration-300 active:scale-[0.98] flex items-center gap-2 group">
              Hỏi AI ngay
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Right: 3D Visual & Floating Cards */}
        <div className="relative h-[50vh] lg:h-[80vh] w-full flex items-center justify-center">
          <div ref={sceneRef} className="absolute inset-0 z-0">
            <KnowledgeScene />
          </div>

          {/* Floating Cards - Refined without glassmorphism slop */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[15%] left-[5%] px-5 py-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Robot weight="duotone" className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">AI tóm tắt</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[45%] -right-[5%] lg:right-[0%] px-5 py-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <MagnifyingGlass weight="bold" className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">Tìm kiếm nâng cao</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[20%] left-[15%] px-5 py-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Chats weight="duotone" className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">Diễn đàn học thuật</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <div className="w-5 h-9 rounded-full border-2 border-slate-300 dark:border-slate-700 flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500"
          />
        </div>
      </motion.div>

      {/* Overlay for GSAP fade to next section */}
      <div ref={overlayRef} className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 pointer-events-none opacity-0 z-30 transition-colors duration-300" />
    </section>
  );
}
