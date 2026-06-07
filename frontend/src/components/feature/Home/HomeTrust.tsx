'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AdminService } from '@/services/admin.service';
import type { SystemStats } from '@/types/admin';

export function HomeTrust() {
  const [stats, setStats] = useState<SystemStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await AdminService.getStats();
        setStats(data);
      } catch (error) {
        console.warn('Failed to load stats', error);
      }
    }
    fetchStats();
  }, []);

  // Fallback if stats fail to load
  const indicators = stats ? [
    { value: `${stats.totalDocuments}+`, label: "Tài liệu học thuật" },
    { value: `${stats.totalUsers}+`, label: "Sinh viên & Giảng viên" },
    { value: `${stats.totalGroups}+`, label: "Nhóm học tập" },
    { value: "24/7", label: "Trợ lý AI hỗ trợ" }
  ] : [
    { value: "Kho tài liệu đang được mở rộng", label: "Liên tục cập nhật hàng tuần" },
    { value: "Trải nghiệm học tập được hỗ trợ bởi AI", label: "Tóm tắt & Tìm kiếm thông minh" },
    { value: "Cộng đồng học thuật đang phát triển", label: "Kết nối sinh viên & Giảng viên" },
    { value: "Dữ liệu được tổ chức theo chủ đề", label: "Dễ dàng tra cứu & Quản lý" }
  ];

  return (
    <section className="relative py-24 bg-[#065F46] text-white overflow-hidden z-10">
      {/* Decorative background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.2)_0%,transparent_100%)] opacity-60" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-4xl md:text-5xl font-bold mb-6"
          >
            Xây dựng hệ sinh thái học tập số
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-green-50/80 leading-relaxed"
          >
            Hệ thống hướng đến việc tập trung tài liệu, tăng khả năng tiếp cận tri thức và tạo môi trường trao đổi học thuật có tổ chức.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-green-300 mb-2">{item.value}</h3>
              <p className="text-sm text-green-100/70 uppercase tracking-wider font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
