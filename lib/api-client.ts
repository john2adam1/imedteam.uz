import { getCookie } from './cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev.axadjonovsardorbek.uz/api';

export interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
    namespace?: 'mobile' | 'web';
}

export async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { requiresAuth = true, namespace, ...fetchOptions } = options;

    const url = `${API_BASE_URL}${namespace ? `/${namespace}` : ''}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    if (requiresAuth) {
        const token = getCookie('auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(url, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return response.json();
}
