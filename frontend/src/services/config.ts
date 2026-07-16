export const config = {
  USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS === 'true',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
  MOCK_DELAY_MS: 800,
};

export function getApiOrigin() {
  try {
    return new URL(config.API_BASE_URL).origin;
  } catch {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }
}

export function toBackendUrl(url: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;

  const origin = getApiOrigin();
  if (!origin || !url.startsWith('/')) return url;

  return `${origin}${url}`;
}

/**
 * Tạo độ trễ nhỏ để giao diện mock vẫn thể hiện loading giống khi gọi mạng thật.
 * Có thể giảm MOCK_DELAY_MS nếu muốn thao tác nhanh hơn khi phát triển.
 */
export const waitForMock = () =>
  new Promise((resolve) => setTimeout(resolve, config.MOCK_DELAY_MS));

/**
 * Chọn nguồn dữ liệu theo NEXT_PUBLIC_USE_MOCKS.
 *
 * - true: chạy hàm mockRequest, không cần backend/database.
 * - false: chạy apiRequest để gọi API thật.
 *
 * Dùng helper này trong service giúp sau này chuyển sang backend chỉ bằng file .env.local.
 */
export async function runWithMock<T>(
  mockRequest: () => T | Promise<T>,
  apiRequest: () => Promise<T>
): Promise<T> {
  if (config.USE_MOCKS) {
    await waitForMock();
    return mockRequest();
  }

  return apiRequest();
}

export async function fetchWithMock<T>(
  mockDataFile: () => Promise<{ default: T }>,
  realFetch?: () => Promise<Response>
): Promise<T> {
  if (config.USE_MOCKS || !realFetch) {
    await waitForMock();
    const mockModule = await mockDataFile();
    return mockModule.default;
  }
  
  const response = await realFetch();
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}
