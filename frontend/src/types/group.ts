export type GroupTabType = 'discussion' | 'documents' | 'members' | 'about';

export type GroupMemberRole = 'OWNER' | 'MEMBER' | 'ADMIN';

export type GroupMembershipStatus = 'APPROVED' | 'PENDING' | 'REMOVED' | 'NONE';

export interface GroupMember {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: GroupMemberRole;
  status?: GroupMembershipStatus;
  joinedAt?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topic?: string;
  visibility?: 'PUBLIC' | 'REQUEST_TO_JOIN' | 'PRIVATE';
  ownerId?: string;
  ownerName?: string;
  membersCount: number;
  members?: GroupMember[];
  isJoined?: boolean;
  membershipStatus?: GroupMembershipStatus;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  status?: 'pending' | 'confirmed' | 'failed' | 'unknown';
}

export interface GroupDocumentItem {
  id: string;
  title: string;
  author?: string;
  description?: string;
  category?: string;
  categoryId?: string;
  fileType?: string;
  coverUrl?: string;
  thumbnail?: string;
  status?: string;
  viewCount?: number;
  downloadCount?: number;
  rating?: number;
  createdAt?: string;
}

export interface GroupDocumentWrapper {
  id: string;
  groupId: string;
  documentId: string;
  addedAt: string;
  addedBy?: string;
  document: GroupDocumentItem;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  visibility?: 'PUBLIC' | 'REQUEST_TO_JOIN' | 'PRIVATE';
}
