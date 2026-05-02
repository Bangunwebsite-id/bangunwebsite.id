import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { dbPool } from '@/app/lib/db';
import {
    TRAFFIC_VISITOR_COOKIE,
    TRAFFIC_VISITOR_COOKIE_MAX_AGE,
    buildVisitorKey,
    detectTrafficSource,
    getClientIp,
} from '@/app/lib/traffic';

type TrafficHitBody = {
    path?: string;
    referrer?: string | null;
    utmSource?: string | null;
};

function shouldTrackPath(pathname: string) {
    if (!pathname || !pathname.startsWith('/')) {
        return false;
    }

    const blockedPrefixes = ['/admin', '/api', '/_next'];

    return !blockedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as TrafficHitBody;
        const landingPath = body.path?.trim() ?? request.nextUrl.pathname;

        if (!shouldTrackPath(landingPath)) {
            return NextResponse.json({ tracked: false });
        }

        const cookieVisitorId = request.cookies.get(TRAFFIC_VISITOR_COOKIE)?.value;
        const visitorId = cookieVisitorId || randomUUID();
        const visitorKey = buildVisitorKey(visitorId);

        const ipAddress = getClientIp(request);
        const userAgent = request.headers.get('user-agent') ?? null;
        const referrer =
            typeof body.referrer === 'string' && body.referrer.trim()
                ? body.referrer.trim()
                : request.headers.get('referer');
        const utmSource =
            typeof body.utmSource === 'string' && body.utmSource.trim()
                ? body.utmSource.trim()
                : null;

        const source = detectTrafficSource(referrer, utmSource);
        const timezone = process.env.APP_TIMEZONE ?? 'UTC';

        await dbPool.query(
            `
                INSERT INTO traffic_daily_visitors (
                    visit_date,
                    visitor_key,
                    visitor_id,
                    ip_address,
                    user_agent,
                    source_label,
                    source_host,
                    referrer,
                    landing_path
                )
                SELECT
                    (NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM traffic_daily_visitors t
                    WHERE t.visit_date = (NOW() AT TIME ZONE COALESCE($1, 'UTC'))::date
                      AND (
                          t.visitor_id = $3
                          OR ($4 IS NOT NULL AND t.ip_address = $4)
                      )
                )
                ON CONFLICT DO NOTHING
            `,
            [
                timezone,
                visitorKey,
                visitorId,
                ipAddress,
                userAgent,
                source.sourceLabel,
                source.sourceHost,
                referrer,
                landingPath,
            ]
        );

        const response = NextResponse.json({ tracked: true });

        if (!cookieVisitorId) {
            response.cookies.set({
                name: TRAFFIC_VISITOR_COOKIE,
                value: visitorId,
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: TRAFFIC_VISITOR_COOKIE_MAX_AGE,
            });
        }

        return response;
    } catch (error) {
        console.error('Traffic tracking error:', error);
        return NextResponse.json({ tracked: false }, { status: 200 });
    }
}
