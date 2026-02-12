'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Activity, Bell, User, LogOut, Grid } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navItems = [
    { name: 'Asosiy', href: '/dashboard', icon: Home },
    { name: 'Barcha kurslar', href: '/courses', icon: Grid },
    { name: 'Reyting', href: '/leaderboard', icon: Activity },
    { name: 'Profil', href: '/profile', icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="w-80 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 overflow-hidden shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)]">
            {/* Logo Area */}
            <div className="p-8 mb-4">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-primary rounded-[1rem] flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
                        iMed <span className="text-primary italic">Team</span>
                    </h2>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold transition-all duration-300 group
                                ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                    : 'text-gray-400 hover:bg-slate-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={22} className={isActive ? 'text-white' : 'text-gray-300 group-hover:text-primary transition-colors'} />
                            <span className="tracking-tight">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all group"
                >
                    <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
                    <span className="tracking-tight">Chiqish</span>
                </button>
            </div>
        </div>
    );
}
