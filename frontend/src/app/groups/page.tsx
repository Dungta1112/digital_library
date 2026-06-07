'use client';
import React, { useState, useEffect } from 'react';
import { GroupService } from '@/services/group.service';
import { StudyGroup } from '@/types/group';
import { GroupCard } from '@/components/feature/Group/GroupComponents';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';

export default function GroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { can } = usePermissions();

  useEffect(() => {
    GroupService.getGroups().then(g => {
      setGroups(g);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/80 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-gray-100">
          <div className="max-w-2xl">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-8 text-3xl shadow-sm border border-purple-100">
              👥
            </div>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Nhóm học tập</h1>
            <p className="text-xl text-gray-600 font-light tracking-tight leading-relaxed max-w-2xl">Tham gia các cộng đồng người học để cộng tác, thảo luận bài viết và chia sẻ kiến thức ở nhiều lĩnh vực.</p>
          </div>
          {can('CREATE_GROUP') && (
            <Button className="h-14 px-8 shadow-lg font-bold shrink-0 text-lg">
              ➕ Tạo nhóm
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-gray-100 shadow-sm"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map(g => <GroupCard key={g.id} group={g} />)}
          </div>
        )}
      </div>
    </div>
  );
}
