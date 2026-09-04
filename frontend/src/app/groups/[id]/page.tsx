'use client';

import React, { use, useState, Suspense } from 'react';
import Link from 'next/link';
import { useGroupWorkspace } from '@/hooks/useGroupWorkspace';
import { useAuth } from '@/hooks/useAuth';
import {
  GroupWorkspaceShell,
  GroupChat,
  GroupDocuments,
  GroupMembers,
  GroupAbout,
  DeleteConfirmModal,
} from '@/components/feature/Group/GroupComponents';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  LockKey,
  MagnifyingGlass,
  WarningCircle,
} from '@phosphor-icons/react';

function GroupDetailContent({ groupId }: { groupId: string }) {
  const { user } = useAuth();
  const {
    group,
    loading,
    error,
    isNotFound,
    isForbidden,
    activeTab,
    setActiveTab,
    isOwner,
    isMember,
    canManageDocs,
    canDeleteGroup,
    handleJoin,
    handleLeave,
    handleDelete,
    refresh,
    isActionLoading,
  } = useGroupWorkspace(groupId);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDelete();
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950">
        <div className="hidden md:block w-60 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse" />
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse" />
          <div className="flex-1 p-6 space-y-4">
            <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlass weight="duotone" className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Không tìm thấy nhóm học tập
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Nhóm học tập này có thể đã ngừng hoạt động hoặc đường dẫn không chính xác.
          </p>
          <Link href="/groups">
            <Button className="h-11 px-6 text-xs font-bold rounded-xl flex items-center gap-2 mx-auto">
              <ArrowLeft weight="bold" className="w-4 h-4" />
              <span>Quay lại danh sách nhóm</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isForbidden) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LockKey weight="duotone" className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Nhóm học tập này được bảo vệ hoặc ở chế độ riêng tư. Bạn cần là thành viên chính thức để xem nội dung.
          </p>
          <Link href="/groups">
            <Button variant="secondary" className="h-11 px-6 text-xs font-bold rounded-xl flex items-center gap-2 mx-auto">
              <ArrowLeft weight="bold" className="w-4 h-4" />
              <span>Khám phá nhóm khác</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error && !group) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <WarningCircle weight="duotone" className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Lỗi khi tải thông tin nhóm
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {error}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/groups">
              <Button variant="secondary" className="h-10 px-5 text-xs font-semibold rounded-xl">
                Quay lại
              </Button>
            </Link>
            <Button onClick={() => refresh()} className="h-10 px-5 text-xs font-bold rounded-xl">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!group) return null;

  return (
    <>
      <GroupWorkspaceShell
        group={group}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        canDeleteGroup={canDeleteGroup}
        onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
        isMember={isMember}
      >
        {activeTab === 'discussion' && (
          <GroupChat
            groupId={group.id}
            isMember={isMember}
            onOpenDocuments={() => setActiveTab('documents')}
          />
        )}

        {activeTab === 'documents' && (
          <GroupDocuments
            groupId={group.id}
            canManageDocs={canManageDocs}
            isMember={isMember}
          />
        )}

        {activeTab === 'members' && (
          <GroupMembers
            group={group}
            currentUserId={user?.id}
            isOwner={isOwner}
            isMember={isMember}
            onRefresh={refresh}
            onLeaveGroup={handleLeave}
          />
        )}

        {activeTab === 'about' && (
          <GroupAbout
            group={group}
            isMember={isMember}
            onJoin={handleJoin}
            isActionLoading={isActionLoading}
          />
        )}
      </GroupWorkspaceShell>

      {/* Delete Group Modal */}
      <DeleteConfirmModal
        group={group}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </>
  );
}

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GroupDetailContent groupId={id} />
    </Suspense>
  );
}