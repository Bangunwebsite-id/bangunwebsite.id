import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import { createAdminUser, listAdminUsers } from '@/app/lib/users';

type CreateUserBody = {
    username?: string;
    password?: string;
};

function normalizeUsername(raw: string) {
    return raw.trim().toLowerCase();
}

function isValidUsername(username: string) {
    return /^[a-z0-9._-]{3,40}$/.test(username);
}

export async function GET(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const users = await listAdminUsers();

    return NextResponse.json({ users });
}

export async function POST(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const body = (await request.json()) as CreateUserBody;
        const usernameRaw = body.username ?? '';
        const password = body.password ?? '';
        const username = normalizeUsername(usernameRaw);

        if (!isValidUsername(username)) {
            return NextResponse.json(
                {
                    message:
                        'Username harus 3-40 karakter (huruf kecil, angka, titik, strip, underscore).',
                },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: 'Password minimal 8 karakter.' },
                { status: 400 }
            );
        }

        const passwordHash = await hash(password, 10);
        const creationResult = await createAdminUser(username, passwordHash);

        if (creationResult === 'exists') {
            return NextResponse.json(
                { message: 'Username sudah dipakai.' },
                { status: 409 }
            );
        }

        return NextResponse.json({ message: 'User admin berhasil ditambahkan.' });
    } catch (error) {
        console.error('Create admin user error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menambahkan user.' },
            { status: 500 }
        );
    }
}
