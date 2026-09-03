import { config as appConfig } from './config';

export const API_BASE_URL = appConfig.API_BASE_URL;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  data?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  _retry?: boolean;
}

interface ApiResponseWrapper<T> {
  success?: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/+$/, '');
  }

  private buildUrl(path: string, params?: RequestOptions['params']): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullUrl = path.startsWith('http://') || path.startsWith('https://')
      ? path
      : `${this.baseURL}${cleanPath}`;

    if (!params) return fullUrl;

    const url = new URL(fullUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
    return url.toString();
  }

  private getAuthHeader(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return null;

      const body = (await response.json()) as ApiResponseWrapper<{
        accessToken?: string;
        refreshToken?: string;
      }> & { accessToken?: string; refreshToken?: string };

      const tokenData = body.data || body;
      if (tokenData.accessToken) {
        localStorage.setItem('access_token', tokenData.accessToken);
        if (tokenData.refreshToken) {
          localStorage.setItem('refresh_token', tokenData.refreshToken);
        }
        return tokenData.accessToken;
      }
      return null;
    } catch {
      return null;
    }
  }

  private handleUnauthorizedLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }

  public async request<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    const targetUrl = this.buildUrl(url, options.params);
    const headers: Record<string, string> = {
      ...this.getAuthHeader(),
      ...(options.headers as Record<string, string> || {}),
    };

    let body: BodyInit | null | undefined = undefined;

    if (options.data !== undefined) {
      if (typeof FormData !== 'undefined' && options.data instanceof FormData) {
        body = options.data;
        for (const key of Object.keys(headers)) {
          if (key.toLowerCase() === 'content-type') {
            delete headers[key];
          }
        }
      } else {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        body = typeof options.data === 'string' ? options.data : JSON.stringify(options.data);
      }
    }

    try {
      const res = await fetch(targetUrl, {
        ...options,
        headers,
        body,
      });

      // Handle 401 Unauthorized with token refresh
      if (res.status === 401 && !options._retry) {
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          return this.request<T>(url, {
            ...options,
            _retry: true,
            headers: {
              ...(options.headers as Record<string, string> || {}),
              Authorization: `Bearer ${newToken}`,
            },
          });
        } else {
          this.handleUnauthorizedLogout();
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
      }

      const contentType = res.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      if (!res.ok) {
        let errorMessage = `Yêu cầu thất bại (${res.status} ${res.statusText})`;
        if (isJson) {
          try {
            const errorBody = await res.json();
            errorMessage = errorBody.message || errorBody.error || errorMessage;
          } catch {
            // keep default error
          }
        }
        throw new Error(errorMessage);
      }

      if (isJson) {
        const responseData = (await res.json()) as ApiResponseWrapper<T>;
        if (
          responseData &&
          typeof responseData === 'object' &&
          'success' in responseData
        ) {
          if (responseData.success === false) {
            throw new Error(responseData.message || 'Lỗi API từ máy chủ');
          }
          return (responseData.data !== undefined ? responseData.data : responseData) as T;
        }
        return responseData as T;
      }

      return (await res.text()) as unknown as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }

  public get<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  public post<T = unknown>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'POST', data });
  }

  public put<T = unknown>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PUT', data });
  }

  public patch<T = unknown>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PATCH', data });
  }

  public delete<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
