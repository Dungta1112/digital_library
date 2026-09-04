import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileService } from '../services/profile.service';
import { apiClient } from '../services/api-client';
import { AVATAR_PRESETS, getFullAvatarUrl } from '../data/avatar-catalog';

describe('ProfileService & Avatar Catalog', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Avatar Catalog', () => {
    it('should provide 16 preset avatars across 4 themes', () => {
      expect(AVATAR_PRESETS).toHaveLength(16);

      const emeraldPresets = AVATAR_PRESETS.filter((p) => p.theme === 'emerald');
      const navyPresets = AVATAR_PRESETS.filter((p) => p.theme === 'navy');
      const amberPresets = AVATAR_PRESETS.filter((p) => p.theme === 'amber');
      const violetPresets = AVATAR_PRESETS.filter((p) => p.theme === 'violet');

      expect(emeraldPresets).toHaveLength(4);
      expect(navyPresets).toHaveLength(4);
      expect(amberPresets).toHaveLength(4);
      expect(violetPresets).toHaveLength(4);
    });

    it('getFullAvatarUrl should preserve absolute URLs and resolve relative paths', () => {
      expect(getFullAvatarUrl('https://example.com/avatar.png')).toBe('https://example.com/avatar.png');
      expect(getFullAvatarUrl('http://localhost:3000/avatars/academic-book.svg')).toBe('http://localhost:3000/avatars/academic-book.svg');
      expect(getFullAvatarUrl('')).toBe('');
    });
  });

  describe('updateProfile', () => {
    it('should send PATCH /users/me and normalize returned user', async () => {
      const mockApiResponse = {
        id: 'user-123',
        email: 'lecturer@tvu.edu.vn',
        fullName: 'TS. Nguyễn Văn A',
        avatarUrl: 'https://example.com/avatars/academic-book.svg',
        roles: [{ code: 'LECTURER' }],
      };

      const patchSpy = vi.spyOn(apiClient, 'patch').mockResolvedValueOnce(mockApiResponse as unknown as never);

      const result = await ProfileService.updateProfile({
        fullName: 'TS. Nguyễn Văn A',
        avatarUrl: 'https://example.com/avatars/academic-book.svg',
      });

      expect(patchSpy).toHaveBeenCalledWith('/users/me', {
        fullName: 'TS. Nguyễn Văn A',
        avatarUrl: 'https://example.com/avatars/academic-book.svg',
      });
      expect(result.id).toBe('user-123');
      expect(result.fullName).toBe('TS. Nguyễn Văn A');
      expect(result.role).toBe('LECTURER');
      expect(result.avatarUrl).toBe('https://example.com/avatars/academic-book.svg');
    });
  });

  describe('getReadingHistory', () => {
    it('should send GET /documents/me/history and return list of history records with document details', async () => {
      const mockHistory = [
        {
          id: 'hist-1',
          userId: 'user-123',
          documentId: 'doc-456',
          createdAt: '2026-09-04T10:00:00Z',
          document: {
            id: 'doc-456',
            title: 'Giáo trình Cơ sở dữ liệu',
            description: 'Tài liệu học phần DB2026',
            viewCount: 15,
            downloadCount: 3,
          },
        },
      ];

      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockHistory as unknown as never);

      const result = await ProfileService.getReadingHistory();

      expect(getSpy).toHaveBeenCalledWith('/documents/me/history', { signal: undefined });
      expect(result).toHaveLength(1);
      expect(result[0].document?.id).toBe('doc-456');
      expect(result[0].document?.title).toBe('Giáo trình Cơ sở dữ liệu');
    });

    it('should return empty array if response is empty', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce([] as unknown as never);

      const result = await ProfileService.getReadingHistory();
      expect(result).toEqual([]);
    });
  });

  describe('getLecturerDocuments', () => {
    it('should send GET /lecturer/documents and return contributed documents', async () => {
      const mockDocs = [
        {
          id: 'doc-1',
          title: 'Bài giảng Trí tuệ Nhân tạo',
          status: 'APPROVED' as const,
          viewCount: 120,
          downloadCount: 45,
          createdAt: '2026-09-01T08:00:00Z',
          category: { id: 'cat-1', name: 'Công nghệ thông tin' },
        },
      ];

      vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockDocs as unknown as never);

      const result = await ProfileService.getLecturerDocuments();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Bài giảng Trí tuệ Nhân tạo');
      expect(result[0].status).toBe('APPROVED');
    });
  });

  describe('deleteLecturerDocument and hideLecturerDocument', () => {
    it('deleteLecturerDocument should send DELETE /lecturer/documents/:id', async () => {
      const deleteSpy = vi.spyOn(apiClient, 'delete').mockResolvedValueOnce({} as unknown as never);

      await ProfileService.deleteLecturerDocument('doc-999');

      expect(deleteSpy).toHaveBeenCalledWith('/lecturer/documents/doc-999');
    });

    it('hideLecturerDocument should send POST /lecturer/documents/:id/hide', async () => {
      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({} as unknown as never);

      await ProfileService.hideLecturerDocument('doc-999');

      expect(postSpy).toHaveBeenCalledWith('/lecturer/documents/doc-999/hide');
    });
  });
});
