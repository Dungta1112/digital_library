import { apiClient } from './api.client';
import type { StudyGroup } from '../types/group';

export const GroupService = {
  async getGroups(): Promise<StudyGroup[]> {
    const res = await apiClient.get<any, any>('/study-groups');
    return Array.isArray(res) ? res : (res as any).items || [];
  },

  async getGroupById(id: string): Promise<StudyGroup | null> {
    try {
      // Since backend doesn't explicitly have a GET /study-groups/:id in Swagger, 
      // we'll fetch all and filter for now as a fallback, 
      // or assume /study-groups/:id exists but was omitted from swagger.
      // Let's try the direct route first, fallback to list if it fails.
      const res = await apiClient.get<any, StudyGroup>(`/study-groups/${id}`);
      return res;
    } catch (e) {
      console.warn("Direct fetch failed, falling back to list filter", e);
      const groups = await this.getGroups();
      return groups.find(g => g.id === id) || null;
    }
  },

  async joinGroup(id: string): Promise<void> {
    await apiClient.post(`/study-groups/${id}/join`);
  },

  async getGroupMessages(groupId: string): Promise<any[]> {
    const res = await apiClient.get<any, any>(`/study-groups/${groupId}/posts`);
    return Array.isArray(res) ? res : (res as any).items || [];
  },

  async sendGroupMessage(groupId: string, content: string): Promise<any> {
    const res = await apiClient.post<any, any>(`/study-groups/${groupId}/posts`, { 
      title: 'Group Message', // Requires title according to DTO maybe?
      content 
    });
    return res;
  }
};
