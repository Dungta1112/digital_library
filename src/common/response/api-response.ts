export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export function ok<T>(data: T, message = 'OK'): ApiResponse<T> {
  return { success: true, message, data };
}

export function created<T>(data: T, message = 'Created'): ApiResponse<T> {
  return { success: true, message, data };
}

export function fail(message: string, errors: string[] = []): ApiResponse<never> {
  return { success: false, message, errors };
}
