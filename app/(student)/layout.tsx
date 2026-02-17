'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/student/Sidebar';
import { notificationService } from '@/services';
import { Bell } from 'lucide-react';


export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState<{ notifications: any[], count: number }>({ notifications: [], count: 0 });

    useEffect(() => {
        if (!isLoading && user) {
            notificationService.getNotifications()
                .then(data => {
                    if (data) setNotifications(data);
                })
                .catch(err => console.error('Failed to load notifications in layout:', err));
        }
    }, [user, isLoading]);

    const hasUnread = React.useMemo(() => {
        return notifications?.notifications?.some((n: any) => !n.is_read);
    }, [notifications]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-40 flex items-center px-4">
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 -ml-2 text-gray-900 hover:bg-slate-50 rounded-xl relative z-10 active:scale-90 transition-transform"
                >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-lg text-slate-900">iMed Team</span>
                </div>

                <div className="ml-auto relative z-10">
                    <button
                        onClick={() => router.push('/notifications')}
                        className="p-2 -mr-2 text-gray-400 hover:text-primary relative active:scale-95 group"
                    >
                        <Bell size={24} />
                        {hasUnread && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white animate-pulse" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar for Desktop & Mobile */}
            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onClose={() => setMobileMenuOpen(false)} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0 overflow-x-hidden">
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
