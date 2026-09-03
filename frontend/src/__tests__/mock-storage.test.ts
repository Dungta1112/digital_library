import { describe, it, expect, beforeEach } from 'vitest';
import { MockStorage } from '../mocks/storage';

describe('MockStorage Persistence and Operations', () => {
  beforeEach(() => {
    MockStorage.resetStorage();
  });

  it('should return default users and support role overrides for all 4 roles', () => {
    const student = MockStorage.getCurrentUser('STUDENT');
    expect(student.role).toBe('STUDENT');
    expect(student.email).toContain('student');

    const lecturer = MockStorage.getCurrentUser('LECTURER');
    expect(lecturer.role).toBe('LECTURER');

    const moderator = MockStorage.getCurrentUser('CONTENT_MANAGER');
    expect(moderator.role).toBe('CONTENT_MANAGER');

    const admin = MockStorage.getCurrentUser('ADMIN');
    expect(admin.role).toBe('ADMIN');
  });

  it('should return initial categories and filter documents properly', () => {
    const categories = MockStorage.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.some((c) => c.slug === 'cong-nghe-thong-tin')).toBe(true);

    const allApprovedDocs = MockStorage.getDocuments();
    expect(allApprovedDocs.every((d) => d.status === 'APPROVED')).toBe(true);

    const pendingDocs = MockStorage.getPendingDocuments();
    expect(pendingDocs.every((d) => d.status === 'PENDING')).toBe(true);
  });

  it('should add, approve, reject and delete documents with persistence', () => {
    const newDoc = MockStorage.addDocument({
      title: 'Tài liệu thử nghiệm MSW',
      description: 'Mô tả thử nghiệm',
      categoryId: 'cat-cntt',
    });

    expect(newDoc.id).toBeDefined();
    expect(newDoc.status).toBe('PENDING');

    const pending = MockStorage.getPendingDocuments();
    expect(pending.some((d) => d.id === newDoc.id)).toBe(true);

    // Approve
    const approved = MockStorage.approveDocument(newDoc.id);
    expect(approved?.status).toBe('APPROVED');

    // Reject
    const rejected = MockStorage.rejectDocument(newDoc.id);
    expect(rejected?.status).toBe('REJECTED');

    // Delete
    MockStorage.deleteDocument(newDoc.id);
    expect(MockStorage.getDocumentById(newDoc.id)).toBeNull();
  });

  it('should manage favorites and update saveCount correctly', () => {
    const docId = 'doc-ai-2026-001';
    const initialDoc = MockStorage.getDocumentById(docId)!;
    const initialSaveCount = initialDoc.saveCount;

    MockStorage.removeFavorite(docId);
    expect(MockStorage.isFavorite(docId)).toBe(false);

    MockStorage.addFavorite(docId);
    expect(MockStorage.isFavorite(docId)).toBe(true);
    expect(MockStorage.getFavorites()).toContain(docId);

    const updatedDoc = MockStorage.getDocumentById(docId)!;
    expect(updatedDoc.saveCount).toBeGreaterThanOrEqual(initialSaveCount);
  });

  it('should create forum posts, add comments and moderate posts', () => {
    const post = MockStorage.createForumPost({
      title: 'Thảo luận Mock API',
      content: 'Nội dung bài viết mock',
      category: 'STUDY',
    });

    expect(post.id).toBeDefined();
    expect(MockStorage.getForumPostById(post.id)).not.toBeNull();

    const comment = MockStorage.addComment(post.id, 'Bình luận thử nghiệm');
    expect(comment).not.toBeNull();

    const updatedPost = MockStorage.getForumPostById(post.id);
    expect(updatedPost?.comments?.length).toBe(1);
    expect(updatedPost?.commentsCount).toBe(1);

    // Moderate
    MockStorage.moderatePost(post.id, 'DELETE');
    expect(MockStorage.getForumPostById(post.id)).toBeNull();
  });

  it('should update user role and toggle user status', () => {
    const users = MockStorage.getUsers();
    const targetUser = users[0];

    const updatedUser = MockStorage.toggleUserStatus(targetUser.id, 'LOCKED');
    expect(updatedUser?.status).toBe('LOCKED');

    const roleUpdated = MockStorage.updateUserRole(targetUser.id, 'role-lecturer-id');
    expect(roleUpdated?.role).toBe('LECTURER');
  });

  it('should get and update system configs and reports', () => {
    const configs = MockStorage.getConfigs();
    expect(configs.length).toBeGreaterThan(0);

    MockStorage.updateConfig('MAX_UPLOAD_SIZE_MB', '100');
    const updatedConfigs = MockStorage.getConfigs();
    const param = updatedConfigs.find((c) => c.key === 'MAX_UPLOAD_SIZE_MB');
    expect(param?.value).toBe('100');

    const reports = MockStorage.getReports();
    if (reports.length > 0) {
      MockStorage.resolveReport(reports[0].id, 'RESOLVED');
      const updatedReports = MockStorage.getReports();
      expect(updatedReports.find((r) => r.id === reports[0].id)?.status).toBe('RESOLVED');
    }
  });
});
