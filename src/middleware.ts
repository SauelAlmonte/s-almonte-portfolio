// src/middleware.ts
import { NextResponse } from 'next/server';
import { auth } from '@/app/auth/auth';
import { isAdminRequest } from '@/_lib/authz';

export default auth((req) => {
    const p = req.nextUrl.pathname;

    // Only guard admin pages and admin APIs
    if (!p.startsWith('/admin') && !p.startsWith('/api/admin'))
        return NextResponse.next();

    if (!isAdminRequest(req)) {
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('callbackUrl', p);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
