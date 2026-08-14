'use client';

import { motion } from 'framer-motion';

import Link from 'next/link';

export function HomeAIShowcase() {
    return (
        <section className="relative z-10 overflow-hidden border-y border-emerald-900/5 bg-gradient-to-br from-emerald-100/80 via-[var(--background)] to-[#fffef9] py-24 text-slate-900 dark:border-emerald-900/30 dark:from-emerald-950 dark:via-slate-950 dark:to-slate-900 dark:text-white">
            <div className="pointer-events-none absolute right-0 top-0 h-[50vw] w-[50vw] rounded-full bg-green-300/20 blur-[120px] dark:bg-green-500/10" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[50vw] w-[50vw] rounded-full bg-red-100/35 blur-[120px] dark:bg-red-500/5" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight"
                        >
                            Học tập nhanh hơn với <br className="hidden md:block" /><span className="text-emerald-300">trợ lý AI học thuật.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-10 text-lg leading-relaxed text-slate-600 dark:text-green-50/75"
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
                            <Link href="/ai" className="rounded-2xl bg-emerald-600 px-8 py-3.5 text-center font-bold text-white shadow-lg shadow-emerald-700/15 transition-colors hover:bg-emerald-700 dark:bg-white dark:text-green-800 dark:hover:bg-gray-100">
                                Hỏi AI ngay
                            </Link>
                            <Link href="/library" className="rounded-2xl border border-emerald-300 bg-white/55 px-8 py-3.5 text-center font-bold text-emerald-900 backdrop-blur transition-colors hover:bg-emerald-50 dark:border-green-700 dark:bg-transparent dark:text-white dark:hover:bg-green-900/40">
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
                        <div className="home-surface flex flex-col overflow-hidden rounded-3xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                            {/* Chat Header */}
                            <div className="flex items-center gap-3 border-b border-emerald-900/10 bg-white/45 px-6 py-4 dark:border-white/10 dark:bg-white/5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                                <span className="ml-2 text-sm font-bold tracking-wide text-emerald-900 dark:text-green-100">Trợ lý AI</span>
                            </div>

                            {/* Chat Body */}
                            <div className="p-6 space-y-6">
                                {/* User Message */}
                                <div className="flex justify-end">
                                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-600 px-5 py-3 text-sm text-white shadow-sm dark:bg-white/15">
                                        &ldquo;Tóm tắt tài liệu này trong 5 ý chính.&rdquo;
                                    </div>
                                </div>

                                {/* AI Message */}
                                <div className="flex justify-start">
                                    <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-emerald-900/10 bg-[#fffef9] px-5 py-4 text-sm text-gray-800 shadow-md transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200">
                                        <p className="mb-3 font-medium">Tài liệu tập trung vào vấn đề chuyển đổi số trong học tập, bao gồm:</p>
                                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                            <li>Thực trạng sử dụng công nghệ số.</li>
                                            <li>Vai trò của nền tảng số.</li>
                                            <li>Lợi ích của AI trong giáo dục.</li>
                                            <li>Khó khăn khi triển khai thực tế.</li>
                                            <li>Đề xuất giải pháp cải thiện kỹ năng tự học.</li>
                                        </ul>

                                        {/* Sources Panel */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 transition-colors duration-300">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nguồn trích dẫn</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800/50 text-xs text-green-700 dark:text-green-400 font-medium transition-colors duration-300">
                                                    📄 Tài liệu học tập số, mục 2.1
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800/50 text-xs text-green-700 dark:text-green-400 font-medium transition-colors duration-300">
                                                    📊 Báo cáo khảo sát sinh viên, phần Kết quả
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input */}
                            <div className="border-t border-emerald-900/10 bg-emerald-950/[0.03] p-4 dark:border-white/10 dark:bg-black/20">
                                <div className="flex h-11 w-full items-center rounded-xl border border-emerald-900/10 bg-white/65 px-4 text-sm text-slate-400 dark:border-0 dark:bg-white/10 dark:text-white/50">
                                    Nhập câu hỏi của bạn...
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <p className="mt-4 text-center text-xs italic text-slate-500 dark:text-green-300/50">
                            * Hình ảnh minh họa giao diện trợ lý AI
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}