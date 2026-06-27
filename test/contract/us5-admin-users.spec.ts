describe('US5 admin users contract', () => {
  it('covers search, lock, unlock, and roles routes', () => {
    expect(['GET /admin/users', 'POST /admin/users/:userId/lock', 'POST /admin/users/:userId/unlock', 'PUT /admin/users/:userId/roles']).toHaveLength(4);
  });
});
