// Banner Service
// Handles banner operations

import { apiClient } from '@/lib/api-client';
import { BannerMobileList, BannerMobileRes } from '@/types/mobile-api';

export const bannerService = {
    /**
     * Get all banners
     */
    getBanners: async (): Promise<BannerMobileList> => {
        const response = await apiClient<any>('/banner');

        // API returns {data: [], total: number} but we need {banners: [], count: number}
        return {
            banners: response.data || [],
            count: response.total || 0
        };
    },

    /**
     * Get banner by ID
     */
    getBannerById: async (id: string): Promise<BannerMobileRes> => {
        return apiClient<BannerMobileRes>(`/banner/${id}`);
    },
};
