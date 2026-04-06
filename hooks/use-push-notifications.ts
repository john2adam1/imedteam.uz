import { useEffect, useState, useCallback } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import { app } from '@/lib/firebase';
import { profileService } from '@/services/profile';
import { useAuth } from '@/lib/auth-context';

export const usePushNotifications = () => {
    const { user } = useAuth();
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const syncToken = useCallback(async () => {
        if (!user) return;

        // Don't sync if we already did it this session to avoid redundant API calls
        if (sessionStorage.getItem('fcm_token_synced')) return;

        try {
            const messaging = getMessaging(app);
            const token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });

            if (token) {
                console.log('[Push] FCM Token generated:', token);
                await profileService.updateProfile({ fcm_token: token });
                sessionStorage.setItem('fcm_token_synced', 'true');
            }
        } catch (err) {
            console.error('[Push] Failed to sync token:', err);
        }
    }, [user]);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.warn('[Push] Notifications not supported in this browser');
            return;
        }

        setLoading(true);
        try {
            const status = await Notification.requestPermission();
            setPermission(status);

            if (status === 'granted') {
                await syncToken();
            }
        } catch (err) {
            console.error('[Push] Permission request failed:', err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-sync token if permission is already granted and user is logged in
    useEffect(() => {
        if (user && permission === 'granted' && !sessionStorage.getItem('fcm_token_synced')) {
            syncToken();
        }
    }, [user, permission, syncToken]);

    return { permission, requestPermission, loading };
};
