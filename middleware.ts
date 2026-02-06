import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value;

    // Protect /app (student) routes
    if (pathname.startsWith('/app')) {
        if (!token) {
            // Redirect to student login
            const url = new URL('/auth/login', request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ['/app/:path*'],
};
