'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Activity, Bell, User } from 'lucide-react';

const navItems = [
    { name: 'Asosiy', href: '/app', icon: Home },
    { name: 'Kurslar', href: '/app/courses', icon: BookOpen },
    { name: 'Reyting', href: '/app/leaderboard', icon: Activity },
    { name: 'Xabar', href: '/app/notifications', icon: Bell },
    { name: 'Profil', href: '/app/profile', icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-200/50 rounded-2xl h-16 z-50 overflow-hidden">
            <nav className="flex items-center justify-around h-full px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center flex-1 group"
                        >
                            <div
                                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isActive ? '-translate-y-1' : ''
                                    }`}
                            >
                                <div
                                    className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-slate-400'
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <span
                                    className={`text-[10px] font-bold tracking-tight transition-all duration-300 ${isActive ? 'text-primary-600 scale-100' : 'text-slate-400 opacity-0 scale-50'
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </div>
                            {isActive && (
                                <div className="absolute -bottom-1 w-1 h-1 bg-primary-600 rounded-full shadow-sm shadow-primary-200" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
