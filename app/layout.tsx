import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { LanguageProvider } from '@/lib/language-context';
import ToastProvider from '@/components/common/ToastProvider';

export const metadata: Metadata = {
  title: 'Imed - Educational Platform',
  description: 'Online learning platform for medical education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider />
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
