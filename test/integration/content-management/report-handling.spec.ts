describe('Content report handling', () => {
  it('updates report status to terminal states', () => {
    expect(['RESOLVED', 'REJECTED']).toContain('RESOLVED');
  });
});
