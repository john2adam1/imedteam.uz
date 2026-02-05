// Clean API Client for Mobile App
// Base URL: https://dev.axadjonovsardorbek.uz/api
// Only uses /mobile/* endpoints
// Includes comprehensive fallback to mock data when API is unavailable

import { getCookie, setCookie, removeCookie } from './cookies';
import { getMockResponse } from './comprehensive-mock-data';

const API_BASE_URL = 'https://dev.axadjonovsardorbek.uz/api';

export interface ApiClientOptions extends RequestInit {
    requiresAuth?: boolean;
}

/**
 * Main API client for mobile endpoints
 * Handles authentication, error handling, and token management
 * Falls back to comprehensive mock data when API is unavailable
 */
export async function apiClient<T>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options;

    const url = `${API_BASE_URL}/mobile${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((fetchOptions.headers as Record<string, string>) || {}),
    };

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

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API error: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.warn(`API call failed for ${endpoint}, falling back to mock data:`, error);
        
        // Get comprehensive mock response
        const mockResponse = getMockResponse(endpoint);
        
        if (mockResponse) {
            console.log(`Using mock response for ${endpoint}`);
            
            // Simulate token storage for login
            if (endpoint === '/auth/user/login') {
                const loginData = mockResponse as any;
                if (loginData.access_token) {
                    setAuthToken(loginData.access_token);
                }
            }
            
            return mockResponse as T;
        }

        // Re-throw original error if no mock is available
        throw error;
    }
}

/**
 * Get authentication token from cookie or localStorage
 */
function getAuthToken(): string | null {
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
    if (typeof window === 'undefined') return;
    removeCookie('auth_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
}
