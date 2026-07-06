'use client';

import { motion } from 'framer-motion';
import { BookOpenText, Funnel, BookmarkSimple, Robot, TextAa, Quotes, UsersThree, Users } from '@phosphor-icons/react';

export function HomeFeatures() {
  return (
    <section className="relative py-24 lg:py-32 bg-white dark:bg-slate-950 overflow-hidden z-10 transition-colors duration-300">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight"
            >
              Mọi công cụ bạn cần <br className="hidden md:block" /> cho nghiên cứu.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
            >
              Tất cả các chức năng cốt lõi được xây dựng xung quanh một trải nghiệm liền mạch, giúp bạn từ lúc tìm kiếm ý tưởng đến khi hoàn thiện kiến thức.
            </motion.p>
          </div>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(280px,auto)]">
          
          {/* Item 1: Large Span */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-8 group relative p-8 md:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-900/5"
          >
            <div className="relative z-10 w-3/4">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-sm">
                <BookOpenText weight="duotone" className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Tìm kiếm tài liệu thông minh</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Tra cứu hàng ngàn tài liệu theo tiêu đề, tác giả, môn học, ngành học, từ khóa hoặc chủ đề nghiên cứu chỉ trong tích tắc.
              </p>
            </div>
          </motion.div>

          {/* Item 2: Small Square */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 group relative p-8 rounded-3xl bg-emerald-700 dark:bg-emerald-800 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/20"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-600/50 dark:bg-emerald-700/50 text-white flex items-center justify-center mb-6">
                <Robot weight="duotone" className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Hỏi AI theo tài liệu</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Đặt câu hỏi trực tiếp về nội dung tài liệu và nhận phản hồi có căn cứ từ hệ thống AI chuyên sâu.
              </p>
            </div>
          </motion.div>

          {/* Item 3: Tall or Standard Span */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between transition-all duration-500 hover:border-emerald-500/30"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-5 shadow-sm">
                <Funnel weight="duotone" className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lọc siêu tốc</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Lọc nhanh theo danh mục, mức độ liên quan hoặc độ phổ biến.
              </p>
            </div>
          </motion.div>

          {/* Item 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between transition-all duration-500 hover:border-emerald-500/30"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-5 shadow-sm">
                <BookmarkSimple weight="duotone" className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Đọc & Lưu trữ</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Xem chi tiết, đọc online hoặc lưu tài liệu yêu thích vào kho cá nhân.
              </p>
            </div>
          </motion.div>

          {/* Item 5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between transition-all duration-500 hover:border-emerald-500/30"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-5 shadow-sm">
                <TextAa weight="duotone" className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tóm tắt thông minh</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Rút gọn nội dung dài thành các ý chính giúp nắm bắt siêu tốc.
              </p>
            </div>
          </motion.div>

          {/* Item 6: Wide Span */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-6 group relative p-8 md:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row gap-6 items-start transition-all duration-500 hover:border-emerald-500/30"
          >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Users weight="duotone" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nhóm học tập</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Tạo hoặc tham gia nhóm học tập để cộng tác, chia sẻ tài liệu và trao đổi theo lĩnh vực quan tâm.
              </p>
            </div>
          </motion.div>

          {/* Item 7: Wide Span */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-6 group relative p-8 md:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row gap-6 items-start transition-all duration-500 hover:border-emerald-500/30"
          >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Quotes weight="duotone" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Diễn đàn học thuật</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Đăng bài, bình luận, trao đổi câu hỏi và chia sẻ góc nhìn học tập trong diễn đàn tương tác mở.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
