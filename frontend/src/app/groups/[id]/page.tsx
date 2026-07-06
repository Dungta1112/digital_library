'use client';

import React, { useState, useEffect, use } from 'react';
import { GroupService } from '@/services/group.service';
import { StudyGroup } from '@/types/group';
import { GroupAction } from '@/components/feature/Group/GroupComponents';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Lock, Crown, User } from '@phosphor-icons/react';

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
    return (
      <div className="flex h-[calc(100vh-73px)] w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="w-72 bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 animate-pulse" />
        <div className="flex-1 animate-pulse bg-gray-50/50 dark:bg-slate-950" />
      </div>
    );
  }

  // Generate a deterministic gradient for the group avatar based on name
  const gradients = [
    'from-emerald-400 to-cyan-500',
    'from-emerald-500 to-teal-600',
    'from-teal-400 to-emerald-600',
    'from-cyan-400 to-emerald-500',
  ];
  const gradientIdx = group.name.length % gradients.length;
  const groupGradient = gradients[gradientIdx];

  return (
    <div className="flex h-[calc(100vh-73px)] w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Left Sidebar */}
      <div className="w-72 bg-gray-50 dark:bg-slate-900 flex flex-col flex-shrink-0 border-r border-gray-200 dark:border-slate-800">
        {/* Header */}
        <div className="h-12 px-4 flex items-center border-b border-gray-200 dark:border-slate-800 flex-shrink-0">
          <Link href="/groups" className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft weight="bold" className="w-4 h-4" />
            Study Groups
          </Link>
        </div>

        {/* Group Info & Members List (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {/* Group Avatar + Info */}
          <div className="mb-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${groupGradient} flex items-center justify-center text-white text-lg font-bold mb-3 shadow-sm`}>
              {group.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md mb-2 inline-block">
              {group.topic}
            </span>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 leading-tight">
              {group.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {group.description}
            </p>
          </div>

          {!group.isJoined && (
            <div className="mb-6">
              <GroupAction group={group} onJoinSuccess={() => setGroup({...group, isJoined: true, membersCount: group.membersCount + 1})} />
            </div>
          )}

          {/* Members */}
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center justify-between">
              Members <span className="text-gray-300 dark:text-gray-600">{group.membersCount}</span>
            </h3>
            <div className="space-y-0.5">
              {group.members?.map((m, idx) => {
                const memberGradients = [
                  'from-emerald-400 to-cyan-500',
                  'from-teal-400 to-emerald-500',
                  'from-cyan-400 to-teal-500',
                  'from-emerald-500 to-green-600',
                ];
                const mGrad = memberGradients[idx % memberGradients.length];

                return (
                  <div key={m.id} className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-200/50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer group/member transition-colors">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${mGrad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      {/* Online status indicator */}
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-gray-50 dark:border-slate-900 rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover/member:text-gray-900 dark:group-hover/member:text-white transition-colors">
                        {m.name}
                      </span>
                      {m.role === 'ADMIN' && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                          <Crown weight="fill" className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        {group.isJoined ? (
          <GroupChat groupId={group.id} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 max-w-sm">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock weight="duotone" className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Members only</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Join this group to view discussions and participate in conversations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
