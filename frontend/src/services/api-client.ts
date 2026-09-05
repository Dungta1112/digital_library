import { config as appConfig } from './config';

export const API_BASE_URL = appConfig.API_BASE_URL;

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  data?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  _retry?: boolean;
}

interface ApiResponseWrapper<T> {
  success?: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  code?: string;
  error?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    options: { status: number; code?: string; details?: unknown; cause?: unknown }
  ) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

export function getErrorStatus(error: unknown): number | undefined {
  return error instanceof ApiError ? error.status : undefined;
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback;
  const value = body as { message?: unknown; error?: unknown };
  if (Array.isArray(value.message)) return value.message.map(String).join(', ');
  if (typeof value.message === 'string' && value.message.trim()) return value.message;
  if (typeof value.error === 'string' && value.error.trim()) return value.error;
  return fallback;
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

  private async refreshAccessToken(): Promise<string> {
    if (typeof window === 'undefined') {
      throw new ApiError('Không thể làm mới phiên đăng nhập.', {
        status: 401,
        code: 'SESSION_EXPIRED',
      });
    }
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new ApiError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
        status: 401,
        code: 'SESSION_EXPIRED',
      });
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = undefined;
        }
        throw new ApiError(
          getErrorMessage(errorBody, `Không thể làm mới phiên đăng nhập (${response.status}).`),
          {
            status: response.status,
            code:
              errorBody && typeof errorBody === 'object' && 'code' in errorBody
                ? String(errorBody.code)
                : 'REFRESH_FAILED',
            details: errorBody,
          }
        );
      }

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
      throw new ApiError('Máy chủ không trả về access token mới.', {
        status: 502,
        code: 'INVALID_REFRESH_RESPONSE',
        details: body,
      });
    } catch (error) {
      if (error instanceof ApiError || isAbortError(error)) throw error;
      throw new ApiError('Không thể kết nối đến máy chủ để làm mới phiên đăng nhập.', {
        status: 0,
        code: 'NETWORK_ERROR',
        cause: error,
      });
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
      const {
        data: _data,
        params: _params,
        _retry: retrying,
        headers: _requestHeaders,
        ...fetchOptions
      } = options;
      void _data;
      void _params;
      void _requestHeaders;
      const res = await fetch(targetUrl, {
        ...fetchOptions,
        headers,
        body,
      });

      // Handle 401 Unauthorized with token refresh
      if (res.status === 401 && !retrying) {
        try {
          const newToken = await this.refreshAccessToken();
          return this.request<T>(url, {
            ...options,
            _retry: true,
            headers: {
              ...(options.headers as Record<string, string> || {}),
              Authorization: `Bearer ${newToken}`,
            },
          });
        } catch (refreshError) {
          const refreshStatus = getErrorStatus(refreshError);
          if (refreshStatus === 400 || refreshStatus === 401 || refreshStatus === 403) {
            this.handleUnauthorizedLogout();
            throw new ApiError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
              status: 401,
              code: 'SESSION_EXPIRED',
              cause: refreshError,
            });
          }
          throw refreshError;
        }
      }

      if (res.status === 401 && retrying) {
        this.handleUnauthorizedLogout();
      }

      const contentType = res.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      if (!res.ok) {
        let errorMessage = `Yêu cầu thất bại (${res.status} ${res.statusText})`;
        let errorBody: unknown;
        if (isJson) {
          try {
            errorBody = await res.json();
            errorMessage = getErrorMessage(errorBody, errorMessage);
          } catch {
            // keep default error
          }
        }
        throw new ApiError(errorMessage, {
          status: res.status,
          code:
            errorBody && typeof errorBody === 'object' && 'code' in errorBody
              ? String(errorBody.code)
              : undefined,
          details: errorBody,
        });
      }

      if (res.status === 204) return undefined as T;

      if (isJson) {
        const responseData = (await res.json()) as ApiResponseWrapper<T>;
        if (
          responseData &&
          typeof responseData === 'object' &&
          'success' in responseData
        ) {
          if (responseData.success === false) {
            throw new ApiError(responseData.message || 'Lỗi API từ máy chủ', {
              status: responseData.statusCode || res.status,
              code: responseData.code,
              details: responseData,
            });
          }
          return (responseData.data !== undefined ? responseData.data : responseData) as T;
        }
        return responseData as T;
      }

      return (await res.text()) as unknown as T;
    } catch (error) {
      if (error instanceof ApiError || isAbortError(error)) throw error;
      throw new ApiError('Không thể kết nối đến máy chủ.', {
        status: 0,
        code: 'NETWORK_ERROR',
        cause: error,
      });
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
