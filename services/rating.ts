// Rating Service
// GET /mobile/user/rating — student leaderboard (web namespace is admin-only)

import { apiClient } from '@/lib/api-client';
import { getMediaUrl } from '@/lib/utils';
import { RatingQueryParams, RatingResponse, RatingUser } from '@/types/mobile-api';

function normalizeUser(user: RatingUser): RatingUser {
    return {
        ...user,
        image_url: getMediaUrl(user.image_url),
    };
}

export const ratingService = {
    /**
     * Get user rating and leaderboard
     * @param params.type - day | week | month | year | total (default: total)
     * @param params.limit - top list size (default: 10, max: 100)
     */
    getRating: async (params?: RatingQueryParams): Promise<RatingResponse> => {
        const queryString = params ? buildQueryString(params) : '';
        const response = await apiClient<any>(`/user/rating${queryString}`, {
            namespace: 'mobile',
        });
        const data: RatingResponse = response.data || response;

        if (data.items) {
            data.items = data.items.map(normalizeUser);
        }

        if (data.me) {
            data.me = normalizeUser(data.me);
        }

        return data;
    },
};

function buildQueryString(params: RatingQueryParams): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}
