'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, profileService } from '@/services';
import { UserRes, UserLoginReq, UserCheckReq, UserRegisterReq } from '@/types/mobile-api';
import { getCookie } from './cookies';

interface AuthContextType {
    user: UserRes | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: UserLoginReq) => Promise<void>;
    register: (data: UserRegisterReq) => Promise<void>;
    checkUser: (data: UserCheckReq) => Promise<boolean>;
    otpSend: (email: string) => Promise<void>;
    otpConfirm: (email: string, code: string) => Promise<void>;
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
                } catch (error: any) {
                    console.error('Failed to fetch user profile:', error);
                    setIsLoading(false);
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
            // Use login endpoint with name for registration
            await authService.login({
                phone_number: data.phone_number,
                password: data.password,
                name: data.full_name,
            });
            // Fetch user profile after successful registration
            const userData = await profileService.getUserProfile();
            setUser(userData);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const otpSend = async (email: string) => {
        try {
            await authService.otpSend({ email });
        } catch (error) {
            console.error('OTP send failed:', error);
            throw error;
        }
    };

    const otpConfirm = async (email: string, code: string) => {
        try {
            await authService.otpConfirm({ email, confirmation_code: code });
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
