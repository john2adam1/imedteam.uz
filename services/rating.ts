// Rating Service
// Handles user ratings and leaderboard

import { apiClient } from '@/lib/api-client';

export const ratingService = {
    /**
     * Get user rating and leaderboard position
     */
    getRating: async (params?: any): Promise<any> => {
        const queryString = params ? buildQueryString(params) : '';
        const response = await apiClient<any>(`/user/rating${queryString}`);
        return response.data || response;
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
