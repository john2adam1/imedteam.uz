// Activity Service
// Handles user activity tracking

import { apiClient } from '@/lib/api-client';

export const activityService = {
    /**
     * Get user activity statistics
     */
    getStats: async (params?: any): Promise<any> => {
        const queryString = params ? buildQueryString(params) : '';
        const response = await apiClient<any>(`/user/activity${queryString}`);
        return response.data || response;
    },

    /**
     * Record user activity
     */
    create: async (data: any): Promise<string> => {
        return apiClient('/user/activity', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

/**
 * Helper function to build query strings
 */
function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}
