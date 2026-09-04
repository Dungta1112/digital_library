'use client';

import React, { useState } from 'react';
import { GroupMember, StudyGroup } from '@/types/group';
import { GroupService } from '@/services/group.service';
import { getGroupGradient } from './GroupCard';
import { Button } from '@/components/ui/Button';
import {
  Crown,
  User,
  SignOut,
  UserMinus,
  Warning,
  ShieldCheck,
} from '@phosphor-icons/react';

interface GroupMembersProps {
  group: StudyGroup;
  currentUserId?: string;
  isOwner: boolean;
  isMember: boolean;
  onRefresh: () => Promise<void>;
  onLeaveGroup: () => Promise<void>;
}

export function GroupMembers({
  group,
  currentUserId,
  isOwner,
  isMember,
  onRefresh,
  onLeaveGroup,
}: GroupMembersProps) {
  const [removingMember, setRemovingMember] = useState<GroupMember | null>(null);
  const [leaving, setLeaving] = useState<boolean>(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const members = group.members || [];

  const handleConfirmRemove = async () => {
    if (!removingMember || actionLoading) return;
    setActionLoading(true);
    setError('');
    try {
      await GroupService.removeGroupMember(group.id, removingMember.id);
      setRemovingMember(null);
      await onRefresh();
    } catch (err: unknown) {
      console.error('Lỗi khi loại thành viên:', err);
      setError(
        err instanceof Error ? err.message : 'Không thể loại thành viên. Vui lòng thử lại sau.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmLeave = async () => {
    if (leaving) return;
    setLeaving(true);
    setError('');
    try {
      await onLeaveGroup();
      setIsLeaveModalOpen(false);
    } catch (err: unknown) {
      console.error('Lỗi khi rời nhóm:', err);
      setError(err instanceof Error ? err.message : 'Không thể rời nhóm lúc này.');
      setLeaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ── Sub-header ────────────────────────────────────────── */}
      <div className="h-12 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Danh sách thành viên ({members.length})
          </span>
        </div>

        {isMember && !isOwner && (
          <button
            type="button"
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <SignOut weight="bold" className="w-3.5 h-3.5" />
            <span>Rời nhóm</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ── Members List ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {members.map((member) => {
            const isSelf = currentUserId && member.id === currentUserId;
            const isGroupOwner = member.role === 'OWNER' || (group.ownerId && member.id === group.ownerId);
            const gradient = getGroupGradient(member.name || member.id);
            const initial = member.name.trim().charAt(0).toUpperCase() || 'U';

            return (
              <div
                key={member.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm`}
                  >
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {member.name}
                      </span>
                      {isSelf && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          Bạn
                        </span>
                      )}
                    </div>

                    {member.email && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {member.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Role Badge */}
                  {isGroupOwner ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
                      <Crown weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                      <span>Trưởng nhóm</span>
                    </span>
                  ) : member.role === 'ADMIN' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-blue-800/50">
                      <ShieldCheck weight="bold" className="w-3.5 h-3.5" />
                      <span>Quản trị viên</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                      <User weight="regular" className="w-3.5 h-3.5 text-slate-400" />
                      <span>Thành viên</span>
                    </span>
                  )}

                  {/* Owner Action: Remove Member */}
                  {isOwner && !isGroupOwner && !isSelf && (
                    <button
                      type="button"
                      onClick={() => setRemovingMember(member)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Loại khỏi nhóm"
                    >
                      <UserMinus weight="bold" className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Remove Member Modal ───────────────────────────────── */}
      {removingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Warning weight="duotone" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Loại thành viên khỏi nhóm?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Xác nhận xóa thành viên này khỏi danh sách học tập.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Bạn có chắc chắn muốn loại <strong>&ldquo;{removingMember.name}&rdquo;</strong> khỏi phòng học nhóm không? Thành viên này sẽ không thể tiếp tục gửi tin nhắn hoặc truy cập tài liệu bảo vệ trong nhóm.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setRemovingMember(null)}
                disabled={actionLoading}
                className="h-10 px-4 text-xs font-semibold rounded-xl"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                onClick={handleConfirmRemove}
                disabled={actionLoading}
                className="h-10 px-4 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm"
              >
                {actionLoading ? 'Đang loại...' : 'Xác nhận loại'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Leave Group Modal ─────────────────────────────────── */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <SignOut weight="duotone" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Rời khỏi nhóm học tập?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bạn có thể tham gia lại bất cứ lúc nào.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Bạn có chắc muốn rời nhóm <strong>&ldquo;{group.name}&rdquo;</strong>? Bạn sẽ không còn nhận được các cập nhật trao đổi mới trong nhóm.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsLeaveModalOpen(false)}
                disabled={leaving}
                className="h-10 px-4 text-xs font-semibold rounded-xl"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                onClick={handleConfirmLeave}
                disabled={leaving}
                className="h-10 px-4 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm"
              >
                {leaving ? 'Đang rời...' : 'Rời nhóm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
