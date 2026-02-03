'use client';

import { useAuth } from '@/lib/auth-context';
import LandingPage from '@/components/landing/LandingPage';
import UserHome from '@/components/dashboard/UserHome';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    return <UserHome />;
  }

  return <LandingPage />;
}
