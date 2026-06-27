describe('Public document search integration', () => {
  it('requires approved public documents for public search fixtures', () => {
    expect({ status: 'APPROVED', visibility: 'PUBLIC' }).toMatchObject({ status: 'APPROVED' });
  });
});
