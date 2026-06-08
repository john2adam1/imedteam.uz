'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, profileService } from '@/services';
import { UserRes, UserLoginReq, UserCheckReq, UserRegisterReq } from '@/types/mobile-api';
import { getCookie } from './cookies';
import { removeAuthToken } from './api-client';

interface AuthContextType {
    user: UserRes | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: UserLoginReq) => Promise<void>;
    register: (data: UserRegisterReq) => Promise<void>;
    checkUser: (data: UserCheckReq) => Promise<boolean>;
    otpSend: (identifier: string, type?: 'email' | 'telegram') => Promise<void>;
    otpConfirm: (identifier: string, code: string, type?: 'email' | 'telegram') => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserRes | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = getCookie('auth_token') || localStorage.getItem('auth_token');

            if (token) {
                try {
                    const userData = await profileService.getUserProfile();
                    setUser(userData);
                } catch {
                    removeAuthToken();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const checkUser = async (data: UserCheckReq): Promise<boolean> => {
        try {
            const response = await authService.checkUser(data);
            return response.has_account;
        } catch (error) {
            console.error('User check failed:', error);
            throw error;
        }
    };

    const login = async (credentials: UserLoginReq) => {
        try {
            await authService.login(credentials);
            // Fetch user profile after successful login
            const userData = await profileService.getUserProfile();
            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (data: UserRegisterReq) => {
        try {
            // Use login endpoint with phone number as login for registration
            await authService.login({
                login: data.phone_number,
                password: data.password,
            });
            // Fetch user profile after successful registration
            const userData = await profileService.getUserProfile();
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };

    const otpSend = async (identifier: string, type: 'email' | 'telegram' = 'email') => {
        try {
            await authService.otpSend({ identifier, type });
        } catch (error) {
            throw error;
        }
    };

    const otpConfirm = async (identifier: string, code: string, type: 'email' | 'telegram' = 'email') => {
        try {
            await authService.otpConfirm({ identifier, confirmation_code: code, type });
            // Fetch user profile after successful confirmation
            const userData = await profileService.getUserProfile();
            setUser(userData);
        } catch (error) {
            console.error('OTP confirmation failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const userData = await profileService.getUserProfile();
            setUser(userData);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        checkUser,
        otpSend,
        otpConfirm,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
