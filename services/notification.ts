// Notification Service
// Handles user notifications

import { apiClient } from '@/lib/api-client';
import { UserNotificationList, NotificationQueryParams } from '@/types/mobile-api';

export const notificationService = {
    /**
     * Get user notifications
     */
    getNotifications: async (params?: NotificationQueryParams): Promise<UserNotificationList> => {
        const queryString = params ? buildQueryString(params) : '';
        const response = await apiClient<any>(`/notification/user${queryString}`);

        // API returns {data: [], total: number} but we need {notifications: [], count: number}
        return {
            notifications: response.data || [],
            count: response.total || 0
        };
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (id: string): Promise<string> => {
        return apiClient<string>(`/notification/${id}/read`, {
            method: 'PUT',
        });
    },
};

/**
 * Helper function to build query strings
 */
function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}
