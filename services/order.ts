// Order Service
// Handles order creation

import { apiClient } from '@/lib/api-client';
import { OrderCreateBody } from '@/types/mobile-api';

export const orderService = {
    /**
     * Create new order
     */
    create: async (data: OrderCreateBody): Promise<string> => {
        return apiClient('/order', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
