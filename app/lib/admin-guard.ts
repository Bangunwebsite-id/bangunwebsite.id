import { timingSafeEqual } from 'crypto';

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

function getRequestApiKey(request: Request) {
    const xApiKey = request.headers.get('x-api-key')?.trim();

    if (xApiKey) {
        return xApiKey;
    }

    const authorization = request.headers.get('authorization')?.trim();

    if (!authorization) {
        return null;
    }

    const [scheme, token] = authorization.split(/\s+/, 2);

    if (scheme?.toLowerCase() !== 'bearer' || !token?.trim()) {
        return null;
    }

    return token.trim();
}

function isValidApiKey(providedKey: string, expectedKey: string) {
    const providedBuffer = Buffer.from(providedKey);
    const expectedBuffer = Buffer.from(expectedKey);

    if (providedBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return timingSafeEqual(providedBuffer, expectedBuffer);
}

export function ensureAdminSessionOrApiKey(
    request: Request,
    envVarName = 'BLOG_API_KEY'
) {
    const session = getAdminSessionFromRequest(request);

    if (session) {
        return {
            session,
            authMethod: 'session' as const,
            unauthorizedResponse: null,
        };
    }

    const providedApiKey = getRequestApiKey(request);

    if (!providedApiKey) {
        return {
            session: null,
            authMethod: null,
            unauthorizedResponse: NextResponse.json(
                {
                    message:
                        'Akses ditolak. Gunakan sesi admin atau API key yang valid.',
                },
                { status: 401 }
            ),
        };
    }

    const configuredApiKey = process.env[envVarName]?.trim();

    if (!configuredApiKey) {
        return {
            session: null,
            authMethod: null,
            unauthorizedResponse: NextResponse.json(
                {
                    message: `API key belum dikonfigurasi di server (${envVarName}).`,
                },
                { status: 500 }
            ),
        };
    }

    if (!isValidApiKey(providedApiKey, configuredApiKey)) {
        return {
            session: null,
            authMethod: null,
            unauthorizedResponse: NextResponse.json(
                {
                    message:
                        'API key tidak valid. Pastikan header x-api-key atau Authorization benar.',
                },
                { status: 401 }
            ),
        };
    }

    return {
        session: null,
        authMethod: 'api-key' as const,
        unauthorizedResponse: null,
    };
}
