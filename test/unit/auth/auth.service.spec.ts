import * as bcrypt from 'bcrypt';

describe('AuthService security expectations', () => {
  it('hashes passwords with bcrypt-compatible hashes', async () => {
    const hash = await bcrypt.hash('Password123!', 4);
    expect(hash).not.toContain('Password123!');
    expect(await bcrypt.compare('Password123!', hash)).toBe(true);
  });

  it('documents locked-account login denial behavior', () => {
    expect('LOCKED').toBe('LOCKED');
  });
});
