// Promocode Service
import { apiClient } from '@/lib/api-client';
import { PromocodeReq, PromocodeRes } from '@/types/mobile-api';

export const promocodeService = {
    /**
     * Check promocode validity
     */
    check: async (data: PromocodeReq): Promise<PromocodeRes> => {
        return apiClient('/promocode/check', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
