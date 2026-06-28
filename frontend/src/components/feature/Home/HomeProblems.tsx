'use client';

import { motion } from 'framer-motion';
import { Folders, MagnifyingGlass, UserFocus, UsersThree } from '@phosphor-icons/react';

const problems = [
  {
    title: "Tài liệu phân tán",
    description: "Tài liệu học tập nằm rải rác ở nhiều nguồn khác nhau, khiến người học khó hệ thống hóa tri thức và tra cứu khi cần thiết.",
    icon: <Folders weight="duotone" className="w-6 h-6" />
  },
  {
    title: "Khó tìm nguồn phù hợp",
    description: "Người dùng mất nhiều thời gian để xác định tài liệu nào thực sự liên quan đến môn học, chủ đề hoặc đề tài nghiên cứu.",
    icon: <MagnifyingGlass weight="duotone" className="w-6 h-6" />
  },
  {
    title: "Thiếu hỗ trợ cá nhân hóa",
    description: "Quá trình tự học chưa có công cụ hỗ trợ gợi ý, tóm tắt và giải thích nội dung theo nhu cầu riêng biệt của từng cá nhân.",
    icon: <UserFocus weight="duotone" className="w-6 h-6" />
  },
  {
    title: "Thiếu không gian trao đổi",
    description: "Sinh viên cần một không gian chuyên biệt để đặt câu hỏi, thảo luận, chia sẻ tài liệu và phản biện ý tưởng học tập.",
    icon: <UsersThree weight="duotone" className="w-6 h-6" />
  }
];

export function HomeProblems() {
  return (
    <section className="relative py-24 lg:py-32 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden z-10 border-t border-gray-200/50 dark:border-slate-800/50">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Sticky Context */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="h-[2px] w-8 bg-emerald-700/40 dark:bg-emerald-500/40" />
                <span className="text-xs font-bold tracking-[0.2em] text-emerald-800 dark:text-emerald-400 uppercase">
                  Hiện trạng
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.15]"
              >
                Học tập đang bị phân mảnh.
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed"
              >
                Sinh viên và nhà nghiên cứu mất quá nhiều thời gian cho việc tìm kiếm nguồn tài liệu đáng tin cậy thay vì thực sự tập trung vào việc hấp thụ tri thức.
              </motion.p>
            </div>
          </div>

          {/* Right Column: Problem List */}
          <div className="lg:w-2/3 flex flex-col">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative py-8 border-b border-gray-200 dark:border-slate-800 last:border-0"
              >
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-emerald-700 dark:text-emerald-400 shadow-sm border border-gray-100 dark:border-slate-700 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                    {problem.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                      {problem.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
