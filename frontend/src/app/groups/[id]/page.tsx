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
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 transition-colors duration-300"><div className="container mx-auto px-4 max-w-5xl animate-pulse h-[400px] bg-gray-200 dark:bg-slate-800 rounded-3xl transition-colors duration-300"></div></div>;
  }

  return (
    <div className="flex h-[calc(100vh-73px)] w-full overflow-hidden bg-white dark:bg-[#313338] transition-colors duration-300">
      {/* Left Sidebar */}
      <div className="w-72 bg-gray-50 dark:bg-[#2b2d31] flex flex-col flex-shrink-0 border-r border-gray-200 dark:border-[#1e1f22]">
        {/* Header */}
        <div className="h-12 px-4 flex items-center shadow-sm border-b border-gray-200 dark:border-[#1e1f22] flex-shrink-0">
          <Link href="/groups" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            ← Back to Study Groups
          </Link>
        </div>

        {/* Group Info & Members List (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="mb-6">
            <span className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 rounded-sm mb-2 inline-block">
              {group.topic}
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              {group.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {group.description}
            </p>
          </div>

          {!group.isJoined && (
            <div className="mb-6">
              <GroupAction group={group} onJoinSuccess={() => setGroup({...group, isJoined: true, membersCount: group.membersCount + 1})} />
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
              Members — {group.membersCount}
            </h3>
            <div className="space-y-1">
              {group.members?.map(m => (
                <div key={m.id} className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-200/50 dark:hover:bg-[#3f4147] rounded cursor-pointer group/member transition-colors">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Status indicator (fake) */}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-gray-50 dark:border-[#2b2d31] rounded-full"></div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover/member:text-gray-900 dark:group-hover/member:text-white transition-colors">
                      {m.name}
                    </span>
                    {m.role === 'ADMIN' && (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#313338]">
        {group.isJoined ? (
          <GroupChat groupId={group.id} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 max-w-sm">
              <div className="w-20 h-20 bg-gray-100 dark:bg-[#2b2d31] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔒</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Private Channel</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Join the group to view activity and participate in discussions.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
