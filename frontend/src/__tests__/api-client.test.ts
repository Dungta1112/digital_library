import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/services/api-client';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    statusText: status >= 400 ? 'Error' : 'OK',
    headers: { 'content-type': 'application/json' },
  });
}

describe('apiClient', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/login');
  });

  it('unwraps a successful API envelope', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({ success: true, data: { id: 'doc-1' } }));

    await expect(apiClient.get<{ id: string }>('/documents/doc-1')).resolves.toEqual({ id: 'doc-1' });
  });

  it('preserves HTTP status and backend message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({ message: 'Không có quyền' }, 403));

    const request = apiClient.get('/admin/users');
    await expect(request).rejects.toMatchObject({
      name: 'ApiError',
      status: 403,
      message: 'Không có quyền',
    });
  });

  it('does not set a multipart Content-Type for FormData', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 204 }));
    const formData = new FormData();
    formData.append('file', new File(['pdf'], 'document.pdf', { type: 'application/pdf' }));

    await apiClient.post('/lecturer/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')).toBe(false);
    expect(init.body).toBe(formData);
  });

  it('refreshes a 401 request and retries with the new token', async () => {
    localStorage.setItem('access_token', 'expired-token');
    localStorage.setItem('refresh_token', 'refresh-token');
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ message: 'Unauthorized' }, 401))
      .mockResolvedValueOnce(jsonResponse({ data: { accessToken: 'new-token', refreshToken: 'new-refresh' } }))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: { id: 'me' } }));

    await expect(apiClient.get('/users/me')).resolves.toEqual({ id: 'me' });
    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(localStorage.getItem('access_token')).toBe('new-token');
    expect(localStorage.getItem('refresh_token')).toBe('new-refresh');
    const retryHeaders = (fetchSpy.mock.calls[2][1] as RequestInit).headers as Record<string, string>;
    expect(retryHeaders.Authorization).toBe('Bearer new-token');
  });

  it('keeps the session when refresh fails because of a network error', async () => {
    localStorage.setItem('access_token', 'expired-token');
    localStorage.setItem('refresh_token', 'refresh-token');
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ message: 'Unauthorized' }, 401))
      .mockRejectedValueOnce(new TypeError('Network down'));

    await expect(apiClient.get('/users/me')).rejects.toMatchObject({ status: 0, code: 'NETWORK_ERROR' });
    expect(localStorage.getItem('access_token')).toBe('expired-token');
    expect(localStorage.getItem('refresh_token')).toBe('refresh-token');
  });

  it('clears the session when the refresh token is rejected', async () => {
    localStorage.setItem('access_token', 'expired-token');
    localStorage.setItem('refresh_token', 'refresh-token');
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ message: 'Unauthorized' }, 401))
      .mockResolvedValueOnce(jsonResponse({ message: 'Refresh token hết hạn' }, 401));

    await expect(apiClient.get('/users/me')).rejects.toMatchObject({ status: 401, code: 'SESSION_EXPIRED' });
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });
});
