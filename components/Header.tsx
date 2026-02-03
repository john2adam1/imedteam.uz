'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';

import { Trophy } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Imed
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`${pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className={`${pathname === '/courses' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/my-courses"
                  className={`${pathname === '/my-courses' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  My Courses
                </Link>
                <Link
                  href="/leaderboard"
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                  title="Leaderboard"
                >
                  <Trophy className="h-6 w-6" />
                </Link>
                <NotificationBell />
                <Link
                  href="/profile"
                  className={`${pathname === '/profile' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </Link>
            )}

            <LanguageSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
