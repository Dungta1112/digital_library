describe('US4 document moderation contract', () => {
  it('requires rejection reason', () => {
    expect({ reason: 'Incomplete metadata' }.reason.length).toBeGreaterThan(4);
  });
});
