'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
  {
    title: "Tìm tài liệu",
    description: "Khám phá kho tài liệu theo môn học, ngành học, chủ đề hoặc từ khóa."
  },
  {
    title: "Hỏi AI",
    description: "Đặt câu hỏi, yêu cầu tóm tắt hoặc tìm tài liệu liên quan dựa trên nội dung học thuật."
  },
  {
    title: "Thảo luận và cộng tác",
    description: "Chia sẻ câu hỏi trong diễn đàn hoặc tham gia nhóm học tập để trao đổi cùng người khác."
  }
];

export function HomeHowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative py-24 bg-[#F8FAF7] overflow-hidden z-10 border-t border-[rgba(22,163,74,0.08)]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Bắt đầu học tập thông minh hơn
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Chỉ với vài thao tác, người dùng có thể tìm tài liệu, hỏi AI và tham gia trao đổi học thuật.
          </motion.p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Connecting Line Background */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 md:-translate-x-1/2 rounded-full" />
          
          {/* Animated Connecting Line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-6 md:left-1/2 top-0 w-1 bg-gradient-to-b from-green-400 to-green-600 md:-translate-x-1/2 rounded-full origin-top" 
          />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}>
                
                {/* Center Node */}
                <div className="absolute left-6 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-green-500 md:-translate-x-1/2 -translate-x-3.5 z-10 shadow-[0_0_15px_rgba(22,163,74,0.3)] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>

                {/* Content Card */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`w-full md:w-1/2 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}
                >
                  <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-bold text-green-600 mb-2 uppercase tracking-widest">
                      Bước {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
