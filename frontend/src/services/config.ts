export const config = {
  USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS === 'true',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  MOCK_DELAY_MS: 800,
};

export async function fetchWithMock<T>(
  mockDataFile: () => Promise<{ default: T }>,
  realFetch?: () => Promise<Response>
): Promise<T> {
  if (config.USE_MOCKS || !realFetch) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, config.MOCK_DELAY_MS));
    const mockModule = await mockDataFile();
    return mockModule.default;
  }
  
  const response = await realFetch();
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}
