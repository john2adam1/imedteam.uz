import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value;
    const isAdmin = request.cookies.get('is_admin')?.value === 'true';

    // Protect /app (student) routes
    if (pathname.startsWith('/app')) {
        if (!token) {
            // Redirect to student login
            const url = new URL('/auth/login', request.url);
            return NextResponse.redirect(url);
        }
    }

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        // We allow access TO the /admin/login page even without a token
        if (pathname === '/admin/login') {
            return NextResponse.next();
        }

        if (!token || !isAdmin) {
            // Redirect specifically to admin login
            const url = new URL('/admin/login', request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ['/app/:path*', '/admin/:path*'],
};
