// Banner Service
// Handles banner operations

import { apiClient } from '@/lib/api-client';
import { BannerMobileList, BannerMobileRes } from '@/types/mobile-api';

export const bannerService = {
    /**
     * Get all banners
     */
    getBanners: async (): Promise<BannerMobileList> => {
        return apiClient<BannerMobileList>('/banner');
    },

    /**
     * Get banner by ID
     */
    getBannerById: async (id: string): Promise<BannerMobileRes> => {
        return apiClient<BannerMobileRes>(`/banner/${id}`);
    },
};
