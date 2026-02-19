// Subject Service
// Handles subject operations

import { apiClient } from '@/lib/api-client';
import { getMediaUrl } from '@/lib/utils';

export const subjectService = {
    /**
     * Get all subjects
     */
    getAll: async (params?: any): Promise<any> => {
        const queryString = params ? buildQueryString(params) : '';
        const response = await apiClient<any>(`/subject${queryString}`, { requiresAuth: false });

        const subjects = (response.data || []).map((s: any) => ({
            ...s,
            image_url: getMediaUrl(s.image_url)
        }));

        // API returns {data: [], total: number} but we need {subjects: [], count: number}
        return {
            subjects,
            count: response.total || 0
        };
    },

    /**
     * Get subject by ID
     */
    getById: async (id: string): Promise<any> => {
        return apiClient(`/subject/${id}`);
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
