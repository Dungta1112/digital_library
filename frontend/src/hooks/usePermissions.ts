'use client';
import { useAuth } from './useAuth';
import { hasPermission, Action } from '@/utils/rbac';

export function usePermissions() {
  const { user, isLoading } = useAuth();

  const can = (action: Action): boolean => {
    return hasPermission(user, action);
  };

  const isRole = (roles: Array<'STUDENT' | 'LECTURER' | 'CONTENT_MANAGER' | 'ADMIN'>) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    can,
    isRole,
    isGuest: !user,
    isLoading
  };
}
