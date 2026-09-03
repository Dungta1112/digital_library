import { describe, it, expect, vi } from 'vitest';
import { LibraryService } from '../services/library.service';
import { apiClient } from '../services/api-client';

describe('LibraryService Favorites & SaveCount Contract', () => {
  it('getDocuments() should normalize saveCount directly from _count.favorites and not downloadCount', async () => {
    const mockApiResponse = {
      items: [
        {
          id: 'doc-1',
          title: 'Giáo trình Giải tích 1',
          author: 'TS. Nguyễn Văn A',
          downloadCount: 150,
          viewCount: 300,
          _count: {
            favorites: 12,
          },
          files: [{ fileType: 'pdf', fileSize: 1024 * 1024 * 2 }],
        },
        {
          id: 'doc-2',
          title: 'Tài liệu không có lượt lưu',
          author: 'TS. Trần B',
          downloadCount: 99,
          viewCount: 200,
          _count: {
            favorites: 0,
          },
          files: [{ fileType: 'docx', fileSize: 1024 * 500 }],
        },
      ],
      total: 2,
      page: 1,
      limit: 8,
      totalPages: 1,
    };

    vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockApiResponse as unknown as never);

    const result = await LibraryService.getDocuments({}, 1, 8);

    expect(result.data[0].saveCount).toBe(12);
    expect(result.data[0].downloadCount).toBe(150);
    // Real 0 must display 0 and NOT fall back to downloadCount
    expect(result.data[1].saveCount).toBe(0);
    expect(result.data[1].downloadCount).toBe(99);
  });

  it('getFavoriteDocuments() should call GET /documents/me/favorites and normalize list', async () => {
    const mockFavoritesResponse = {
      items: [
        {
          id: 'fav-1',
          title: 'Tài liệu đã lưu',
          author: 'Giảng viên C',
          viewCount: 10,
          _count: { favorites: 5 },
          files: [{ fileType: 'pdf', fileSize: 1024 * 1024 }],
        },
      ],
    };

    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce(mockFavoritesResponse as unknown as never);

    const favs = await LibraryService.getFavoriteDocuments();

    expect(getSpy).toHaveBeenCalledWith('/documents/me/favorites');
    expect(favs).toHaveLength(1);
    expect(favs[0].id).toBe('fav-1');
    expect(favs[0].saveCount).toBe(5);
  });

  it('favoriteDocument and unfavoriteDocument should call correct endpoints', async () => {
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({} as unknown as never);
    const deleteSpy = vi.spyOn(apiClient, 'delete').mockResolvedValueOnce({} as unknown as never);

    await LibraryService.favoriteDocument('doc-99');
    expect(postSpy).toHaveBeenCalledWith('/documents/doc-99/favorite');

    await LibraryService.unfavoriteDocument('doc-99');
    expect(deleteSpy).toHaveBeenCalledWith('/documents/doc-99/favorite');
  });
});
