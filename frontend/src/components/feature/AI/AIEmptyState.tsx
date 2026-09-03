'use client';

import React from 'react';
import { Sparkle, FilePdf, MagnifyingGlass, Bookmarks, Lightbulb } from '@phosphor-icons/react';

interface AIEmptyStateProps {
  contextDocTitle?: string | null;
  onSelectPrompt: (prompt: string) => void;
}

const GENERAL_PROMPTS = [
  {
    icon: Sparkle,
    title: 'Tìm tài liệu về Trí tuệ Nhân tạo',
    desc: 'Các giáo trình và bài nghiên cứu AI mới nhất',
    prompt: 'Tìm tài liệu và giáo trình về Trí tuệ Nhân tạo trong thư viện',
  },
  {
    icon: Lightbulb,
    title: 'Giải thích học máy (Machine Learning)',
    desc: 'Khái niệm trọng tâm và các thuật toán phổ biến',
    prompt: 'Giải thích các khái niệm nền tảng của học máy (Machine Learning) kèm ví dụ',
  },
  {
    icon: Bookmarks,
    title: 'Tìm giáo trình Cơ sở dữ liệu',
    desc: 'Hệ quản trị CSDL quan hệ và NoSQL',
    prompt: 'Tìm giáo trình và bài giảng về Hệ quản trị Cơ sở dữ liệu',
  },
  {
    icon: MagnifyingGlass,
    title: 'Phương pháp nghiên cứu khoa học',
    desc: 'Quy trình thu thập và phân tích dữ liệu học thuật',
    prompt: 'Tổng quan các bước thực hiện một nghiên cứu khoa học học thuật',
  },
];

export function AIEmptyState({ contextDocTitle, onSelectPrompt }: AIEmptyStateProps) {
  const docPrompts = [
    {
      icon: FilePdf,
      title: 'Tóm tắt nội dung chính',
      desc: 'Điểm qua các phần quan trọng nhất trong tài liệu này',
      prompt: `Hãy tóm tắt ngắn gọn các nội dung cốt lõi của tài liệu "${contextDocTitle || ''}"`,
    },
    {
      icon: Lightbulb,
      title: 'Giải thích khái niệm trọng tâm',
      desc: 'Làm rõ các định nghĩa học thuật được đề cập',
      prompt: `Liệt kê và giải thích các khái niệm quan trọng nhất trong tài liệu "${contextDocTitle || ''}"`,
    },
    {
      icon: Bookmarks,
      title: 'Các kết luận và kiến nghị',
      desc: 'Rút ra kết quả chính của tài liệu',
      prompt: `Tài liệu "${contextDocTitle || ''}" đưa ra những kết luận và kiến nghị gì?`,
    },
    {
      icon: MagnifyingGlass,
      title: 'Đặt câu hỏi nghiên cứu sâu',
      desc: 'Gợi ý các chủ đề thảo luận tiếp theo',
      prompt: `Từ tài liệu "${contextDocTitle || ''}", hãy gợi ý các hướng nghiên cứu mở rộng liên quan`,
    },
  ];

  const prompts = contextDocTitle ? docPrompts : GENERAL_PROMPTS;

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-8 max-w-2xl mx-auto my-auto">
      {/* Hero Icon & Title */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-sm">
        <Sparkle weight="duotone" className="h-7 w-7" />
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
        {contextDocTitle
          ? `Hỏi đáp về tài liệu "${contextDocTitle.slice(0, 35)}..."`
          : 'Hôm nay bạn muốn tìm hiểu điều gì?'}
      </h2>

      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
        {contextDocTitle
          ? 'Trợ lý AI sẽ tra cứu ngữ cảnh trực tiếp từ tài liệu được chỉ định và trích dẫn số trang.'
          : 'Tra cứu kiến thức, giáo trình và tài liệu nghiên cứu học thuật trong thư viện của bạn.'}
      </p>

      {/* 4 Prompt Suggestion Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {prompts.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className="flex items-start gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3.5 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all text-left shadow-sm group active:scale-[0.98]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 transition-colors">
                <Icon weight="duotone" className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
