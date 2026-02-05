// Authentication Service
// Handles user login, registration, and password management
// Includes graceful fallback when API is unavailable

import { apiClient, setAuthToken, removeAuthToken } from '@/lib/api-client';
import { UserCheckReq, UserCheckRes, UserLoginReq, TokenRes, ChangePasswordBody } from '@/types/mobile-api';

export const authService = {
    /**
     * Check if user has an account
     */
    checkUser: async (data: UserCheckReq): Promise<UserCheckRes> => {
        try {
            return apiClient<UserCheckRes>('/auth/user/check', {
                method: 'POST',
                body: JSON.stringify(data),
                requiresAuth: false,
            });
        } catch (error) {
            console.warn('User check failed, using fallback:', error);
            // Always return true for development when API is down
            return { has_account: true };
        }
    },

    /**
     * Login user and store token
     */
    login: async (data: UserLoginReq): Promise<TokenRes> => {
        try {
            const response = await apiClient<TokenRes>('/auth/user/login', {
                method: 'POST',
                body: JSON.stringify(data),
                requiresAuth: false,
            });

            // Store token on successful login (handled by apiClient fallback)
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed. Please check your credentials and try again.');
        }
    },

    /**
     * Change user password
     */
    changePassword: async (data: ChangePasswordBody): Promise<string> => {
        try {
            return apiClient<string>('/auth/password/change', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error('Password change failed:', error);
            throw new Error('Failed to change password. Please try again.');
        }
    },

    /**
     * Logout user and remove token
     */
    logout: (): void => {
        removeAuthToken();
        console.log('User logged out');
    },
};
