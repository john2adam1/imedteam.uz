// Banner Service
// Handles banner operations

import { apiClient } from '@/lib/api-client';
import { getMediaUrl } from '@/lib/utils';
import { BannerMobileList, BannerMobileRes } from '@/types/mobile-api';

export const bannerService = {
    /**
     * Get all banners
     */
    getBanners: async (): Promise<BannerMobileList> => {
        const response = await apiClient<any>('/banner');

        // Helper to extract array from various potential formats
        const getArray = (data: any, key: string): any[] => {
            if (Array.isArray(data)) return data;
            if (!data || typeof data !== 'object') return [];

            // Check top level keys
            if (Array.isArray(data[key])) return data[key];
            if (Array.isArray(data.data)) return data.data;
            if (Array.isArray(data.items)) return data.items;

            // Check nested data property
            if (data.data && typeof data.data === 'object') {
                if (Array.isArray(data.data[key])) return data.data[key];
                if (Array.isArray(data.data.items)) return data.data.items;
            }

            return [];
        };

        const banners = getArray(response, 'banners').map((b: any) => ({
            ...b,
            image_url: getMediaUrl(b.image_url)
        }));
        const total = response.total || response.count || banners.length;

        return {
            banners,
            count: total
        };
    },

    /**
     * Get banner by ID
     */
    getBannerById: async (id: string): Promise<BannerMobileRes> => {
        const banner = await apiClient<BannerMobileRes>(`/banner/${id}`);
        if (banner) {
            banner.image_url = getMediaUrl(banner.image_url);
        }
        return banner;
    },
};
