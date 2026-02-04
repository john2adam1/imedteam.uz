'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex items-center gap-2 transform scale-110">
                                <div className="w-11 h-11 rounded-lg bg-transparent grid place-items-center">
                                    <img src="/imedteamlogo.png" alt="Logo" className="w-full h-full object-contain rounded-lg" />
                                </div>
                                <div className="leading-tight">
                                    <div className="text-lg font-extrabold tracking-tight group-hover:text-primary-700 transition">
                                        iMed Team
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#home" className="text-sm font-medium text-slate-700 hover:text-primary-700 link-underline">Bosh sahifa</a>
                            <a href="#services" className="text-sm font-medium text-slate-700 hover:text-primary-700 link-underline">Xizmatlar</a>
                            <a href="#courses" className="text-sm font-medium text-slate-700 hover:text-primary-700 link-underline">Kurslar</a>
                            <a href="#team" className="text-sm font-medium text-slate-700 hover:text-primary-700 link-underline">Jamoa</a>
                            <a href="#blog" className="text-sm font-medium text-slate-700 hover:text-primary-700 link-underline">Yangiliklar</a>
                            <a href="#contact" className="text-sm font-medium text-slate-700 hover:text-primary-700 link-underline">Aloqa</a>
                        </nav>

                        <div className="flex items-center gap-3">
                            <Link href="/auth/login" className="hidden md:inline-flex px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition">
                                Kirish
                            </Link>
                            <button
                                id="menuBtn"
                                className="md:hidden w-10 h-10 rounded-lg border border-slate-200 hover:border-primary-500 hover:text-primary-700 flex items-center justify-center"
                                aria-label="Menu"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div id="mobileMenu" className={`md:hidden border-t border-slate-100 bg-white ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="max-w-7xl mx-auto px-4 py-3 grid gap-2">
                        <a href="#home" className="py-2 font-medium text-slate-700 hover:text-primary-700" onClick={() => setMobileMenuOpen(false)}>Bosh sahifa</a>
                        <a href="#services" className="py-2 font-medium text-slate-700 hover:text-primary-700" onClick={() => setMobileMenuOpen(false)}>Xizmatlar</a>
                        <a href="#courses" className="py-2 font-medium text-slate-700 hover:text-primary-700" onClick={() => setMobileMenuOpen(false)}>Kurslar</a>
                        <a href="#team" className="py-2 font-medium text-slate-700 hover:text-primary-700" onClick={() => setMobileMenuOpen(false)}>Jamoa</a>
                        <a href="#blog" className="py-2 font-medium text-slate-700 hover:text-primary-700" onClick={() => setMobileMenuOpen(false)}>Yangiliklar</a>
                        <a href="#contact" className="py-2 font-medium text-slate-700 hover:text-primary-700" onClick={() => setMobileMenuOpen(false)}>Aloqa</a>
                        <Link href="/auth/login" className="py-2 font-medium text-primary-600 hover:text-primary-800" onClick={() => setMobileMenuOpen(false)}>
                            Kirish / Ro'yxatdan o'tish
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
}
