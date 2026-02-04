'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/student/Sidebar';
import BottomNav from '@/components/student/BottomNav';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

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
        <div className="min-h-screen flex bg-slate-50">
            {/* Sidebar for Desktop */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen pb-24 lg:pb-0 relative overflow-x-hidden">
                <main className="flex-grow p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>

            {/* Bottom Nav for Mobile */}
            <BottomNav />
        </div>
    );
}
