'use client';

import { motion } from 'framer-motion';

const audiences = [
  {
    title: "Sinh viên",
    description: "Tìm tài liệu, hỏi AI, lưu tài liệu và tham gia thảo luận học thuật.",
    icon: "👨‍🎓"
  },
  {
    title: "Giảng viên",
    description: "Chia sẻ tài liệu, hỗ trợ học tập, theo dõi chủ đề thảo luận và định hướng nghiên cứu.",
    icon: "👨‍🏫"
  },
  {
    title: "Nhà nghiên cứu",
    description: "Khám phá tài liệu, hệ thống hóa nguồn tham khảo và trao đổi ý tưởng học thuật.",
    icon: "🔬"
  },
  {
    title: "Quản trị viên",
    description: "Quản lý tài liệu, người dùng, bài viết và hoạt động học thuật trên nền tảng.",
    icon: "⚙️"
  }
];

export function HomeAudience() {
  return (
    <section className="relative py-24 bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden z-10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 transition-colors duration-300 tracking-tight"
          >
            Nền tảng dành cho ai?
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-[2rem] bg-[#F8FAF7] dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex flex-col items-center text-center hover:shadow-xl hover:border-green-200 dark:hover:border-green-800 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-3xl mb-6 transition-colors duration-300">
                {audience.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">{audience.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">
                {audience.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
