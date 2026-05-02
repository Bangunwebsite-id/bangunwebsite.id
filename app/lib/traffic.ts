import { createHash } from 'crypto';

export const TRAFFIC_VISITOR_COOKIE = 'bw_vid';
export const TRAFFIC_VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type TrafficSource = {
    sourceLabel: string;
    sourceHost: string | null;
};

function normalizeHostname(hostname: string) {
    return hostname.toLowerCase().replace(/^www\./, '');
}

export function detectTrafficSource(
    referrer: string | null | undefined,
    utmSource: string | null | undefined
): TrafficSource {
    if (utmSource?.trim()) {
        return {
            sourceLabel: `utm:${utmSource.trim().toLowerCase()}`,
            sourceHost: null,
        };
    }

    if (!referrer) {
        return {
            sourceLabel: 'direct',
            sourceHost: null,
        };
    }

    try {
        const sourceHost = normalizeHostname(new URL(referrer).hostname);

        if (sourceHost.includes('google.')) {
            return { sourceLabel: 'google', sourceHost };
        }
        if (sourceHost.includes('bing.')) {
            return { sourceLabel: 'bing', sourceHost };
        }
        if (sourceHost.includes('duckduckgo.')) {
            return { sourceLabel: 'duckduckgo', sourceHost };
        }
        if (sourceHost.includes('instagram.')) {
            return { sourceLabel: 'instagram', sourceHost };
        }
        if (sourceHost.includes('facebook.')) {
            return { sourceLabel: 'facebook', sourceHost };
        }
        if (sourceHost.includes('tiktok.')) {
            return { sourceLabel: 'tiktok', sourceHost };
        }
        if (sourceHost.includes('x.com') || sourceHost.includes('twitter.')) {
            return { sourceLabel: 'x-twitter', sourceHost };
        }
        if (sourceHost.includes('youtube.')) {
            return { sourceLabel: 'youtube', sourceHost };
        }
        if (sourceHost.includes('linkedin.')) {
            return { sourceLabel: 'linkedin', sourceHost };
        }
        if (sourceHost.includes('whatsapp.')) {
            return { sourceLabel: 'whatsapp', sourceHost };
        }

        return { sourceLabel: 'referral', sourceHost };
    } catch {
        return {
            sourceLabel: 'direct',
            sourceHost: null,
        };
    }
}

export function getClientIp(request: Request) {
    const forwardedFor = request.headers.get('x-forwarded-for');

    if (forwardedFor) {
        return forwardedFor.split(',')[0]?.trim() ?? null;
    }

    const realIp = request.headers.get('x-real-ip');

    if (realIp) {
        return realIp.trim();
    }

    return null;
}

export function buildVisitorKey(visitorId: string) {
    return createHash('sha256').update(visitorId).digest('hex');
}
