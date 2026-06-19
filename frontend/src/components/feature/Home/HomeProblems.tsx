'use client';

import { motion } from 'framer-motion';

const problems = [
  {
    title: "Tài liệu phân tán",
    description: "Tài liệu học tập nằm rải rác ở nhiều nguồn khác nhau, khiến người học khó hệ thống hóa tri thức.",
    icon: "📂"
  },
  {
    title: "Khó tìm nguồn phù hợp",
    description: "Người dùng mất nhiều thời gian để xác định tài liệu nào thực sự liên quan đến môn học, chủ đề hoặc đề tài nghiên cứu.",
    icon: "🔍"
  },
  {
    title: "Thiếu hỗ trợ cá nhân hóa",
    description: "Quá trình tự học chưa có công cụ hỗ trợ gợi ý, tóm tắt và giải thích nội dung theo nhu cầu riêng.",
    icon: "👤"
  },
  {
    title: "Thiếu trao đổi học thuật",
    description: "Sinh viên cần một không gian để đặt câu hỏi, thảo luận, chia sẻ tài liệu và phản biện ý tưởng học tập.",
    icon: "💬"
  }
];

export function HomeProblems() {
  return (
    <section className="relative py-24 bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden z-10">
      {/* Soft green glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-[rgba(22,163,74,0.04)] blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Vấn đề học tập hiện nay
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-lg"
          >
            Sinh viên thường mất nhiều thời gian để tìm kiếm tài liệu phù hợp, khó kiểm chứng nguồn học thuật và thiếu một không gian trao đổi tập trung.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(22,163,74,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_8px_30px_-4px_rgba(22,163,74,0.1)] transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">{problem.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {problem.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
