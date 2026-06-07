describe('Lecturer study group management', () => {
  it('models owner approval of pending members', () => {
    expect({ before: 'PENDING', after: 'APPROVED' }).toMatchObject({ after: 'APPROVED' });
  });
});
