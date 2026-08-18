import { apiClient } from './api-client';
import type { ChatMessage, StudyGroup } from '../types/group';

interface ApiGroupPost {
  id: string;
  groupId: string;
  senderId?: string;
  authorId?: string;
  senderName?: string;
  author?: { fullName?: string };
  content: string;
  createdAt?: string;
  timestamp?: string;
}

export const GroupService = {
  async getGroups(): Promise<StudyGroup[]> {
    try {
      const response = await apiClient.get<StudyGroup[] | { items: StudyGroup[] }>('/study-groups');
      if (Array.isArray(response)) return response;
      if (response && 'items' in response && Array.isArray(response.items)) return response.items;
      return [];
    } catch (e) {
      console.error('Lỗi khi tải danh sách nhóm:', e);
      return [];
    }
  },

  async getGroupById(id: string): Promise<StudyGroup | null> {
    try {
      return await apiClient.get<StudyGroup>(`/study-groups/${id}`);
    } catch (error) {
      console.warn('Lỗi lấy chi tiết nhóm, thử tìm lại trong danh sách:', error);
      const groups = await this.getGroups();
      return groups.find((group) => group.id === id) || null;
    }
  },

  async createGroup(
    name: string,
    description: string,
    visibility: 'PUBLIC' | 'REQUEST_TO_JOIN' | 'PRIVATE' = 'PUBLIC'
  ): Promise<StudyGroup> {
    return apiClient.post<StudyGroup>('/study-groups', {
      name: name.trim(),
      description: description.trim(),
      visibility,
    });
  },

  async deleteGroup(id: string): Promise<void> {
    await apiClient.delete(`/study-groups/${id}`);
  },

  async joinGroup(id: string): Promise<void> {
    await apiClient.post(`/study-groups/${id}/join`);
  },

  async leaveGroup(id: string): Promise<void> {
    await apiClient.post(`/study-groups/${id}/leave`);
  },

  async getGroupMessages(groupId: string): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get<ApiGroupPost[] | { items: ApiGroupPost[] }>(
        `/study-groups/${groupId}/posts`
      );
      const posts = Array.isArray(response) ? response : response?.items || [];
      return posts.map((post) => ({
        id: post.id,
        groupId: post.groupId || groupId,
        senderId: post.senderId || post.authorId || '',
        senderName: post.senderName || post.author?.fullName || 'Người dùng',
        content: post.content,
        timestamp: post.timestamp || post.createdAt || new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Lỗi khi tải tin nhắn nhóm:', e);
      return [];
    }
  },

  async sendGroupMessage(groupId: string, content: string): Promise<ChatMessage> {
    const post = await apiClient.post<ApiGroupPost>(`/study-groups/${groupId}/posts`, {
      title: 'Tin nhắn nhóm',
      content: content.trim(),
    });

    return {
      id: post.id,
      groupId: post.groupId || groupId,
      senderId: post.senderId || post.authorId || '',
      senderName: post.senderName || post.author?.fullName || 'Bạn',
      content: post.content,
      timestamp: post.timestamp || post.createdAt || new Date().toISOString(),
    };
  },
};