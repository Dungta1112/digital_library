'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { KnowledgeScene } from './KnowledgeScene';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Pin the Hero section on scroll
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
            ease: 'none',
          }, 0)
          .to(sceneRef.current, {
            y: -60,
            scale: 0.9,
            opacity: 0.4,
            ease: 'none',
          }, 0)
          .to(overlayRef.current, {
            opacity: 1,
            ease: 'none',
          }, 0)
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] overflow-hidden bg-[#F8FAF7] flex items-center">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[rgba(22,163,74,0.22)] blur-[120px] animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[rgba(220,38,38,0.12)] blur-[130px] animate-float-medium" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[rgba(6,95,70,0.14)] blur-[140px] animate-float-fast" />
      </div>

      {/* Background Overlays */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,rgba(248,250,247,0.8)_100%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[rgba(248,250,247,1)] via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        {/* Left: Text Content */}
        <div ref={textContentRef} className="flex flex-col justify-center text-left max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[1px] w-8 bg-green-600/30" />
            <span className="text-sm font-semibold tracking-widest text-green-700 uppercase">
              THƯ VIỆN SỐ THÔNG MINH
            </span>
            <div className="h-[1px] w-8 bg-green-600/30" />
          </motion.div>

          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-gray-900 mb-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Khám phá tri thức
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#DC2626]"
            >
              cùng AI học thuật
            </motion.div>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-lg"
          >
            Nền tảng thư viện số tích hợp tìm kiếm tài liệu, trợ lý AI, diễn đàn học thuật và nhóm học tập dành cho sinh viên, giảng viên và nhà nghiên cứu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link href="/library" className="px-8 py-4 rounded-full bg-green-600 text-white font-medium shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:bg-gradient-to-r hover:from-green-600 hover:to-red-600 hover:shadow-[0_0_35px_rgba(22,163,74,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
              Khám phá thư viện
            </Link>
            <Link href="/ai" className="px-8 py-4 rounded-full bg-[rgba(255,255,255,0.72)] backdrop-blur-[20px] text-gray-900 font-medium border border-[rgba(22,163,74,0.18)] hover:border-green-600 hover:shadow-[0_0_25px_rgba(22,163,74,0.12)] transition-all duration-300 group flex items-center gap-2">
              Hỏi AI ngay
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Right: 3D Visual & Floating Cards */}
        <div className="relative h-[60vh] lg:h-[80vh] w-full flex items-center justify-center">
          <div ref={sceneRef} className="absolute inset-0 z-0">
            <KnowledgeScene />
          </div>

          {/* Floating Cards */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] left-[10%] px-5 py-3 rounded-2xl bg-[rgba(255,255,255,0.72)] backdrop-blur-[20px] border border-[rgba(22,163,74,0.12)] shadow-sm flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg">🤖</div>
              <span className="text-sm font-medium text-gray-800">AI tóm tắt tài liệu</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[40%] -right-[5%] lg:right-[5%] px-5 py-3 rounded-2xl bg-[rgba(255,255,255,0.72)] backdrop-blur-[20px] border border-[rgba(22,163,74,0.12)] shadow-sm flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg">🔍</div>
              <span className="text-sm font-medium text-gray-800">Tìm kiếm thông minh</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[20%] left-[20%] px-5 py-3 rounded-2xl bg-[rgba(255,255,255,0.72)] backdrop-blur-[20px] border border-[rgba(22,163,74,0.12)] shadow-sm flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg">💬</div>
              <span className="text-sm font-medium text-gray-800">Diễn đàn học thuật</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-green-500"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Cuộn để khám phá</span>
      </motion.div>

      {/* Overlay for GSAP fade to next section */}
      <div ref={overlayRef} className="absolute inset-0 bg-white/80 pointer-events-none opacity-0 z-30" />
    </section>
  );
}
