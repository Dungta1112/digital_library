'use client';

import { motion } from 'framer-motion';
import { Books, Robot, Student, UsersThree } from '@phosphor-icons/react';

const solutions = [
  {
    title: "Thư viện số",
    description: "Tập trung tài liệu học tập, tài liệu tham khảo và học liệu số theo ngành học, môn học, chủ đề và từ khóa.",
    icon: <Books weight="duotone" className="w-8 h-8" />
  },
  {
    title: "Trợ lý AI học thuật",
    description: "Hỗ trợ hỏi đáp theo tài liệu, tóm tắt nội dung, giải thích khái niệm và gợi ý tài liệu liên quan.",
    icon: <Robot weight="duotone" className="w-8 h-8" />
  },
  {
    title: "Diễn đàn học thuật",
    description: "Tạo không gian đặt câu hỏi, thảo luận chủ đề học tập, chia sẻ kinh nghiệm nghiên cứu và phản biện ý tưởng.",
    icon: <Student weight="duotone" className="w-8 h-8" />
  },
  {
    title: "Nhóm học tập",
    description: "Kết nối người học theo môn học, đề tài hoặc lĩnh vực quan tâm để cùng chia sẻ tài liệu và trao đổi kiến thức.",
    icon: <UsersThree weight="duotone" className="w-8 h-8" />
  }
];

export function HomeSolution() {
  return (
    <section className="relative py-24 lg:py-32 bg-white dark:bg-slate-950 overflow-hidden z-10 transition-colors duration-300">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left: Content */}
          <div className="lg:w-1/3 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-400 font-bold tracking-wide mb-8 shadow-sm uppercase"
            >
              Hệ sinh thái toàn diện
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.15]"
            >
              Giải pháp thư viện số thông minh.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8"
            >
              Một nền tảng học tập tích hợp thư viện tài liệu, trợ lý AI, diễn đàn học thuật và nhóm học tập, giúp người dùng tiếp cận tri thức nhanh hơn và có hệ thống hơn.
            </motion.p>
          </div>

          {/* Right: Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 hover:border-emerald-500/30"
              >
                <div className="flex flex-col items-start relative z-10">
                  <div className="mb-6 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {solution.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{solution.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{solution.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
