import { apiClient } from './api-client';
import type {
  ChatMessage,
  StudyGroup,
  GroupMember,
  GroupDocumentWrapper,
  GroupMembershipStatus,
} from '../types/group';

interface ApiGroupPost {
  id: string;
  groupId: string;
  senderId?: string;
  authorId?: string;
  senderName?: string;
  author?: { id?: string; fullName?: string; avatar?: string };
  content: string;
  createdAt?: string;
  timestamp?: string;
}

interface RawApiMember {
  id?: string;
  userId?: string;
  user?: { id?: string; fullName?: string; email?: string; avatar?: string };
  name?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  role?: string;
  status?: string;
  joinedAt?: string;
  createdAt?: string;
}

interface RawApiGroup {
  id: string;
  name: string;
  description?: string;
  topic?: string;
  visibility?: 'PUBLIC' | 'REQUEST_TO_JOIN' | 'PRIVATE';
  ownerId?: string;
  owner?: { id?: string; fullName?: string };
  membersCount?: number;
  _count?: { members?: number };
  members?: RawApiMember[];
  isJoined?: boolean;
  membershipStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

interface RawApiDocumentWrapper {
  id: string;
  groupId?: string;
  studyGroupId?: string;
  documentId?: string;
  addedAt?: string;
  createdAt?: string;
  addedBy?: string;
  document?: {
    id: string;
    title: string;
    author?: string;
    description?: string;
    category?: string | { id?: string; name?: string };
    categoryId?: string;
    fileType?: string;
    coverUrl?: string;
    thumbnail?: string;
    status?: string;
    viewCount?: number;
    downloadCount?: number;
    rating?: number;
    createdAt?: string;
  };
}

export function normalizeGroupMember(raw: RawApiMember, ownerId?: string): GroupMember {
  const memberId = raw.userId || raw.user?.id || raw.id || '';
  const memberName = raw.user?.fullName || raw.fullName || raw.name || 'Chưa cập nhật';
  const memberEmail = raw.user?.email || raw.email;
  const memberAvatar = raw.user?.avatar || raw.avatar;

  let memberRole: 'OWNER' | 'MEMBER' | 'ADMIN' = 'MEMBER';
  if (ownerId && memberId === ownerId) {
    memberRole = 'OWNER';
  } else if (raw.role === 'OWNER') {
    memberRole = 'OWNER';
  } else if (raw.role === 'ADMIN') {
    memberRole = 'ADMIN';
  }

  let memberStatus: GroupMembershipStatus = 'APPROVED';
  if (raw.status === 'PENDING') memberStatus = 'PENDING';
  else if (raw.status === 'REMOVED') memberStatus = 'REMOVED';

  return {
    id: memberId,
    name: memberName,
    email: memberEmail,
    avatar: memberAvatar,
    role: memberRole,
    status: memberStatus,
    joinedAt: raw.joinedAt || raw.createdAt,
  };
}

export function normalizeGroup(raw: RawApiGroup): StudyGroup {
  const ownerId = raw.ownerId || raw.owner?.id;
  const ownerName = raw.owner?.fullName;

  const membersList = Array.isArray(raw.members)
    ? raw.members.map((m) => normalizeGroupMember(m, ownerId))
    : [];

  const membersCount =
    typeof raw.membersCount === 'number'
      ? raw.membersCount
      : typeof raw._count?.members === 'number'
      ? raw._count.members
      : membersList.length;

  let membershipStatus: GroupMembershipStatus = 'NONE';
  if (raw.membershipStatus === 'APPROVED' || (raw.isJoined && !raw.membershipStatus)) {
    membershipStatus = 'APPROVED';
  } else if (raw.membershipStatus === 'PENDING') {
    membershipStatus = 'PENDING';
  } else if (raw.membershipStatus === 'REMOVED') {
    membershipStatus = 'REMOVED';
  }

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || '',
    topic: raw.topic,
    visibility: raw.visibility || 'UNKNOWN',
    ownerId,
    ownerName,
    membersCount: Math.max(0, membersCount),
    members: membersList,
    isJoined: membershipStatus === 'APPROVED' || Boolean(raw.isJoined),
    membershipStatus,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    isActive: raw.isActive ?? true,
  };
}

