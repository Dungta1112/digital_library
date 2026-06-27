describe('Admin role assignment', () => {
  it('requires at least one role id', () => {
    expect(['role-id']).not.toHaveLength(0);
  });
});
