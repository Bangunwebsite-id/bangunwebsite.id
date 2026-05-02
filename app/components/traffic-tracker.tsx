'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function shouldTrackPath(pathname: string) {
    const blockedPrefixes = ['/admin', '/api', '/_next'];
    return !blockedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export function TrafficTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!pathname || !shouldTrackPath(pathname)) {
            return;
        }

        const queryString = searchParams.toString();
        const fullPath = queryString ? `${pathname}?${queryString}` : pathname;
        const utmSource = searchParams.get('utm_source');

        const payload = {
            path: fullPath,
            referrer: document.referrer || null,
            utmSource: utmSource || null,
        };

        const body = JSON.stringify(payload);

        if (navigator.sendBeacon) {
            const blob = new Blob([body], { type: 'application/json' });
            navigator.sendBeacon('/api/traffic/hit', blob);
            return;
        }

        fetch('/api/traffic/hit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body,
            keepalive: true,
        }).catch(() => {
            // Silent fail to avoid affecting user navigation flow.
        });
    }, [pathname, searchParams]);

    return null;
}
