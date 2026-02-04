'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Activity, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navItems = [
    { name: 'Asosiy', href: '/app', icon: Home },
    { name: 'Barcha kurslar', href: '/app/courses', icon: BookOpen },
    { name: 'Mening kurslarim', href: '/app/my-courses', icon: BookOpen },
    { name: 'Reyting', href: '/app/leaderboard', icon: Activity },
    { name: 'Bildirishnomalar', href: '/app/notifications', icon: Bell },
    { name: 'Profil', href: '/app/profile', icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
            <div className="p-6 flex items-center gap-3">
                <img src="/imedteamlogo.png" alt="Logo" className="w-10 h-10 rounded-lg shadow-sm" />
                <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                    iMed Team
                </span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-100/50'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                    <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-500" />
                    Chiqish
                </button>
            </div>
        </div>
    );
}
