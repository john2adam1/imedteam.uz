'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, profileService } from '@/services/mobile-api';
import { UserRes, UserLoginReq, UserCheckReq } from '@/types/mobile-api';

interface AuthContextType {
    user: UserRes | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: UserLoginReq) => Promise<void>;
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
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    // Clear invalid token
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('refresh_token');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const checkUser = async (data: UserCheckReq): Promise<boolean> => {
        try {
            const response = await authService.checkUser(data);
            return response.exists;
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
