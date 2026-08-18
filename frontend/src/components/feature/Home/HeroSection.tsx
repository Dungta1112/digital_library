'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlass,
  Robot,
  FilePdf,
  Sparkle,
  BookmarkSimple,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Books,
  GraduationCap,
} from '@phosphor-icons/react';

export function HeroSection() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'document' | 'ai'>('document');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDemoTab, setActiveDemoTab] = useState<'csdl' | 'kinhte' | 'ai'>('csdl');

  const demoScenarios = {
    csdl: {
      docTitle: 'Giáo trình Cơ sở dữ liệu nâng cao (Bản 2026)',
      page: 42,
      topic: 'Chuẩn hóa dữ liệu 3NF & BCNF',
      question: 'Điều kiện chuẩn hóa BCNF khác gì so với dạng chuẩn 3 (3NF)?',
      aiAnswer:
        'Dạng chuẩn Boyce-Codd (BCNF) là trường hợp chặt chẽ hơn của 3NF. Trong 3NF, với mọi phụ thuộc hàm X → A không tầm thường, X phải là siêu khóa HOẶC A là thuộc tính khóa. Trong khi đó, BCNF yêu cầu X BẮT BUỘC phải là một siêu khóa.',
      citation: 'Trang 42, Mục 3.2 — BCNF & Dependency Preservation',
      highlightSnippet:
        'Một lược đồ quan hệ R ở dạng chuẩn BCNF nếu mọi phụ thuộc hàm X → A thỏa mãn X là siêu khóa của R...',
    },
    kinhte: {
      docTitle: 'Kinh tế học Vĩ mô ứng dụng — ĐH Trưng Vương',
      page: 88,
      topic: 'Chính sách tài khóa & Lạm phát',
      question: 'Tác động của chính sách tài khóa mở rộng tới sản lượng và lãi suất?',
      aiAnswer:
        'Chính sách tài khóa mở rộng (tăng chi tiêu chính phủ hoặc giảm thuế) làm dịch chuyển đường IS sang phải, dẫn tới tăng sản lượng cân bằng (Y) và đồng thời đẩy mặt bằng lãi suất (r) lên trong ngắn hạn theo mô hình IS-LM.',
      citation: 'Trang 88, Chương 4 — Mô hình IS-LM trong nền kinh tế mở',
      highlightSnippet:
        'Khi chính phủ tăng chi tiêu công G, tổng cầu AD dịch chuyển làm tăng sản lượng Y*, kéo theo nhu cầu tiền giao dịch tăng...',
    },
    ai: {
      docTitle: 'Nhập môn Trí tuệ Nhân tạo & Xử lý Ngôn ngữ tự nhiên',
      page: 156,
      topic: 'Kiến trúc RAG & Vector Database',
      question: 'Cơ chế RAG (Retrieval-Augmented Generation) hạn chế hallucination như thế nào?',
      aiAnswer:
        'RAG truy xuất các đoạn văn bản (chunks) liên quan nhất từ Vector Database dựa trên độ tương đồng ngữ nghĩa, sau đó đưa vào làm CONTEXT cho mô hình ngôn ngữ. Mô hình chỉ trả lời dựa trên tài liệu được cung cấp và đính kèm nguồn trích dẫn.',
      citation: 'Trang 156, Phần 5.3 — Retrieval-Augmented Generation Pipeline',
      highlightSnippet:
        'Vector Embeddings chuyển đổi văn bản tài liệu thành các vector đa chiều, cho phép tìm kiếm ngữ nghĩa chính xác...',
    },
  };

  const currentDemo = demoScenarios[activeDemoTab];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchMode === 'ai') {
      router.push(`/ai?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const hotKeywords = [
    { label: 'Cơ sở dữ liệu', query: 'Cơ sở dữ liệu' },
    { label: 'Kinh tế vĩ mô', query: 'Kinh tế vĩ mô' },
    { label: 'Toán cao cấp', query: 'Toán cao cấp' },
    { label: 'Trí tuệ nhân tạo', query: 'Trí tuệ nhân tạo' },
    { label: 'Quản trị kinh doanh', query: 'Quản trị' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#07152b] to-slate-950 pt-10 pb-20 text-white transition-colors lg:pt-14 lg:pb-28">
      {/* Background Gradients & Glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-emerald-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-20 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top University Brand Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-950/30 px-4 py-2 text-xs font-bold tracking-wide text-red-300 shadow-sm backdrop-blur-md"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white ring-2 ring-red-400/40 overflow-hidden">
              <Image
                src="/trung-vuong-university-logo.svg"
                alt="Trường Đại học Trưng Vương"
                width={24}
                height={24}
                priority
              />
            </div>
            <span>Trường Đại học Trưng Vương</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-semibold">Hệ thống Học thuật Số 24/7</span>
          </motion.div>
        </div>

        {/* Main Hero Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white"
          >
            Khai Phóng Tri Thức Với{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Trợ Lý Học Thuật AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Hệ thống thư viện số tích hợp AI hỗ trợ tra cứu ngữ nghĩa, giải đáp câu hỏi học thuật có trích dẫn số trang trực tiếp từ giáo trình chính thống của nhà trường.
          </motion.p>
        </div>

        {/* Multi-mode Smart Search Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl p-2.5 sm:p-3.5">
            {/* Mode Switch Tabs */}
            <div className="flex items-center gap-2 mb-3 px-2">
              <button
                type="button"
                onClick={() => setSearchMode('document')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  searchMode === 'document'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Books weight="duotone" className="h-4 w-4" />
                Tra cứu Giáo trình & Tài liệu
              </button>

              <button
                type="button"
                onClick={() => setSearchMode('ai')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  searchMode === 'ai'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkle weight="fill" className="h-4 w-4 text-yellow-300" />
                Hỏi đáp trực tiếp với Trợ lý AI
              </button>
            </div>

            {/* Input & Action Button */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="pointer-events-none absolute left-4 text-emerald-400">
                {searchMode === 'ai' ? (
                  <Robot weight="duotone" className="h-6 w-6 animate-pulse" />
                ) : (
                  <MagnifyingGlass weight="bold" className="h-6 w-6" />
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchMode === 'ai'
                    ? 'Đặt câu hỏi học thuật (VD: "Phân biệt dạng chuẩn 3NF và BCNF?")...'
                    : 'Tìm kiếm theo tên giáo trình, tác giả, chuyên ngành...'
                }
                className="h-14 sm:h-16 w-full rounded-2xl border border-slate-700/60 bg-slate-950/70 pl-13 pr-32 text-sm sm:text-base font-medium text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                className="absolute right-2 inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl bg-emerald-600 px-5 sm:px-6 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-500 active:scale-95"
              >
                {searchMode === 'ai' ? 'Hỏi AI' : 'Tra cứu'}
                <ArrowRight weight="bold" className="h-4 w-4" />
              </button>
            </form>

            {/* Hot search keyword tags */}
            <div className="mt-3 flex flex-wrap items-center gap-2 px-2 pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                Gợi ý nhanh:
              </span>
              {hotKeywords.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setSearchQuery(item.query);
                    router.push(`/library?q=${encodeURIComponent(item.query)}`);
                  }}
                  className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-700/50 border border-slate-700/50 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Interactive Split-View Reader Simulation Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          {/* Scenario Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkle weight="fill" className="h-4 w-4 text-emerald-400" />
                Mô phỏng Trình đọc Thông minh (Split-View Reader):
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-2xl bg-slate-900/80 p-1 border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveDemoTab('csdl')}
                className={`rounded-xl px-3 py-1.5 transition-all ${
                  activeDemoTab === 'csdl'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cơ sở dữ liệu
              </button>
              <button
                type="button"
                onClick={() => setActiveDemoTab('kinhte')}
                className={`rounded-xl px-3 py-1.5 transition-all ${
                  activeDemoTab === 'kinhte'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Kinh tế Vĩ mô
              </button>
              <button
                type="button"
                onClick={() => setActiveDemoTab('ai')}
                className={`rounded-xl px-3 py-1.5 transition-all ${
                  activeDemoTab === 'ai'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Trí tuệ Nhân tạo
              </button>
            </div>
          </div>

          {/* Split-View Frame */}
          <div className="overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-3.5 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-semibold text-slate-200 hidden sm:inline-flex items-center gap-1.5">
                  <FilePdf weight="duotone" className="h-4 w-4 text-red-400" />
                  {currentDemo.docTitle}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-950/80 px-3 py-1 font-bold text-emerald-400 border border-emerald-800/60">
                  Trang {currentDemo.page} / 320
                </span>
                <span className="rounded-full bg-blue-950/80 px-3 py-1 font-bold text-blue-400 border border-blue-800/60 hidden md:inline-block">
                  AI RAG Đang hoạt động
                </span>
              </div>
            </div>

            {/* Split Content: Left Document View + Right AI Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              {/* Left: Document View Simulation (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 bg-[#0b1326] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/50">
                      {currentDemo.topic}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <BookmarkSimple weight="fill" className="h-3.5 w-3.5 text-amber-400" />
                      Tài liệu đã kiểm duyệt
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">
                    {currentDemo.docTitle}
                  </h3>

                  <div className="space-y-3.5 text-sm leading-relaxed text-slate-300 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 line-clamp-2">
                      Nội dung bài giảng và tài liệu học tập chính quy tại Trường Đại học Trưng Vương...
                    </p>
                    
                    {/* Highlighted text block */}
                    <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-950/40 p-4 text-emerald-200">
                      <p className="font-semibold text-xs text-emerald-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <CheckCircle weight="fill" className="h-3.5 w-3.5" />
                        Đoạn trích dẫn nguồn AI tham chiếu:
                      </p>
                      <p className="italic">
                        "{currentDemo.highlightSnippet}"
                      </p>
                    </div>

                    <p className="text-slate-400 text-xs">
                      Tất cả các phát biểu lý thuyết đều có chứng minh và ví dụ ứng dụng thực tế trong chương trình học.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
                  <span>Trình xem PDF/DOCX chuẩn hóa</span>
                  <Link
                    href="/library"
                    className="font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                  >
                    Mở đọc toàn bộ tài liệu →
                  </Link>
                </div>
              </div>

              {/* Right: AI Chatbot Assistant with Citation (5 cols) */}
              <div className="lg:col-span-5 p-6 bg-slate-900/95 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                      <Robot weight="duotone" className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Trợ lý Học thuật TV-AI</h4>
                      <p className="text-[11px] text-emerald-400 font-medium">Đối thoại ngữ nghĩa & trích dẫn số trang</p>
                    </div>
                  </div>

                  {/* Question Bubble */}
                  <div className="mb-4 flex justify-end">
                    <div className="max-w-[90%] rounded-2xl rounded-tr-xs bg-emerald-700 p-3.5 text-xs sm:text-sm text-white shadow-sm font-medium">
                      {currentDemo.question}
                    </div>
                  </div>

                  {/* AI Response Bubble */}
                  <div className="mb-4 flex justify-start">
                    <div className="max-w-full rounded-2xl rounded-tl-xs border border-slate-700/80 bg-slate-950 p-4 text-xs sm:text-sm text-slate-200 shadow-md">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-2">
                        <ShieldCheck weight="fill" className="h-4 w-4" />
                        Câu trả lời đối soát từ giáo trình:
                      </div>
                      <p className="leading-relaxed mb-3">
                        {currentDemo.aiAnswer}
                      </p>

                      {/* Source Citation Badge */}
                      <div className="rounded-xl bg-emerald-950/50 border border-emerald-800/60 p-2.5 text-xs text-emerald-300">
                        <div className="font-bold text-[10px] uppercase tracking-wider text-emerald-400 mb-0.5">
                          📍 Nguồn trích dẫn trang tài liệu:
                        </div>
                        <p className="font-semibold text-emerald-200">
                          {currentDemo.citation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Input Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    href="/ai"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Robot weight="bold" className="h-4 w-4 text-emerald-400" />
                    Mở Trợ lý AI hỏi đáp trực tiếp →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
