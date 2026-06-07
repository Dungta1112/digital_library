import { User } from '@/types/auth';

export type Action = 
  | 'VIEW_PUBLIC'
  | 'VIEW_DOC_CONTENT'
  | 'DOWNLOAD_DOC'
  | 'SAVE_DOC'
  | 'ASK_AI'
  | 'POST_FORUM'
  | 'COMMENT_FORUM'
  | 'JOIN_GROUP'
  | 'CREATE_GROUP'
  | 'MODERATE_FORUM'
  | 'PIN_POST'
  | 'ACCESS_ADMIN'
  | 'MANAGE_USERS';

export type Role = User['role'] | 'GUEST';

const RoleHierarchy: Record<Role, number> = {
  GUEST: 0,
  STUDENT: 1,
  LECTURER: 2,
  CONTENT_MANAGER: 2, // Moderator and Lecturer are parallel in some ways, but different domains
  ADMIN: 99,
};

// Base permissions that don't neatly fit a strict hierarchy
const PermissionsMatrix: Record<Role, Action[]> = {
  GUEST: ['VIEW_PUBLIC'],
  STUDENT: [
    'VIEW_PUBLIC',
    'VIEW_DOC_CONTENT',
    'SAVE_DOC',
    'ASK_AI',
    'POST_FORUM',
    'COMMENT_FORUM',
    'JOIN_GROUP'
  ],
  LECTURER: [
    'VIEW_PUBLIC',
    'VIEW_DOC_CONTENT',
    'DOWNLOAD_DOC',
    'SAVE_DOC',
    'ASK_AI',
    'POST_FORUM',
    'COMMENT_FORUM',
    'JOIN_GROUP',
    'CREATE_GROUP',
    'PIN_POST'
  ],
  CONTENT_MANAGER: [
    'VIEW_PUBLIC',
    'VIEW_DOC_CONTENT',
    'DOWNLOAD_DOC',
    'SAVE_DOC',
    'ASK_AI',
    'POST_FORUM',
    'COMMENT_FORUM',
    'JOIN_GROUP',
    'MODERATE_FORUM'
  ],
  ADMIN: [
    'VIEW_PUBLIC',
    'VIEW_DOC_CONTENT',
    'DOWNLOAD_DOC',
    'SAVE_DOC',
    'ASK_AI',
    'POST_FORUM',
    'COMMENT_FORUM',
    'JOIN_GROUP',
    'CREATE_GROUP',
    'MODERATE_FORUM',
    'PIN_POST',
    'ACCESS_ADMIN',
    'MANAGE_USERS'
  ]
};

export const hasPermission = (user: User | null, action: Action): boolean => {
  const role: Role = user ? user.role : 'GUEST';
  
  // Admin has access to everything by default in our simple model
  if (role === 'ADMIN') return true;

  const permissions = PermissionsMatrix[role] || [];
  return permissions.includes(action);
};
