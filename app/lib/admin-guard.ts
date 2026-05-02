import { NextResponse } from 'next/server';

import { getSessionFromCookieHeader } from './auth';

export function getAdminSessionFromRequest(request: Request) {
    return getSessionFromCookieHeader(request.headers.get('cookie'));
}

export function ensureAdminSession(request: Request) {
    const session = getAdminSessionFromRequest(request);

    if (!session) {
        return {
            session: null,
            unauthorizedResponse: NextResponse.json(
                { message: 'Sesi admin tidak valid. Silakan login ulang.' },
                { status: 401 }
            ),
        };
    }

    return {
        session,
        unauthorizedResponse: null,
    };
}
