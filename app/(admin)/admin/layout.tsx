'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-primary-600">
                iMed Admin
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                <Link href="/admin/subjects" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-md hover:bg-slate-50 transition">
                  Kategoriyalar
                </Link>
                <Link href="/admin/banners" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-md hover:bg-slate-50 transition">
                  Bannerlar
                </Link>
                <Link href="/admin/users" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-md hover:bg-slate-50 transition">
                  Foydalanuvchilar
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="text-sm font-medium text-slate-600 hover:text-red-600 transition"
              >
                Chiqish
              </button>
              <Link href="/" className="px-4 py-2 text-sm font-semibold text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition">
                Saytga qaytish
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
