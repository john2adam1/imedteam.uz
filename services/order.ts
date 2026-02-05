// Order Service
// Handles order creation

import { apiClient } from '@/lib/api-client';

export const orderService = {
    /**
     * Create new order
     */
    create: async (data: any): Promise<string> => {
        return apiClient('/order', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
