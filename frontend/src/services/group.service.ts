import { apiClient } from './api.client';
import { runWithMock } from './config';
import type { ChatMessage, StudyGroup } from '../types/group';

let mockGroups: StudyGroup[] | null = null;
let mockMessages: ChatMessage[] | null = null;

async function getMockGroups() {
  if (!mockGroups) {
    const mockModule = await import('../mocks/group.json');
    mockGroups = structuredClone(mockModule.default) as StudyGroup[];
  }
  return mockGroups;
}

async function getMockMessages() {
  if (!mockMessages) {
    const mockModule = await import('../mocks/group-messages.json');
    mockMessages = structuredClone(mockModule.default) as ChatMessage[];
  }
  return mockMessages;
}

export const GroupService = {
  async getGroups(): Promise<StudyGroup[]> {
    return runWithMock(
      async () => [...(await getMockGroups())],
      async () => {
        const response = await apiClient.get<
          unknown,
          StudyGroup[] | { items: StudyGroup[] }
        >('/study-groups');
        return Array.isArray(response) ? response : response.items || [];
      }
    );
  },

  async getGroupById(id: string): Promise<StudyGroup | null> {
    return runWithMock(
      async () => {
        const groups = await getMockGroups();
        return groups.find((group) => group.id === id) || null;
      },
      async () => {
        try {
          return await apiClient.get<unknown, StudyGroup>(`/study-groups/${id}`);
        } catch (error) {
          // Backend hiện tại có thể chưa khai báo route chi tiết nhóm.
          // Khi đó lấy danh sách rồi tìm theo id để giao diện vẫn hoạt động.
          console.warn('Không lấy được chi tiết nhóm, chuyển sang tìm trong danh sách.', error);
          const groups = await this.getGroups();
          return groups.find((group) => group.id === id) || null;
        }
      }
    );
  },

  async joinGroup(id: string): Promise<void> {
    return runWithMock(
      async () => {
        const groups = await getMockGroups();
        const group = groups.find((item) => item.id === id);
        if (group && !group.isJoined) {
          group.isJoined = true;
          group.membersCount += 1;
        }
      },
      async () => {
        await apiClient.post(`/study-groups/${id}/join`);
      }
    );
  },

  async getGroupMessages(groupId: string): Promise<ChatMessage[]> {
    return runWithMock(
      async () => {
        const messages = await getMockMessages();
        return messages.filter((message) => message.groupId === groupId);
      },
      async () => {
        const response = await apiClient.get<
          unknown,
          ChatMessage[] | { items: ChatMessage[] }
        >(`/study-groups/${groupId}/posts`);
        return Array.isArray(response) ? response : response.items || [];
      }
    );
  },

  async sendGroupMessage(groupId: string, content: string): Promise<ChatMessage> {
    return runWithMock(
      async () => {
        const messages = await getMockMessages();
        const message: ChatMessage = {
          id: `message-${Date.now()}`,
          groupId,
          senderId: 'demo-user',
          senderName: 'Tài khoản Demo',
          content,
          timestamp: new Date().toISOString(),
        };
        messages.push(message);
        return message;
      },
      () =>
        apiClient.post<unknown, ChatMessage>(`/study-groups/${groupId}/posts`, {
          title: 'Group Message',
          content,
        })
    );
  },
};
