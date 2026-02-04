'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, profileService } from '@/services/mobile-api';
import { adminAuthService } from '@/services/admin-api';
import { UserRes, UserLoginReq, UserCheckReq, UserRegisterReq } from '@/types/mobile-api';
import { AdminLoginReq } from '@/types/admin';
import { getCookie } from './cookies';

interface AuthContextType {
    user: UserRes | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: UserLoginReq) => Promise<void>;
    adminLogin: (credentials: AdminLoginReq) => Promise<void>;
    register: (data: UserRegisterReq) => Promise<void>;
    checkUser: (data: UserCheckReq) => Promise<boolean>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserRes | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = getCookie('auth_token') || localStorage.getItem('auth_token');
            const adminFlag = getCookie('is_admin') === 'true' || localStorage.getItem('is_admin') === 'true';

            if (token) {
                try {
                    // For now, we use mobile profile service to get user info
                    // If isAdmin is true, we might need a different profile fetch if they are different entities
                    const userData = await profileService.getProfile();
                    setUser(userData);
                    setIsAdmin(adminFlag);
                } catch (error: any) {
                    console.error('Failed to fetch user profile:', error);
                    // ... error handling ...
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

    const adminLogin = async (credentials: AdminLoginReq) => {
        try {
            await adminAuthService.login(credentials);
            setIsAdmin(true);
            // After admin login, we can't necessarily use mobile profile service
            // but for simplicity if the person is same:
            try {
                const userData = await profileService.getProfile();
                setUser(userData);
            } catch {
                setUser({ id: 'admin', name: 'Admin User' } as any);
            }
        } catch (error) {
            console.error('Admin login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        adminAuthService.logout();
        setUser(null);
        setIsAdmin(false);
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
        isAdmin,
        isAuthenticated: !!user,
        isLoading,
        login,
        adminLogin,
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