export const GroupService = {
  /**
   * Lấy danh sách tất cả nhóm học tập
   */
  async getGroups(signal?: AbortSignal): Promise<StudyGroup[]> {
    const response = await apiClient.get<RawApiGroup[] | { items: RawApiGroup[] }>(
      '/study-groups',
      { signal }
    );
    const list = Array.isArray(response) ? response : response?.items || [];
    return list.map(normalizeGroup);
  },

  /**
   * Lấy chi tiết một nhóm học tập theo ID
   */
  async getGroupById(id: string, signal?: AbortSignal): Promise<StudyGroup | null> {
    if (!id) return null;
    try {
      const response = await apiClient.get<RawApiGroup>(`/study-groups/${id}`, { signal });
      if (!response || !response.id) return null;
      return normalizeGroup(response);
    } catch (err: unknown) {
      const status = (err as { status?: number; response?: { status?: number } })?.status ||
        (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        return null;
      }
      // Re-throw other errors (e.g. 403 Forbidden, 500 Internal Error) so UI knows true state
      throw err;
    }
  },

  /**
   * Tạo nhóm học tập mới
   */
  async createGroup(
    name: string,
    description: string,
    visibility: 'PUBLIC' | 'REQUEST_TO_JOIN' | 'PRIVATE' = 'PUBLIC'
  ): Promise<StudyGroup> {
    const response = await apiClient.post<RawApiGroup>('/study-groups', {
      name: name.trim(),
      description: description.trim(),
      visibility,
    });
    return normalizeGroup(response);
  },

  /**
   * Ngừng hoạt động (giải tán) nhóm học tập
   */
  async deleteGroup(id: string): Promise<void> {
    await apiClient.delete(`/study-groups/${id}`);
  },

  /**
   * Tham gia nhóm học tập
   */
  async joinGroup(id: string): Promise<{ status: GroupMembershipStatus; isJoined: boolean }> {
    const response = await apiClient.post<{ status?: string; isJoined?: boolean } | void>(
      `/study-groups/${id}/join`
    );
    const statusStr = response && typeof response === 'object' && 'status' in response
      ? response.status
      : undefined;
    const status: GroupMembershipStatus = statusStr === 'APPROVED'
      ? 'APPROVED'
      : statusStr === 'PENDING'
        ? 'PENDING'
        : 'UNKNOWN';
    return {
      status,
      isJoined: status === 'APPROVED',
    };
  },

  /**
   * Rời khỏi nhóm học tập
   */
  async leaveGroup(id: string): Promise<void> {
    await apiClient.post(`/study-groups/${id}/leave`);
  },

  /**
   * Lấy danh sách tin nhắn/bài viết trao đổi trong nhóm
   */
  async getGroupMessages(groupId: string, signal?: AbortSignal): Promise<ChatMessage[]> {
    const response = await apiClient.get<ApiGroupPost[] | { items: ApiGroupPost[] }>(
      `/study-groups/${groupId}/posts`,
      { signal }
    );
    const posts = Array.isArray(response) ? response : response?.items || [];
    return posts.map((post) => ({
      id: post.id,
      groupId: post.groupId || groupId,
      senderId: post.senderId || post.authorId || post.author?.id || '',
      senderName: post.senderName || post.author?.fullName || 'Chưa cập nhật',
      content: post.content,
      timestamp: post.timestamp || post.createdAt,
      status: 'confirmed',
    }));
  },

  /**
   * Gửi tin nhắn trao đổi trong nhóm
   */
  async sendGroupMessage(groupId: string, content: string): Promise<ChatMessage> {
    const post = await apiClient.post<ApiGroupPost>(`/study-groups/${groupId}/posts`, {
      title: 'Trao đổi nhóm',
      content: content.trim(),
    });

    return {
      id: post.id,
      groupId: post.groupId || groupId,
      senderId: post.senderId || post.authorId || post.author?.id || '',
      senderName: post.senderName || post.author?.fullName || 'Chưa cập nhật',
      content: post.content,
      timestamp: post.timestamp || post.createdAt,
      status: 'confirmed',
    };
  },

  /**
   * Lấy danh sách tài liệu thư viện được chia sẻ vào nhóm
   */
  async getGroupDocuments(groupId: string, signal?: AbortSignal): Promise<GroupDocumentWrapper[]> {
    const response = await apiClient.get<RawApiDocumentWrapper[] | { items: RawApiDocumentWrapper[] }>(
      `/study-groups/${groupId}/documents`,
      { signal }
    );
    const list = Array.isArray(response) ? response : response?.items || [];
    return list
      .filter((item) => item && item.document?.id)
      .map((item) => {
        const catName =
          typeof item.document?.category === 'object'
            ? item.document?.category?.name
            : typeof item.document?.category === 'string'
            ? item.document?.category
            : undefined;

        return {
          id: item.id,
          groupId: item.groupId || item.studyGroupId || groupId,
          documentId: item.documentId || item.document!.id,
          addedAt: item.addedAt || item.createdAt,
          addedBy: item.addedBy,
          document: {
            id: item.document!.id,
            title: item.document?.title,
            author: item.document?.author,
            description: item.document?.description || '',
            category: catName,
            categoryId: item.document?.categoryId,
            fileType: item.document?.fileType,
            coverUrl: item.document?.coverUrl || item.document?.thumbnail,
            thumbnail: item.document?.thumbnail,
            status: item.document?.status,
            viewCount: item.document?.viewCount,
            downloadCount: item.document?.downloadCount,
            rating: item.document?.rating,
            createdAt: item.document?.createdAt,
          },
        };
      });
  },

  /**
   * Chia sẻ tài liệu từ Thư viện số vào nhóm học tập (dành cho Trưởng nhóm)
   */
  async addDocumentToGroup(groupId: string, documentId: string): Promise<void> {
    await apiClient.post<RawApiDocumentWrapper>(`/study-groups/${groupId}/documents`, {
      documentId,
    });
  },

  /**
   * Loại bỏ thành viên khỏi nhóm (dành cho Trưởng nhóm)
   */
  async removeGroupMember(groupId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/study-groups/${groupId}/members/${memberId}`);
  },

  /**
   * Duyệt thành viên vào nhóm
   */
  async approveGroupMember(groupId: string, memberId: string): Promise<void> {
    await apiClient.post(`/study-groups/${groupId}/members/${memberId}/approve`);
  },
};
