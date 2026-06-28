'use client';
import React, { useState } from 'react';
import { StudyGroup } from '@/types/group';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GroupService } from '@/services/group.service';
import { UsersThree, CheckCircle, ArrowRight, BookOpenText } from '@phosphor-icons/react';

export function GroupCard({ group }: { group: StudyGroup }) {
  return (
    <Link href={`/groups/${group.id}`} className="block group">
      <div className="relative bg-white dark:bg-slate-900/80 p-6 rounded-xl border border-gray-200/80 dark:border-slate-700/50 transition-all duration-300 flex flex-col h-full hover:border-emerald-500/40 dark:hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/5 active:scale-[0.98]">
        {/* Topic + Status Row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md transition-colors duration-300">
            {group.topic || 'General'}
          </span>
          {group.isJoined && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle weight="fill" className="w-4 h-4" />
              Joined
            </span>
          )}
        </div>

        {/* Group Name */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-200">
          {group.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-grow mb-5 transition-colors duration-300">
          {group.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <UsersThree weight="duotone" className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span className="font-medium">{group.membersCount ?? group.members?.length ?? 0}</span>
            <span className="hidden sm:inline">members</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            View
            <ArrowRight weight="bold" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function GroupAction({ group, onJoinSuccess }: { group: StudyGroup, onJoinSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  
  if (group.isJoined) {
    return (
      <button disabled className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold cursor-default transition-colors duration-300">
        <CheckCircle weight="fill" className="w-5 h-5" />
        Already a member
      </button>
    );
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

  return (
    <Button onClick={handleJoin} disabled={loading} className="w-full h-11 text-sm font-semibold tracking-wide active:scale-[0.98]">
      {loading ? 'Joining...' : 'Join group'}
    </Button>
  );
}
