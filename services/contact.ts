// Contact Service
// Handles contact form submissions

import { apiClient } from '@/lib/api-client';

export const contactService = {
    /**
     * Submit contact form
     */
    submit: async (data: any): Promise<string> => {
        return apiClient('/contact', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
