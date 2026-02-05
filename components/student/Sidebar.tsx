'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Activity, Bell, User, LogOut, Grid } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navItems = [
    { name: 'Asosiy', href: '/app', icon: Home },
    { name: 'Barcha kurslar', href: '/app/courses', icon: Grid },
    { name: 'Mening kurslarim', href: '/app/my-courses', icon: BookOpen },
    { name: 'Reyting', href: '/app/leaderboard', icon: Activity },
    { name: 'Profil', href: '/app/profile', icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 shadow-sm">
            <div className="p-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <img src="/imedteamlogo.png" alt="Logo" className="w-8 h-8 brightness-0 invert" />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-xl tracking-tight text-slate-900 leading-none">
                        iMed Team
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary mt-1">
                        Professional Education
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-6 py-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group ${isActive
                                ? 'bg-primary text-white shadow-xl shadow-primary/25 translate-x-1'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-50">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:bg-red-50 hover:text-primary transition-all duration-200 group"
                >
                    <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    Chiqish
                </button>
            </div>
        </div>
    );
}
