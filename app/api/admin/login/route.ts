import { compare } from 'bcryptjs';
import { NextResponse } from 'next/server';

import {
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_MAX_AGE,
    createSessionToken,
} from '@/app/lib/auth';
import { findUserByUsername } from '@/app/lib/users';

type LoginRequestBody = {
    username?: string;
    password?: string;
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LoginRequestBody;
        const username = body.username?.trim().toLowerCase();
        const password = body.password;

        if (!username || !password) {
            return NextResponse.json(
                { message: 'Username dan password wajib diisi.' },
                { status: 400 }
            );
        }

        const user = await findUserByUsername(username);

        if (!user) {
            return NextResponse.json(
                { message: 'Username atau password salah.' },
                { status: 401 }
            );
        }

        const isValidPassword = await compare(password, user.password_hash);

        if (!isValidPassword) {
            return NextResponse.json(
                { message: 'Username atau password salah.' },
                { status: 401 }
            );
        }

        const token = createSessionToken(user.username);
        const response = NextResponse.json({ message: 'Login berhasil.' });

        response.cookies.set({
            name: ADMIN_SESSION_COOKIE,
            value: token,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: ADMIN_SESSION_MAX_AGE,
        });

        return response;
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat login.' },
            { status: 500 }
        );
    }
}
