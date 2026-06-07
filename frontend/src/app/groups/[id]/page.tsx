'use client';

import React, { useState, useEffect, use } from 'react';
import { GroupService } from '@/services/group.service';
import { StudyGroup } from '@/types/group';
import { GroupAction } from '@/components/feature/Group/GroupComponents';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { GroupChat } from '@/components/feature/Group/GroupChat';

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GroupService.getGroupById(id).then(g => {
      if (!g) notFound();
      setGroup(g);
      setLoading(false);
    });
  }, [id]);

  if (loading || !group) {
    return <div className="min-h-screen bg-gray-50 py-10"><div className="container mx-auto px-4 max-w-5xl animate-pulse h-[400px] bg-gray-200 rounded-3xl"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/80 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/groups" className="text-sm font-bold text-gray-500 hover:text-purple-700 mb-8 inline-flex items-center bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm transition-all hover:shadow-md">
          ← Back to Study Groups
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
              <span className="text-sm font-bold px-4 py-1.5 bg-purple-50 text-purple-700 rounded-lg tracking-wide inline-block mb-6 border border-purple-100">{group.topic}</span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{group.name}</h1>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10">{group.description}</p>
              
              <div className="pt-8 border-t border-gray-100 mt-6">
                {group.isJoined ? (
                  <GroupChat groupId={group.id} />
                ) : (
                  <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-gray-200 border-dashed text-gray-500">
                     Join the group to view activity and participate in discussions.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm mb-6">
              <GroupAction group={group} onJoinSuccess={() => setGroup({...group, isJoined: true, membersCount: group.membersCount + 1})} />
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="font-extrabold text-gray-900 mb-6 flex items-center gap-3 text-lg">
                👥 Members <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-bold">{group.membersCount}</span>
              </h3>
              <div className="space-y-5">
                {group.members?.map(m => (
                  <div key={m.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shadow-inner border border-gray-200">👤</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm flex flex-col items-start gap-1">
                        {m.name}
                        {m.role === 'ADMIN' && <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Admin</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
