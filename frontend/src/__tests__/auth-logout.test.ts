import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../services/auth.service';
import { apiClient } from '../services/api-client';

describe('AuthService Logout & Token Management', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', 'test_access_token');
    localStorage.setItem('refresh_token', 'test_refresh_token');
  });

  it('logout() should invoke POST /auth/logout to revoke server session', async () => {
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({} as unknown as never);

    await AuthService.logout();

    expect(postSpy).toHaveBeenCalledWith('/auth/logout');
  });

  it('logout() should not throw when backend returns error', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValueOnce(new Error('Network error'));

    await expect(AuthService.logout()).resolves.toBeUndefined();
  });
});
