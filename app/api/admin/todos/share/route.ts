import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import { getPublicSiteConfig } from '@/app/lib/site-config';
import { getOrCreateTodoShareToken } from '@/app/lib/todos';

export async function POST(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const token = await getOrCreateTodoShareToken();
        const { siteUrl } = getPublicSiteConfig();

        return NextResponse.json({
            token,
            url: `${siteUrl}/share/todo/${token}`,
        });
    } catch (error) {
        console.error('Create todo share link error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat membuat link share.' },
            { status: 500 },
        );
    }
}
