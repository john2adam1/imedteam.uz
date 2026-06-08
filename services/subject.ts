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
        const response = await apiClient<any>(`/subject${queryString}`);

        const rawSubjects = response.subjects ?? response.data ?? [];
        const subjects = rawSubjects.map((s: any) => ({
            ...s,
            image_url: getMediaUrl(s.image_url)
        }));

        return {
            subjects,
            count: response.count ?? response.total ?? subjects.length
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
