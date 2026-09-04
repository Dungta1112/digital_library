'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GroupService } from '@/services/group.service';
import { StudyGroup } from '@/types/group';
import { GroupCard } from '@/components/feature/Group/GroupCard';
import { CreateGroupDialog } from '@/components/feature/Group/CreateGroupDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import {
  Plus,
  MagnifyingGlass,
  UsersThree,
  Compass,
  BookmarkSimple,
  Crown,
  WarningCircle,
  ArrowsClockwise,
} from '@phosphor-icons/react';

type CatalogScope = 'all' | 'joined' | 'managed';

function GroupsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { can } = usePermissions();

  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // URL state: ?q=...&scope=...
  const queryParam = searchParams.get('q') || '';
  const scopeParam = (searchParams.get('scope') as CatalogScope) || 'all';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const scope: CatalogScope = ['all', 'joined', 'managed'].includes(scopeParam) ? scopeParam : 'all';

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    GroupService.getGroups(controller.signal)
      .then((data) => {
        if (!ignore) {
          setGroups(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore && !controller.signal.aborted) {
          console.error('Lỗi khi tải danh sách nhóm:', err);
          setError('Không thể tải danh sách nhóm học tập. Vui lòng thử lại sau.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [reloadKey]);

  // Sync state to URL
  const updateUrlParams = (newQ: string, newScope: CatalogScope) => {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set('q', newQ.trim());
    if (newScope !== 'all') params.set('scope', newScope);
    const qs = params.toString();
    router.replace(qs ? `/groups?${qs}` : '/groups', { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    updateUrlParams(val, scope);
  };

  const handleScopeChange = (newScope: CatalogScope) => {
    updateUrlParams(searchTerm, newScope);
  };

  const handleRefresh = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const filteredGroups = groups.filter((g) => {
    // 1. Text filter
    const matchesSearch =
      !searchTerm.trim() ||
      g.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase().trim());

    if (!matchesSearch) return false;

    // 2. Scope filter
    if (scope === 'joined') {
      return g.isJoined || g.membershipStatus === 'APPROVED';
    }
    if (scope === 'managed') {
      return user && g.ownerId && g.ownerId === user.id;
    }
    return true;
  });

  const joinedCount = groups.filter((g) => g.isJoined || g.membershipStatus === 'APPROVED').length;
  const managedCount = user ? groups.filter((g) => g.ownerId === user.id).length : 0;

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 py-8 sm:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ── Page Header ────────────────────────────────────── */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <UsersThree weight="duotone" className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Phòng học nhóm học thuật
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                Tìm cộng đồng học tập của bạn
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-[65ch]">
                Cùng trao đổi, đọc tài liệu thư viện và hỗ trợ nhau theo từng môn học, chuyên đề hoặc đồ án.
              </p>
            </div>

            {can('CREATE_GROUP') || user ? (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="h-11 px-5 shadow-lg shadow-emerald-600/15 font-bold shrink-0 rounded-2xl flex items-center gap-2 active:scale-95"
              >
                <Plus weight="bold" className="w-4 h-4" />
                <span>Tạo phòng học</span>
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => router.push('/login?redirect=/groups')}
                className="h-11 px-5 font-semibold shrink-0 rounded-2xl"
              >
                Đăng nhập để tạo nhóm
              </Button>
            )}
          </div>

          {/* ── Search & Scopes Row ────────────────────────────── */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass
                weight="bold"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              />
              <Input
                type="text"
                placeholder="Tìm nhóm theo tên, chuyên môn hoặc mục tiêu..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl text-sm"
              />
            </div>

            {/* Scope Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => handleScopeChange('all')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  scope === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass weight={scope === 'all' ? 'fill' : 'regular'} className="w-3.5 h-3.5 text-emerald-600" />
                <span>Khám phá ({groups.length})</span>
              </button>

              {user && (
                <>
                  <button
                    type="button"
                    onClick={() => handleScopeChange('joined')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      scope === 'joined'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <BookmarkSimple weight={scope === 'joined' ? 'fill' : 'regular'} className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã tham gia ({joinedCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScopeChange('managed')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      scope === 'managed'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Crown weight={scope === 'managed' ? 'fill' : 'regular'} className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tôi quản lý ({managedCount})</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Groups Grid / Status View ───────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-52 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 animate-pulse p-6"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 max-w-md mx-auto">
            <WarningCircle weight="duotone" className="w-12 h-12 text-red-500 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Không thể tải danh sách nhóm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">{error}</p>
            <Button
              onClick={handleRefresh}
              className="h-10 px-5 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <ArrowsClockwise weight="bold" className="w-4 h-4" />
              <span>Thử lại</span>
            </Button>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
              <UsersThree weight="duotone" className="w-8 h-8" />
            </div>

            {scope === 'joined' ? (
              <>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Bạn chưa tham gia nhóm học tập nào
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Khám phá các phòng học chung để cùng trao đổi kiến thức và tài liệu.
                </p>
                <Button
                  onClick={() => handleScopeChange('all')}
                  className="h-10 px-5 text-xs font-bold rounded-xl"
                >
                  Khám phá danh sách nhóm
                </Button>
              </>
            ) : scope === 'managed' ? (
              <>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Bạn chưa quản lý nhóm học tập nào
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Tạo phòng học mới để dẫn dắt nhóm ôn thi hoặc nghiên cứu chuyên đề.
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="h-10 px-5 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus weight="bold" className="w-4 h-4" />
                  <span>Tạo nhóm ngay</span>
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Không tìm thấy nhóm học tập phù hợp
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Thử tìm kiếm với từ khóa khác hoặc tạo nhóm học tập mới cho môn học của bạn.
                </p>
                {searchTerm && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchTerm('');
                      updateUrlParams('', scope);
                    }}
                    className="h-10 px-5 text-xs font-semibold rounded-xl"
                  >
                    Xóa từ khóa tìm kiếm
                  </Button>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGroups.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupDialog
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => handleRefresh()}
      />
    </div>
  );
}

export default function GroupsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GroupsCatalogContent />
    </Suspense>
  );
}