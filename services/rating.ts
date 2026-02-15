// Rating Service
// Handles user ratings and leaderboard

import { apiClient } from '@/lib/api-client';
import { getMediaUrl } from '@/lib/utils';
import { RatingUser } from '@/types/mobile-api';

export const ratingService = {
    /**
     * Get user rating and leaderboard position
     */
    getRating: async (params?: any): Promise<any> => {
        const queryString = params ? buildQueryString(params) : '';
        const response = await apiClient<any>(`/user/rating${queryString}`);
        const data = response.data || response;

        if (data.items) {
            data.items = data.items.map((item: RatingUser) => ({
                ...item,
                image_url: getMediaUrl(item.image_url)
            }));
        }

        if (data.me) {
            data.me.image_url = getMediaUrl(data.me.image_url);
        }

        return data;
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
