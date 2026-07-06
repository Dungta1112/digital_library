'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GroupService } from '@/services/group.service';
import type { StudyGroup } from '@/types/group';

export function HomeGroups() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await GroupService.getGroups();
        setGroups(res.slice(0, 4)); // top 4 groups
      } catch (error) {
        console.warn('Failed to load study groups', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  return (
    <section className="relative py-24 bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden z-10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              Nhóm học tập theo chủ đề
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              Kết nối sinh viên theo môn học, đề tài nghiên cứu hoặc kỹ năng cần phát triển để cùng học, cùng chia sẻ và cùng tiến bộ.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 rounded-3xl bg-gray-100 dark:bg-slate-800 animate-pulse transition-colors duration-300" />
            ))
          ) : (
            groups.map((group, index) => (
              <Link href={`/groups/${group.id}`} key={group.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group h-full p-6 rounded-3xl bg-[rgba(255,255,255,0.72)] dark:bg-slate-900/80 backdrop-blur-[20px] border border-gray-200 dark:border-slate-800 hover:border-green-200 dark:hover:border-green-800 hover:bg-green-50/30 dark:hover:bg-slate-800 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-slate-800 flex items-center justify-center text-green-700 dark:text-green-400 font-bold uppercase transition-colors duration-300">
                      {group.name.charAt(0)}
                    </div>
                    <div className="text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">
                      {group.membersCount} Thành viên
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                    {group.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow mb-6 line-clamp-2 transition-colors duration-300">
                    {group.description}
                  </p>
                  
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                    Khám phá nhóm học tập <span>→</span>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
