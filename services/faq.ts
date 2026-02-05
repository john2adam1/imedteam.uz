// FAQ Service
// Handles frequently asked questions

import { apiClient } from '@/lib/api-client';

export const faqService = {
    /**
     * Get all FAQs
     */
    getAll: async (): Promise<any> => {
        return apiClient('/faq');
    },

    /**
     * Get FAQ by ID
     */
    getById: async (id: string): Promise<any> => {
        return apiClient(`/faq/${id}`);
    },
};
