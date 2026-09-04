import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  GroupService,
  normalizeGroup,
  normalizeGroupMember,
} from '@/services/group.service';
import { apiClient } from '@/services/api-client';

describe('Group Service & Normalization', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('normalizeGroupMember', () => {
    it('should assign role OWNER when member id matches ownerId', () => {
      const raw = {
        userId: 'user-123',
        fullName: 'Nguyễn Văn A',
        role: 'MEMBER',
      };
      const member = normalizeGroupMember(raw, 'user-123');
      expect(member.id).toBe('user-123');
      expect(member.name).toBe('Nguyễn Văn A');
      expect(member.role).toBe('OWNER');
    });

    it('should assign role MEMBER for regular members', () => {
      const raw = {
        userId: 'user-456',
        fullName: 'Trần Văn B',
        role: 'MEMBER',
      };
      const member = normalizeGroupMember(raw, 'user-123');
      expect(member.id).toBe('user-456');
      expect(member.role).toBe('MEMBER');
    });

    it('should parse PENDING status correctly', () => {
      const raw = {
        userId: 'user-789',
        fullName: 'Lê Văn C',
        status: 'PENDING',
      };
      const member = normalizeGroupMember(raw, 'user-123');
      expect(member.status).toBe('PENDING');
    });
  });

  describe('normalizeGroup', () => {
    it('should normalize raw group payload with verified members count and owner', () => {
      const raw = {
        id: 'grp-test-1',
        name: 'Nhóm Giải Tích 1',
        description: 'Ôn tập kỳ thi giữa kỳ',
        ownerId: 'usr-1',
        owner: { id: 'usr-1', fullName: 'Thầy C' },
        members: [
          { userId: 'usr-1', fullName: 'Thầy C' },
          { userId: 'usr-2', fullName: 'Học viên D' },
        ],
        _count: { members: 2 },
      };

      const group = normalizeGroup(raw);
      expect(group.id).toBe('grp-test-1');
      expect(group.name).toBe('Nhóm Giải Tích 1');
      expect(group.membersCount).toBe(2);
      expect(group.members).toHaveLength(2);
      expect(group.members![0].role).toBe('OWNER');
      expect(group.members![1].role).toBe('MEMBER');
      expect(group.visibility).toBe('PUBLIC');
    });

    it('should set membershipStatus correctly based on raw fields', () => {
      const raw = {
        id: 'grp-test-2',
        name: 'Nhóm Lập trình',
        description: '',
        membershipStatus: 'PENDING',
        membersCount: 5,
      };
      const group = normalizeGroup(raw);
      expect(group.membershipStatus).toBe('PENDING');
      expect(group.isJoined).toBe(false);
    });
  });

  describe('GroupService API operations', () => {
    it('should fetch list of study groups', async () => {
      const mockGroups = [
        { id: 'grp-1', name: 'Nhóm 1', description: 'Mô tả 1', membersCount: 3 },
        { id: 'grp-2', name: 'Nhóm 2', description: 'Mô tả 2', membersCount: 5 },
      ];
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockGroups as unknown as never);

      const groups = await GroupService.getGroups();
      expect(Array.isArray(groups)).toBe(true);
      expect(groups).toHaveLength(2);
      expect(groups[0].name).toBe('Nhóm 1');
    });

    it('should fetch group detail by id', async () => {
      const mockDetail = {
        id: 'grp-ai-lab',
        name: 'AI Lab',
        description: 'Phòng thí nghiệm AI',
        membersCount: 10,
      };
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockDetail as unknown as never);

      const group = await GroupService.getGroupById('grp-ai-lab');
      expect(group).not.toBeNull();
      expect(group?.id).toBe('grp-ai-lab');
      expect(group?.name).toBe('AI Lab');
    });

    it('should return null for non-existent group (404)', async () => {
      vi.spyOn(apiClient, 'get').mockRejectedValueOnce({ status: 404 });

      const group = await GroupService.getGroupById('grp-non-existent-999');
      expect(group).toBeNull();
    });

    it('should fetch group messages and map them properly', async () => {
      const mockPosts = [
        {
          id: 'post-1',
          groupId: 'grp-ai-lab',
          authorId: 'usr-1',
          author: { id: 'usr-1', fullName: 'Thầy C' },
          content: 'Chào mừng các bạn!',
          createdAt: '2026-03-01T08:00:00.000Z',
        },
      ];
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockPosts as unknown as never);

      const messages = await GroupService.getGroupMessages('grp-ai-lab');
      expect(Array.isArray(messages)).toBe(true);
      expect(messages).toHaveLength(1);
      expect(messages[0].content).toBe('Chào mừng các bạn!');
      expect(messages[0].senderName).toBe('Thầy C');
      expect(messages[0].status).toBe('confirmed');
    });

    it('should send a new group message', async () => {
      const mockCreatedPost = {
        id: 'post-new-1',
        groupId: 'grp-ai-lab',
        senderId: 'usr-current',
        senderName: 'Bạn',
        content: 'Xin chào các bạn trong nhóm!',
        createdAt: '2026-03-01T09:00:00.000Z',
      };
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce(mockCreatedPost as unknown as never);

      const newMsg = await GroupService.sendGroupMessage(
        'grp-ai-lab',
        'Xin chào các bạn trong nhóm!'
      );
      expect(newMsg).toHaveProperty('id');
      expect(newMsg.content).toBe('Xin chào các bạn trong nhóm!');
      expect(newMsg.groupId).toBe('grp-ai-lab');
    });

    it('should fetch group documents', async () => {
      const mockDocs = [
        {
          id: 'wrap-1',
          groupId: 'grp-ai-lab',
          documentId: 'doc-1',
          addedAt: '2026-03-01T10:00:00.000Z',
          document: {
            id: 'doc-1',
            title: 'Tài liệu học sâu',
            author: 'TS. Nguyễn Văn A',
            category: 'Khoa học máy tính',
            fileType: 'PDF',
          },
        },
      ];
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockDocs as unknown as never);

      const docs = await GroupService.getGroupDocuments('grp-ai-lab');
      expect(Array.isArray(docs)).toBe(true);
      expect(docs).toHaveLength(1);
      expect(docs[0].document.title).toBe('Tài liệu học sâu');
    });

    it('should add a library document to group', async () => {
      const mockAdded = {
        id: 'wrap-new-2',
        groupId: 'grp-ai-lab',
        documentId: 'doc-ds-2026-002',
        addedAt: '2026-03-01T11:00:00.000Z',
        document: {
          id: 'doc-ds-2026-002',
          title: 'Giáo trình Cấu trúc dữ liệu',
        },
      };
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce(mockAdded as unknown as never);

      const added = await GroupService.addDocumentToGroup(
        'grp-ai-lab',
        'doc-ds-2026-002'
      );
      expect(added).toHaveProperty('id');
      expect(added.documentId).toBe('doc-ds-2026-002');
    });

    it('should throw real error on 403 / 500 when fetching detail instead of swallowing', async () => {
      vi.spyOn(apiClient, 'get').mockRejectedValueOnce({
        status: 403,
        message: 'Forbidden',
      });

      await expect(GroupService.getGroupById('grp-private-1')).rejects.toEqual({
        status: 403,
        message: 'Forbidden',
      });
    });
  });
});
