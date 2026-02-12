import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value;

    // Landing page is public
    if (pathname === '/') {
        return NextResponse.next();
    }

    // Auth routes are public
    const isAuthRoute = pathname.startsWith('/auth/');
    if (isAuthRoute) {
        return NextResponse.next();
    }

    // All other routes (student area) require authentication
    if (!token) {
        const url = new URL('/auth/login', request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
