'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
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
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className="relative flex min-h-[760px] w-full items-center overflow-hidden bg-[var(--background)] py-20 transition-colors duration-300 lg:h-[calc(100vh-4rem)] lg:min-h-[720px] lg:py-0 dark:bg-slate-950">
      <div className="pointer-events-none absolute -left-40 top-16 h-[34rem] w-[34rem] rounded-full bg-emerald-200/35 blur-[110px] dark:bg-emerald-500/10" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-green-100/70 blur-[100px] dark:bg-cyan-500/5" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(5,150,105,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(5,150,105,.35) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />

      <div className="container relative z-10 mx-auto grid h-full grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1.02fr_.98fr] lg:gap-14 lg:px-12">
        <div ref={textContentRef} className="flex max-w-2xl flex-col justify-center text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-7 flex flex-wrap items-center gap-3"
          >
            <span className="rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              Thư viện số thông minh
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-red-600 ring-1 ring-red-100 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Mới
            </span>
          </motion.div>

          <h1 className="font-playfair mb-7 text-5xl font-bold leading-[1.03] tracking-[-0.035em] text-slate-950 sm:text-6xl lg:text-[4.75rem] dark:text-white">
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
              className="mt-2 bg-gradient-to-r from-emerald-950 via-emerald-700 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-200 dark:via-emerald-400 dark:to-teal-300"
            >
              cùng AI học thuật
            </motion.div>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-9 max-w-[58ch] text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-400"
          >
            Nền tảng thư viện số tích hợp tìm kiếm tài liệu, trợ lý AI, diễn đàn học thuật và nhóm học tập dành cho sinh viên, giảng viên và nhà nghiên cứu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <Link href="/library" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 py-4 font-bold text-white shadow-[0_14px_30px_-14px_rgba(5,150,105,.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-[0_18px_35px_-15px_rgba(5,150,105,.8)] active:scale-[0.98]">
              Khám phá thư viện <span aria-hidden="true">→</span>
            </Link>
            <Link href="/ai" className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white/65 px-7 py-4 font-bold text-slate-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 active:scale-[0.98] dark:border-emerald-900/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300">
              Hỏi AI ngay
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-500"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Tìm kiếm, đọc và kiểm chứng nguồn trong một không gian.
          </motion.p>
        </div>

        <div className="relative flex h-[420px] w-full items-center justify-center lg:h-[610px]">
          <div className="absolute inset-4 rounded-[2.5rem] border border-emerald-200/80 bg-[radial-gradient(circle_at_50%_42%,rgba(167,243,208,.55),rgba(236,253,245,.78)_48%,rgba(255,254,250,.75)_100%)] shadow-[0_32px_80px_-42px_rgba(6,78,59,.55)] backdrop-blur-xl dark:border-emerald-900/60 dark:bg-[radial-gradient(circle_at_50%_42%,rgba(6,95,70,.35),rgba(15,23,42,.88)_58%,rgba(2,6,23,.9)_100%)]" />
          <div ref={sceneRef} className="absolute inset-4 z-0 overflow-hidden rounded-[2.5rem]">
            <KnowledgeScene />
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 hidden sm:block">
            <motion.div
              animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="home-surface absolute left-0 top-[14%] flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Robot weight="duotone" className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">AI tóm tắt</span>
            </motion.div>

            <motion.div
              animate={reducedMotion ? undefined : { y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="home-surface absolute right-0 top-[45%] flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <MagnifyingGlass weight="bold" className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">Tìm kiếm nâng cao</span>
            </motion.div>

            <motion.div
              animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="home-surface absolute bottom-[15%] left-[8%] flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Chats weight="duotone" className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">Diễn đàn học thuật</span>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
      >
        <div className="w-5 h-9 rounded-full border-2 border-slate-300 dark:border-slate-700 flex justify-center p-1">
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, 14, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500"
          />
        </div>
      </motion.div>

      <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-30 bg-[var(--background)] opacity-0 transition-colors duration-300 dark:bg-slate-950" />
    </section>
  );
}
