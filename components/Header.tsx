'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';
import { Trophy, Home, BookOpen, User, LogOut } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/app" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Imed
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/app"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/app'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                }`}
            >
              <Home className="h-4 w-4" />
              Asosiy
            </Link>
            <Link
              href="/app/my-courses"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/app/my-courses')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                }`}
            >
              <BookOpen className="h-4 w-4" />
              Kurslarim
            </Link>
            <Link
              href="/app/leaderboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/app/leaderboard')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                }`}
            >
              <Trophy className="h-4 w-4" />
              Reyting
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <Link
              href="/app/profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/app/profile')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                }`}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.name || 'Profil'}</span>
            </Link>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Chiqish"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-1" />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
