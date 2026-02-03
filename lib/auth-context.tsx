'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, profileService } from '@/services/mobile-api';
import { UserRes, UserLoginReq, UserCheckReq, UserRegisterReq } from '@/types/mobile-api';

interface AuthContextType {
    user: UserRes | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: UserLoginReq) => Promise<void>;
    register: (data: UserRegisterReq) => Promise<void>;
    checkUser: (data: UserCheckReq) => Promise<boolean>;
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
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const userData = await profileService.getProfile();
                    setUser(userData);
                } catch (error: any) {
                    console.error('Failed to fetch user profile:', error);

                    // Try refreshing token if 401 Unauthorized or generally failed
                    if (error.message && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
                        try {
                            const refreshToken = localStorage.getItem('refresh_token');
                            if (refreshToken) {
                                const response = await authService.refreshToken(refreshToken);
                                if (response.access_token) {
                                    localStorage.setItem('auth_token', response.access_token);
                                    if (response.refresh_token) {
                                        localStorage.setItem('refresh_token', response.refresh_token);
                                    }
                                    // Retry profile fetch
                                    const userData = await profileService.getProfile();
                                    setUser(userData);
                                    return; // Success
                                }
                            }
                        } catch (refreshError) {
                            console.error('Token refresh failed:', refreshError);
                        }
                    }

                    // If refresh failed or not 401, clear session
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('refresh_token');
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
            const userData = await profileService.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (data: UserRegisterReq) => {
        try {
            await authService.register(data);
            // Fetch user profile after successful registration
            const userData = await profileService.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const userData = await profileService.getProfile();
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
