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

        // API sometimes returns an array directly, or {data: [], total: number}
        // API sometimes returns an array directly, or {data: [], total: number}, or {items: [], count: number}
        let notifications: any[] = [];
        let total = 0;

        if (Array.isArray(response)) {
            notifications = response;
            total = response.length;
        } else if (response.data && Array.isArray(response.data)) {
            notifications = response.data;
            total = response.total || response.count || response.data.length;
        } else if (response.items && Array.isArray(response.items)) {
            notifications = response.items;
            total = response.total || response.count || response.items.length;
        } else if (response.notifications && Array.isArray(response.notifications)) {
            notifications = response.notifications;
            total = response.count || response.total || response.notifications.length;
        }

        return {
            notifications,
            count: total
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
