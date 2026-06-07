'use client';

import { motion } from 'framer-motion';

import Link from 'next/link';

export function HomeAIShowcase() {
  return (
    <section className="relative py-24 bg-[#065F46] text-white overflow-hidden z-10">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-green-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="font-playfair text-4xl md:text-5xl font-bold mb-6 leading-tight"
            >
              Học tập nhanh hơn với <span className="text-green-300">trợ lý AI học thuật</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-green-50/80 leading-relaxed mb-10"
            >
              Trợ lý AI giúp người dùng đặt câu hỏi theo tài liệu, tóm tắt nội dung dài, giải thích khái niệm khó và gợi ý tài liệu liên quan. Khi có nguồn phù hợp, hệ thống hiển thị trích dẫn để người dùng kiểm chứng.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/ai" className="px-8 py-3.5 rounded-full bg-white text-green-800 font-bold text-center hover:bg-gray-100 transition-colors shadow-lg">
                Hỏi AI ngay
              </Link>
              <Link href="/library" className="px-8 py-3.5 rounded-full bg-transparent border border-green-400 text-white font-bold text-center hover:bg-green-800/50 transition-colors">
                Khám phá tài liệu
              </Link>
            </motion.div>
          </div>

          {/* Right: Mockup UI */}
          <motion.div 
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 50 }}
            style={{ perspective: 1000 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-sm text-green-100 font-medium tracking-wide">AI Assistant</span>
              </div>
              
              {/* Chat Body */}
              <div className="p-6 space-y-6">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-white/20 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
                    "Tóm tắt tài liệu này trong 5 ý chính."
                  </div>
                </div>

                {/* AI Message */}
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 px-5 py-4 rounded-2xl rounded-tl-sm max-w-[90%] text-sm shadow-md">
                    <p className="mb-3 font-medium">Tài liệu tập trung vào vấn đề chuyển đổi số trong học tập, bao gồm:</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li>Thực trạng sử dụng công nghệ số.</li>
                      <li>Vai trò của nền tảng số.</li>
                      <li>Lợi ích của AI trong giáo dục.</li>
                      <li>Khó khăn khi triển khai thực tế.</li>
                      <li>Đề xuất giải pháp cải thiện kỹ năng tự học.</li>
                    </ul>

                    {/* Sources Panel */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nguồn trích dẫn</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 border border-green-100 text-xs text-green-700 font-medium">
                          📄 Tài liệu học tập số, mục 2.1
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 border border-green-100 text-xs text-green-700 font-medium">
                          📊 Báo cáo khảo sát sinh viên, phần Kết quả
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-black/20 border-t border-white/10">
                <div className="w-full bg-white/10 rounded-full h-10 px-4 flex items-center text-white/50 text-sm">
                  Nhập câu hỏi của bạn...
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <p className="text-center text-xs text-green-300/50 mt-4 italic">
              * Hình ảnh minh họa giao diện trợ lý AI
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
