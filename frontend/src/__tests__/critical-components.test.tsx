import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GroupCard } from '@/components/feature/Group/GroupCard';
import { ReadingHistory } from '@/components/feature/Profile/ReadingHistory';
import { ForumService } from '@/services/forum.service';
import { useForumStore } from '@/hooks/useForumStore';
import type { ForumPost } from '@/types/forum';

const post: ForumPost = {
  id: 'post-1',
  title: 'Chủ đề thật',
  content: 'Nội dung',
  authorId: 'user-1',
  authorName: 'Người dùng',
  authorRole: 'STUDENT',
  category: 'GENERAL',
  tags: [],
  likes: 0,
  commentsCount: 0,
  comments: [],
};

describe('critical frontend flows', () => {
  beforeEach(() => {
    useForumStore.setState({ posts: [post], error: null, loading: false });
  });

  it('marks only the exact owner as group owner', () => {
    const group = {
      id: 'group-1',
      name: 'Nhóm học tập',
      description: '',
      visibility: 'UNKNOWN' as const,
      ownerId: 'owner-1',
      membersCount: 2,
      isJoined: true,
    };
    const { rerender } = render(<GroupCard group={group} currentUserId="member-2" />);
    expect(screen.queryByText('Trưởng nhóm')).not.toBeInTheDocument();
    rerender(<GroupCard group={group} currentUserId="owner-1" />);
    expect(screen.getByText('Trưởng nhóm')).toBeInTheDocument();
  });

  it('uses the real profile detail and reader routes', () => {
    render(
      <ReadingHistory
        history={[{
          id: 'history-1',
          userId: 'user-1',
          documentId: 'doc-42',
          createdAt: '2026-09-05T00:00:00Z',
          document: { id: 'doc-42', title: 'Giáo trình' },
        }]}
        loading={false}
        error={null}
        onRetry={() => undefined}
      />
    );
    expect(screen.getByRole('link', { name: 'Giáo trình' })).toHaveAttribute('href', '/library/document/doc-42');
    expect(screen.getByRole('link', { name: /Đọc tài liệu/ })).toHaveAttribute('href', '/library/read/doc-42');
  });

  it('removes a post only after DELETE succeeds', async () => {
    vi.spyOn(ForumService, 'deletePost').mockResolvedValueOnce();
    await expect(useForumStore.getState().deletePost('post-1')).resolves.toBe(true);
    expect(useForumStore.getState().posts).toHaveLength(0);
  });

  it('keeps a post when DELETE fails', async () => {
    vi.spyOn(ForumService, 'deletePost').mockRejectedValueOnce(new Error('Không thể xóa'));
    await expect(useForumStore.getState().deletePost('post-1')).resolves.toBe(false);
    expect(useForumStore.getState().posts).toEqual([post]);
    expect(useForumStore.getState().error).toBe('Không thể xóa');
  });
});
