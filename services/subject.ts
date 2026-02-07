// Subject Service
// Handles subject operations

import { apiClient } from '@/lib/api-client';

export const subjectService = {
    /**
     * Get all subjects
     */
    getAll: async (params?: any): Promise<any> => {
        const queryString = params ? buildQueryString(params) : '';
        const response = await apiClient<any>(`/subject${queryString}`);

        // API returns {data: [], total: number} but we need {subjects: [], count: number}
        return {
            subjects: response.data || [],
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
