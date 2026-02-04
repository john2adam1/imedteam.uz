'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookMarked, Layers, Users, Image, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const adminNavItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Kategoriyalar', href: '/admin/subjects', icon: Layers },
    { name: 'Kurslar', href: '/admin/courses', icon: BookMarked },
    { name: 'Foydalanuvchilar', href: '/admin/users', icon: Users },
    { name: 'Bannerlar', href: '/admin/banners', icon: Image },
    { name: 'Sozlamalar', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="hidden lg:flex flex-col w-72 bg-slate-900 h-screen sticky top-0 text-slate-300">
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/20">
                    <BookMarked className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg text-white leading-tight">iMed Admin</span>
                    <span className="text-[10px] uppercase tracking-widest text-primary-400 font-bold">Boshqaruv paneli</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {adminNavItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center justify-between group px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                                    : 'hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </div>
                            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-black/20">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut className="h-5 w-5" />
                    Tizimdan chiqish
                </button>
            </div>
        </div>
    );
}
