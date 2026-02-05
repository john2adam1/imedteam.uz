// App Route Service
// Handles application navigation routes

import { apiClient } from '@/lib/api-client';

export const appRouteService = {
    /**
     * Get all app routes
     */
    getAll: async (): Promise<any> => {
        return apiClient('/app-route');
    },

    /**
     * Get app route by ID
     */
    getById: async (id: string): Promise<any> => {
        return apiClient(`/app-route/${id}`);
    },
};
