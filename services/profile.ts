// Profile Service
// Handles user profile operations

import { apiClient } from '@/lib/api-client';
import { UserRes, ProfileUpdateBody } from '@/types/mobile-api';

export const profileService = {
    /**
     * Get user profile
     */
    getUserProfile: async (): Promise<UserRes> => {
        return apiClient<UserRes>('/user/get/profile');
    },

    /**
     * Update user profile
     */
    updateProfile: async (data: ProfileUpdateBody): Promise<string> => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.phone_number) formData.append('phone_number', data.phone_number);
        if (data.fcm_token) formData.append('fcm_token', data.fcm_token);
        if (data.language) formData.append('language', data.language);
        if (data.image) formData.append('image', data.image);

        return apiClient<string>('/user/update/profile', {
            method: 'PUT',
            body: formData,
            headers: {}, // Let browser set Content-Type for FormData
        });
    },

    /**
     * Delete user profile
     */
    deleteProfile: async (): Promise<string> => {
        return apiClient<string>('/user/delete/profile', {
            method: 'DELETE',
        });
    },
};
