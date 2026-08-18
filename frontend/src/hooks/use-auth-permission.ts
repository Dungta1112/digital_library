'use client';

import { useAuth } from './useAuth';
import { StudyGroup } from '@/types/group';

export function useAuthPermission() {
  const { user, isLoading } = useAuth();

  const canDeleteGroup = (group?: StudyGroup | null): boolean => {
    if (!user || !group) return false;
    if (user.role === 'ADMIN') return true;
    if (group.ownerId && user.id === group.ownerId) return true;
    return false;
  };

  const isOwner = (group?: StudyGroup | null): boolean => {
    if (!user || !group || !group.ownerId) return false;
    return user.id === group.ownerId;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'ADMIN';
  };

  return {
    user,
    isLoading,
    canDeleteGroup,
    isOwner,
    isAdmin,
  };
}

export const useAuthPermissions = useAuthPermission;
