import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import { getTrafficSummary } from '@/app/lib/admin-metrics';

export async function GET(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const trafficSummary = await getTrafficSummary();
        return NextResponse.json({ trafficSummary });
    } catch (error) {
        console.error('Get traffic summary error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat memuat data traffic.' },
            { status: 500 }
        );
    }
}
