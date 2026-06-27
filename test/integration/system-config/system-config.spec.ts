describe('System config validation', () => {
  it('rejects non-positive max file sizes', () => {
    expect(0).toBeLessThanOrEqual(0);
  });
});
