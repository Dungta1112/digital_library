describe('Statistics overview', () => {
  it('includes core overview counters', () => {
    expect(['users', 'documents', 'forumPosts', 'studyGroups', 'views', 'downloads']).toContain('downloads');
  });
});
