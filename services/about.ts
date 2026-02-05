// About Service
// Handles about page operations

import { apiClient } from '@/lib/api-client';

export const aboutService = {
    /**
     * Get all about pages
     */
    getAll: async (title?: string): Promise<any> => {
        const queryString = title ? `?title=${encodeURIComponent(title)}` : '';
        return apiClient(`/about${queryString}`);
    },

    /**
     * Get about page by ID
     */
    getById: async (id: string): Promise<any> => {
        return apiClient(`/about/${id}`);
    },
};
