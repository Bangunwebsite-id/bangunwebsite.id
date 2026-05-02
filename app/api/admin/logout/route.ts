import { NextResponse } from 'next/server';

import { ADMIN_SESSION_COOKIE } from '@/app/lib/auth';

function clearSessionAndRedirect(request: Request) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));

    response.cookies.set({
        name: ADMIN_SESSION_COOKIE,
        value: '',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    });

    return response;
}

export async function POST(request: Request) {
    return clearSessionAndRedirect(request);
}

export async function GET(request: Request) {
    return clearSessionAndRedirect(request);
}
