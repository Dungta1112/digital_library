'use client';

import { motion } from 'framer-motion';

const solutions = [
  {
    title: "Thư viện số",
    description: "Tập trung tài liệu học tập, tài liệu tham khảo và học liệu số theo ngành học, môn học, chủ đề và từ khóa.",
    icon: "📚"
  },
  {
    title: "Trợ lý AI học thuật",
    description: "Hỗ trợ hỏi đáp theo tài liệu, tóm tắt nội dung, giải thích khái niệm và gợi ý tài liệu liên quan.",
    icon: "🤖"
  },
  {
    title: "Diễn đàn học thuật",
    description: "Tạo không gian đặt câu hỏi, thảo luận chủ đề học tập, chia sẻ kinh nghiệm nghiên cứu và phản biện ý tưởng.",
    icon: "🎓"
  },
  {
    title: "Nhóm học tập",
    description: "Kết nối người học theo môn học, đề tài hoặc lĩnh vực quan tâm để cùng chia sẻ tài liệu và trao đổi kiến thức.",
    icon: "👥"
  }
];

export function HomeSolution() {
  return (
    <section className="relative py-24 bg-[#F8FAF7] dark:bg-slate-900 overflow-hidden z-10 border-t border-[rgba(22,163,74,0.08)] dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-green-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-1.5 text-sm text-green-700 dark:text-green-400 font-medium mb-8 shadow-sm"
          >
            Hệ sinh thái toàn diện
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Giải pháp thư viện số thông minh
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            Một nền tảng học tập tích hợp thư viện tài liệu, trợ lý AI, diễn đàn học thuật và nhóm học tập, giúp người dùng tiếp cận tri thức nhanh hơn và có hệ thống hơn.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative p-8 rounded-[2rem] bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[rgba(22,163,74,0.1)] dark:from-[rgba(22,163,74,0.05)] to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-start gap-6 relative z-10">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#F8FAF7] dark:bg-slate-900 border border-[rgba(22,163,74,0.1)] dark:border-slate-800 flex items-center justify-center text-3xl group-hover:border-green-300 dark:group-hover:border-green-800 group-hover:bg-green-50 dark:group-hover:bg-slate-800 transition-colors duration-300">
                  {solution.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{solution.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{solution.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
