// App Route Service
// Handles fetching app routes (e.g., download links)

import { apiClient } from '@/lib/api-client';
import { AppRouteRes } from '@/types/mobile-api';

export const appRouteService = {
    /**
     * Get all app routes
     */
    getAll: async (): Promise<AppRouteRes[]> => {
        const response = await apiClient<any>('/app-route', { requiresAuth: false });
        // Assuming response.data contains the list of routes, but fallback if it's direct array or under another key
        return response.data || response || [];
    },
};
