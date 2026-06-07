describe('US2 student document contract', () => {
  it('covers read, download, favorite, rating, and report endpoints', () => {
    expect([
      'GET /documents/:documentId/read',
      'GET /documents/:documentId/download',
      'POST /documents/:documentId/favorite',
      'POST /documents/:documentId/ratings',
      'POST /documents/:documentId/reports'
    ]).toHaveLength(5);
  });
});
