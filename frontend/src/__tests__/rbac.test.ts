import { describe, it, expect } from 'vitest';
import { hasPermission, Role } from '../utils/rbac';

describe('RBAC System Matrix & Permissions', () => {
  it('ADMIN should have full admin, upload, review, and manage permissions', () => {
    expect(hasPermission('ADMIN', 'ACCESS_ADMIN')).toBe(true);
    expect(hasPermission('ADMIN', 'MODERATE_FORUM')).toBe(true);
    expect(hasPermission('ADMIN', 'MANAGE_USERS')).toBe(true);
    expect(hasPermission('ADMIN', 'VIEW_DOC_CONTENT')).toBe(true);
  });

  it('CONTENT_MANAGER should have admin access and forum moderation, but NOT manage users', () => {
    expect(hasPermission('CONTENT_MANAGER', 'ACCESS_ADMIN')).toBe(true);
    expect(hasPermission('CONTENT_MANAGER', 'MODERATE_FORUM')).toBe(true);
    expect(hasPermission('CONTENT_MANAGER', 'MANAGE_USERS')).toBe(false);
  });

  it('LECTURER should be able to view/save docs and pin posts, but denied from ACCESS_ADMIN and MANAGE_USERS', () => {
    expect(hasPermission('LECTURER', 'VIEW_DOC_CONTENT')).toBe(true);
    expect(hasPermission('LECTURER', 'PIN_POST')).toBe(true);
    expect(hasPermission('LECTURER', 'ACCESS_ADMIN')).toBe(false);
    expect(hasPermission('LECTURER', 'MANAGE_USERS')).toBe(false);
  });

  it('STUDENT should be able to view library and post on forum, but denied from admin and moderation', () => {
    expect(hasPermission('STUDENT', 'VIEW_DOC_CONTENT')).toBe(true);
    expect(hasPermission('STUDENT', 'POST_FORUM')).toBe(true);
    expect(hasPermission('STUDENT', 'ACCESS_ADMIN')).toBe(false);
    expect(hasPermission('STUDENT', 'MODERATE_FORUM')).toBe(false);
    expect(hasPermission('STUDENT', 'MANAGE_USERS')).toBe(false);
  });

  it('Guest or undefined role should deny all protected permissions', () => {
    expect(hasPermission(undefined, 'ACCESS_ADMIN')).toBe(false);
    expect(hasPermission(null, 'ACCESS_ADMIN')).toBe(false);
    expect(hasPermission('UNKNOWN_ROLE' as Role, 'ACCESS_ADMIN')).toBe(false);
  });
});
