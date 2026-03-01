// Authentication Service
// Handles user login, registration, and password management

import { apiClient, setAuthToken, removeAuthToken } from '@/lib/api-client';
import { UserCheckReq, UserCheckRes, UserLoginReq, TokenRes, ChangePasswordBody, OtpSendReq, OtpConfirmReq, OtpRes } from '@/types/mobile-api';

export const authService = {
    /**
     * Check if user has an account
     */
    checkUser: async (data: UserCheckReq): Promise<UserCheckRes> => {
        return apiClient<UserCheckRes>('/auth/user/check', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: false,
        });
    },

    /**
     * Login user and store token
     */
    login: async (data: UserLoginReq): Promise<TokenRes> => {
        const response = await apiClient<TokenRes>('/auth/user/login', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: false,
        });

        if (response.access_token) {
            setAuthToken(response.access_token);
        }

        return response;
    },

    /**
     * OTP Send - Sends confirmation code to email
     */
    otpSend: async (data: OtpSendReq): Promise<string> => {
        return apiClient<string>('/auth/user/otp/send', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: false,
        });
    },

    /**
     * OTP Confirm - Verifies confirmation code
     */
    otpConfirm: async (data: OtpConfirmReq): Promise<TokenRes> => {
        const response = await apiClient<TokenRes>('/auth/user/otp/confirm', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: false,
        });

        if (response.access_token) {
            setAuthToken(response.access_token);
        }

        return response;
    },

    /**
     * Change user password (deprecated)
     */
    changePassword: async (data: ChangePasswordBody): Promise<string> => {
        return apiClient<string>('/auth/password/change', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Logout user and remove token
     */
    logout: (): void => {
        removeAuthToken();
    },
};
