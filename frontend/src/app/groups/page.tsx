'use client';
import React, { useState, useEffect } from 'react';
import { GroupService } from '@/services/group.service';
import { StudyGroup } from '@/types/group';
import { GroupCard } from '@/components/feature/Group/GroupComponents';
import { Button } from '@/components/ui/Button';
import { usePermissions } from '@/hooks/usePermissions';
import { Plus, MagnifyingGlass, UsersThree } from '@phosphor-icons/react';

export default function GroupsPage() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { can } = usePermissions();

  useEffect(() => {
    GroupService.getGroups().then(g => {
      setGroups(g);
      setLoading(false);
    });
  }, []);

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header — left-aligned, no card wrapper */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <UsersThree weight="duotone" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  {groups.length} groups
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight transition-colors duration-300">
                Study Groups
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-[55ch] transition-colors duration-300">
                Join communities of learners to collaborate, discuss, and share knowledge across fields.
              </p>
            </div>
            {can('CREATE_GROUP') && (
              <Button className="h-11 px-6 shadow-md font-semibold shrink-0 active:scale-[0.98]">
                <Plus weight="bold" className="w-4 h-4 mr-2" />
                Create group
              </Button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative mt-8 max-w-md">
            <MagnifyingGlass weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search groups..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all duration-200"
            />
          </div>
        </div>
        
        {/* Groups Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-56 bg-white dark:bg-slate-900/80 rounded-xl animate-pulse border border-gray-200/80 dark:border-slate-700/50 transition-colors duration-300" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlass weight="duotone" className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No groups found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Try a different search term or create a new group.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(g => <GroupCard key={g.id} group={g} />)}
          </div>
        )}
      </div>
    </div>
  );
}
