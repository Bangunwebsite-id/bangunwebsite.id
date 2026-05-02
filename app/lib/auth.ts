import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'bw_admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24;

type SessionPayload = {
    username: string;
    exp: number;
};

function getSessionSecret() {
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!secret) {
        throw new Error('ADMIN_SESSION_SECRET is not set in environment variables');
    }

    return secret;
}

function sign(value: string) {
    return createHmac('sha256', getSessionSecret())
        .update(value)
        .digest('base64url');
}

export function createSessionToken(username: string) {
    const payload: SessionPayload = {
        username,
        exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = sign(payloadBase64);

    return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token: string | null | undefined) {
    if (!token) {
        return null;
    }

    const [payloadBase64, signature] = token.split('.');

    if (!payloadBase64 || !signature) {
        return null;
    }

    const expectedSignature = sign(payloadBase64);

    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (actualBuffer.length !== expectedBuffer.length) {
        return null;
    }

    if (!timingSafeEqual(actualBuffer, expectedBuffer)) {
        return null;
    }

    try {
        const payload = JSON.parse(
            Buffer.from(payloadBase64, 'base64url').toString('utf8')
        ) as SessionPayload;

        if (!payload?.username || !payload?.exp) {
            return null;
        }

        if (payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

export function getCookieValueFromHeader(
    cookieHeader: string | null | undefined,
    cookieName: string
) {
    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(';');

    for (const cookie of cookies) {
        const [rawName, ...rawValue] = cookie.trim().split('=');
        if (rawName === cookieName) {
            return decodeURIComponent(rawValue.join('='));
        }
    }

    return null;
}

export function getSessionFromCookieHeader(cookieHeader: string | null | undefined) {
    const token = getCookieValueFromHeader(cookieHeader, ADMIN_SESSION_COOKIE);
    return verifySessionToken(token);
}
