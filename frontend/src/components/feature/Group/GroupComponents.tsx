'use client';
import React, { useState } from 'react';
import { StudyGroup } from '@/types/group';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GroupService } from '@/services/group.service';

export function GroupCard({ group }: { group: StudyGroup }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-2">
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs font-bold px-4 py-2 bg-purple-50 text-purple-700 rounded-full tracking-wide border border-purple-100">{group.topic}</span>
        {group.isJoined && <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 flex items-center gap-1 shadow-sm">✅ Đã tham gia</span>}
      </div>
      <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">{group.name}</h3>
      <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">{group.description}</p>
      <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
        <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
          <span className="text-lg">👥</span> {group.membersCount} thành viên
        </span>
        <Link href={`/groups/${group.id}`}>
          <Button size="sm" variant="secondary" className="hover:border-purple-300 hover:text-purple-700 transition-colors font-semibold">Xem chi tiết</Button>
        </Link>
      </div>
    </div>
  );
}

export function GroupAction({ group, onJoinSuccess }: { group: StudyGroup, onJoinSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  
  if (group.isJoined) {
    return <Button disabled variant="secondary" className="w-full h-12 text-green-700 bg-green-50 border-green-200 font-bold opacity-100">✅ Đã là thành viên</Button>;
  }
  
  const handleJoin = async () => {
    setLoading(true);
    try {
      await GroupService.joinGroup(group.id);
      onJoinSuccess();
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return <Button onClick={handleJoin} disabled={loading} className="w-full h-12 shadow-md text-base font-bold tracking-wide">
    {loading ? 'Đang tham gia...' : '👋 Tham gia nhóm'}
  </Button>;
}
