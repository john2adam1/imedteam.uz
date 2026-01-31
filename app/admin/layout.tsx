import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
              </Link>
              <nav className="flex gap-4">
                <Link href="/admin/subjects">
                  <Button variant="ghost">Subjects</Button>
                </Link>
                <Link href="/admin/banners">
                  <Button variant="ghost">Banners</Button>
                </Link>
              </nav>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Site</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

