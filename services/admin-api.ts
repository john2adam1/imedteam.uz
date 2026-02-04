import { apiClient, RequestOptions } from '@/lib/api-client';
import { setCookie, removeCookie } from '@/lib/cookies';

/**
 * Admin API client
 * Enforces use of /web namespace
 */
export const adminApi = {
  get: <T>(endpoint: string, options: RequestOptions = {}) =>
    apiClient<T>(endpoint, { ...options, method: 'GET', namespace: 'web' }),

  post: <T>(endpoint: string, data?: any, options: RequestOptions = {}) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      namespace: 'web',
    }),

  put: <T>(endpoint: string, data?: any, options: RequestOptions = {}) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      namespace: 'web',
    }),

  delete: <T>(endpoint: string, options: RequestOptions = {}) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE', namespace: 'web' }),
};

/**
 * Admin Authentication Service
 */
export const adminAuthService = {
  login: async (data: any) => {
    const response = await adminApi.post<any>('/auth/user/login', data);
    if (typeof window !== 'undefined' && response.access_token) {
      setCookie('auth_token', response.access_token);
      setCookie('is_admin', 'true');
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('is_admin', 'true');
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }
    return response;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      removeCookie('auth_token');
      removeCookie('is_admin');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('is_admin');
    }
  }
};
