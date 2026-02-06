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
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTop: '1px solid #ccc',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-around',
            zIndex: 1000
        }} className="lg:hidden">
            {navItems.map((item) => {
                const isActive = item.href !== '#' && (pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href)));

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        style={{
                            textDecoration: 'none',
                            color: isActive ? '#007bff' : 'black',
                            fontSize: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}
