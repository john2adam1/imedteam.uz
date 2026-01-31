'use client';

import { useAuth } from '@/lib/auth-context';
import { notificationService } from '@/services/mobile-api';
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
    const { isAuthenticated } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUnreadCount();
        }
    }, [isAuthenticated]);

    const fetchUnreadCount = async () => {
        try {
            const response = await notificationService.getAll({ is_read: false });
            setUnreadCount(response.notifications?.length || 0);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <a href="/notifications" className="relative inline-block">
            <Bell className="h-6 w-6 text-gray-700 hover:text-blue-600 transition-colors" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </a>
    );
}
