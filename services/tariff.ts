// Tariff Service
// Handles pricing plans

import { apiClient } from '@/lib/api-client';

export const tariffService = {
    /**
     * Get all tariffs
     */
    getAll: async (): Promise<any> => {
        const response = await apiClient<any>('/tariff');
        return {
            tariffs: response.data || [],
            count: response.total || 0
        };
    },

    /**
     * Get tariff by ID
     */
    getById: async (id: string): Promise<any> => {
        return apiClient(`/tariff/${id}`);
    },
};
