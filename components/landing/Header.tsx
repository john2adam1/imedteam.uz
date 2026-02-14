'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const authPath = isAuthenticated ? '/dashboard' : '/auth/login';

    return (
        <>
            {/* Top bar */}
            <div className="w-full bg-primary-50 text-primary-700 text-sm">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                    <span className="font-medium">📣 Yangi oqim uchun ro‘yxat davom etmoqda!</span>
                    <a href="#contact" className="font-semibold link-underline">Aloqa</a>
                </div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-20 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                                <img src="/assets/favicon.ico.png" alt="Logo" className="w-14 h-14 object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tight text-slate-900 leading-none group-hover:text-primary transition-colors">
                                    iMed Team
                                </span>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-primary mt-1">
                                    Professional
                                </span>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-10">
                            {['Bosh sahifa', 'Xizmatlar', 'Kurslar', 'Jamoa', 'Yangiliklar', 'Aloqa'].map((item, i) => (
                                <a
                                    key={i}
                                    href={`#${['home', 'services', 'courses', 'team', 'blog', 'contact'][i]}`}
                                    className="text-sm font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-widest relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link
                                href={authPath}
                                className="hidden md:inline-flex px-8 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-primary transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                            >
                                {isAuthenticated ? 'Kabinet' : 'Kirish'}
                            </Link>
                            <button
                                className="lg:hidden w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 hover:bg-primary/5 hover:text-primary transition-all"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? '✕' : '☰'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] border-t border-slate-100' : 'max-h-0'}`}>
                    <div className="max-w-7xl mx-auto px-6 py-8 grid gap-4 bg-white">
                        {['Bosh sahifa', 'Xizmatlar', 'Kurslar', 'Jamoa', 'Yangiliklar', 'Aloqa'].map((item, i) => (
                            <a
                                key={i}
                                href={`#${['home', 'services', 'courses', 'team', 'blog', 'contact'][i]}`}
                                className="py-2 text-lg font-black text-slate-900 hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <Link
                            href={authPath}
                            className="mt-4 py-4 px-6 rounded-2xl bg-primary text-white font-black text-center shadow-lg shadow-primary/20"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {isAuthenticated ? 'Shaxsiy kabinet' : "Kirish / Ro'yxatdan o'tish"}
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
}
