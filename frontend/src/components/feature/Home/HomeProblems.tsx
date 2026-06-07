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
    <section className="relative py-24 bg-white overflow-hidden z-10">
      {/* Soft green glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-[rgba(22,163,74,0.04)] blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Vấn đề học tập hiện nay
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Sinh viên thường mất nhiều thời gian để tìm kiếm tài liệu phù hợp, khó kiểm chứng nguồn học thuật và thiếu một không gian trao đổi tập trung.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-[rgba(255,255,255,0.72)] backdrop-blur-[20px] border border-[rgba(22,163,74,0.12)] shadow-sm hover:shadow-[0_0_35px_rgba(22,163,74,0.08)] transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-2xl flex items-center justify-center mb-6 text-green-700">
                {problem.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{problem.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
