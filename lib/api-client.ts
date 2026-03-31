// Clean API Client for iMed Platform
// Uses environment-based API URL
// Supports multiple namespaces (mobile/web)

import { getCookie, setCookie, removeCookie } from './cookies';

// Base URL: Try environment variable first, then fallback to production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prod.axadjonovsardorbek.uz/web';

export interface ApiClientOptions extends RequestInit {
    requiresAuth?: boolean;
    namespace?: 'mobile';
}

/**
 * Main API client for iMed platform
 * Handles authentication, error handling, and token management
 */
export async function apiClient<T>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<T> {
    const { requiresAuth = true, namespace = 'mobile', ...fetchOptions } = options;

    const deviceId = getDeviceId();

    // Normalize base URL: strip trailing /web or /api if we're adding it via namespace
    let baseUrl = API_BASE_URL.replace(/\/$/, '');
    if (baseUrl.endsWith('/web') || baseUrl.endsWith('/api') || baseUrl.endsWith('/mobile')) {
        baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
    }

    const url = `${baseUrl}/${namespace}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept-Language': 'uz',
        ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    // Remove Content-Type if body is FormData (let browser set it with boundary)
    if (fetchOptions.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    // Add authentication token if required
    if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        });

        if (response.status === 401 || response.status === 403) {
            removeAuthToken();
            /*
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            */
            throw new Error('Sessiya muddati tugadi yoki boshqa qurilmada kirilgan');
        }

        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            data = { message: text };
        }


        if (!response.ok) {
            throw new Error(data.message || data.error || `API error: ${response.status}`);
        }

        return data as T;
    } catch (error: any) {
        console.error(`[API Error] ${url}:`, error);
        throw error;
    }
}

/**
 * Get authentication token from cookie or localStorage
 */
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return getCookie('auth_token') || localStorage.getItem('auth_token');
}

/**
 * Store authentication token
 */
export function setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    setCookie('auth_token', token);
    localStorage.setItem('auth_token', token);
}

/**
 * Remove authentication token (logout)
 */
export function removeAuthToken(): void {
    if (typeof window !== 'undefined') {
        removeCookie('auth_token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
    }
}

/**
 * Get or generate a unique device ID
 */
export function getDeviceId(): string | null {
    if (typeof window === 'undefined') return null;

    let deviceId = localStorage.getItem('device_id');

    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem('device_id', deviceId);
    }

    return deviceId;
}
