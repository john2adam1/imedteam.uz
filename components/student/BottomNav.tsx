'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Activity, User, Grid } from 'lucide-react';

const navItems = [
    { name: 'Asosiy', href: '/app', icon: Home },
    { name: 'Kurslarim', href: '/app/my-courses', icon: BookOpen },
    { name: 'Menu', href: '#', icon: Grid, isMenu: true },
    { name: 'Reyting', href: '/app/leaderboard', icon: Activity },
    { name: 'Profil', href: '/app/profile', icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
            <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2.5rem] px-6 py-3">
                <nav className="flex items-center justify-between">
                    {navItems.map((item) => {
                        const isActive = item.href !== '#' && (pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href)));

                        if (item.isMenu) {
                            return (
                                <button
                                    key={item.name}
                                    className="flex flex-col items-center justify-center p-2 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transform active:scale-90 transition-transform"
                                >
                                    <item.icon className="h-6 w-6" />
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center p-2 transition-all duration-200 ${isActive ? 'text-primary' : 'text-slate-400'
                                    }`}
                            >
                                <item.icon className="h-6 w-6" />
                                <span className={`text-[10px] font-bold mt-1 ${isActive ? 'opacity-100' : 'opacity-0 h-0 w-0 overflow-hidden'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
