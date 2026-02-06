'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Activity, Bell, User, LogOut, Grid } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navItems = [
    { name: 'Asosiy', href: '/app', icon: Home },
    { name: 'Barcha kurslar', href: '/app/courses', icon: Grid },
    { name: 'Reyting', href: '/app/leaderboard', icon: Activity },
    { name: 'Profil', href: '/app/profile', icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div style={{ width: '250px', borderRight: '1px solid #ccc', height: '100vh', padding: '20px' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>iMed Team</h2>
            </div>

            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href));
                        return (
                            <li key={item.name} style={{ marginBottom: '10px' }}>
                                <Link
                                    href={item.href}
                                    style={{
                                        textDecoration: 'none',
                                        color: isActive ? '#007bff' : 'black',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        display: 'block',
                                        padding: '10px',
                                        border: isActive ? '1px solid #007bff' : '1px solid transparent',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <button
                    onClick={() => logout()}
                    style={{
                        width: '100%',
                        padding: '10px',
                        cursor: 'pointer',
                        border: '1px solid #ccc',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
