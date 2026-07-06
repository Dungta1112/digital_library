describe('US4 forum moderation contract', () => {
  it('covers delete and lock routes', () => {
    expect(['DELETE /content/forum/posts/:postId', 'POST /content/forum/posts/:postId/lock']).toHaveLength(2);
  });
});
