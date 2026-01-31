'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';

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
              href="/about"
              className={`${pathname === '/about' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`${pathname === '/contact' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/leaderboard"
                  className={`${pathname === '/leaderboard' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  Leaderboard
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
