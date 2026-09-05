'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GroupService } from '@/services/group.service';
import { StudyGroup, GroupTabType, GroupMembershipStatus } from '@/types/group';
import { useAuth } from './useAuth';

export interface GroupWorkspaceState {
  group: StudyGroup | null;
  loading: boolean;
  error: string | null;
  isNotFound: boolean;
  isForbidden: boolean;
  activeTab: GroupTabType;
  setActiveTab: (tab: GroupTabType) => void;
  // Permissions & Membership
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  membershipStatus: GroupMembershipStatus;
  canPost: boolean;
  canManageDocs: boolean;
  canDeleteGroup: boolean;
  canRemoveMember: boolean;
  // Actions
  handleJoin: () => Promise<void>;
  handleLeave: () => Promise<void>;
  handleDelete: () => Promise<void>;
  refresh: () => Promise<void>;
  isActionLoading: boolean;
}

const VALID_TABS: GroupTabType[] = ['discussion', 'documents', 'members', 'about'];

export function useGroupWorkspace(groupId: string): GroupWorkspaceState {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [, startTransition] = useTransition();

  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [isForbidden, setIsForbidden] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  // Tab derived directly from URL (?tab=...)
  const tabParam = searchParams.get('tab') as GroupTabType;
  const activeTab: GroupTabType = VALID_TABS.includes(tabParam) ? tabParam : 'discussion';

  const setActiveTab = useCallback(
    (tab: GroupTabType) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (!groupId) return;
    let ignore = false;
    const controller = new AbortController();

    GroupService.getGroupById(groupId, controller.signal)
      .then((data) => {
        if (!ignore) {
          if (!data) {
            setIsNotFound(true);
            setGroup(null);
          } else {
            setGroup(data);
            setIsNotFound(false);
            setIsForbidden(false);
            setError(null);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore && !controller.signal.aborted) {
          const status =
            (err as { status?: number; response?: { status?: number } })?.status ||
            (err as { response?: { status?: number } })?.response?.status;

          if (status === 404) {
            setIsNotFound(true);
          } else if (status === 403) {
            setIsForbidden(true);
            setError('Bạn không có quyền truy cập nhóm học tập này.');
          } else {
            setError(
              err instanceof Error ? err.message : 'Không thể tải thông tin nhóm. Vui lòng thử lại sau.'
            );
          }
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [groupId, reloadKey]);

  // Derive permissions
  const isOwner = Boolean(user && group && group.ownerId && user.id === group.ownerId);
  const isAdmin = user?.role === 'ADMIN';

  // Check verified membership
  let membershipStatus: GroupMembershipStatus = 'NONE';
  if (isOwner) {
    membershipStatus = 'APPROVED';
  } else if (group && user) {
    const matchedMember = group.members?.find((m) => m.id === user.id);
    if (matchedMember) {
      membershipStatus = matchedMember.status || 'APPROVED';
    } else if (group.isJoined || group.membershipStatus === 'APPROVED') {
      membershipStatus = 'APPROVED';
    } else if (group.membershipStatus === 'PENDING') {
      membershipStatus = 'PENDING';
    }
  } else if (group?.isJoined) {
    membershipStatus = 'APPROVED';
  }

  const isMember = isOwner || membershipStatus === 'APPROVED';
  const canPost = isMember;
  const canManageDocs = isOwner;
  const canDeleteGroup = isOwner || isAdmin;
  const canRemoveMember = isOwner;

  const handleJoin = async () => {
    if (!group || isActionLoading) return;
    setIsActionLoading(true);
    try {
      const res = await GroupService.joinGroup(group.id);
      if (res.status === 'APPROVED') {
        setGroup((prev) =>
          prev
            ? {
                ...prev,
                isJoined: true,
                membershipStatus: 'APPROVED',
                membersCount: prev.membersCount + 1,
              }
            : null
        );
      } else if (res.status === 'PENDING') {
        setGroup((prev) =>
          prev
            ? {
                ...prev,
                membershipStatus: 'PENDING',
              }
            : null
        );
      }
      setReloadKey((k) => k + 1);
    } catch (err) {
      console.error('Lỗi khi tham gia nhóm:', err);
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!group || isActionLoading || isOwner) return;
    setIsActionLoading(true);
    try {
      await GroupService.leaveGroup(group.id);
      setGroup((prev) =>
        prev
          ? {
              ...prev,
              isJoined: false,
              membershipStatus: 'NONE',
              membersCount: Math.max(0, prev.membersCount - 1),
            }
          : null
      );
      setReloadKey((k) => k + 1);
    } catch (err) {
      console.error('Lỗi khi rời nhóm:', err);
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!group || isActionLoading || !canDeleteGroup) return;
    setIsActionLoading(true);
    try {
      await GroupService.deleteGroup(group.id);
      router.push('/groups');
    } catch (err) {
      console.error('Lỗi khi giải tán nhóm:', err);
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  return {
    group,
    loading,
    error,
    isNotFound,
    isForbidden,
    activeTab,
    setActiveTab,
    isOwner,
    isAdmin,
    isMember,
    membershipStatus,
    canPost,
    canManageDocs,
    canDeleteGroup,
    canRemoveMember,
    handleJoin,
    handleLeave,
    handleDelete,
    refresh,
    isActionLoading,
  };
}
