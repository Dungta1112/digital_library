import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => {
    // Unwrap ApiResponse
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) {
         return Promise.reject(new Error(body.message || 'API Error'));
      }
      return body.data; // Return just the data part
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const body = res.data;
          if (body?.success && body?.data?.accessToken) {
             localStorage.setItem('access_token', body.data.accessToken);
             if (body.data.refreshToken) {
                localStorage.setItem('refresh_token', body.data.refreshToken);
             }
             if (originalRequest.headers) {
               originalRequest.headers.Authorization = `Bearer ${body.data.accessToken}`;
             }
             // Need to make sure we don't double unwrap, so we return apiClient(...) directly
             // The response interceptor will unwrap it.
             return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Extract backend error message if available
    const errBody = error.response?.data;
    if (errBody && errBody.message) {
      error.message = errBody.message;
    }
    
    return Promise.reject(error);
  }
);
