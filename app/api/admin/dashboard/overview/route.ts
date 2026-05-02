import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import { getDashboardOverviewMetrics } from '@/app/lib/admin-metrics';

export async function GET(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const overview = await getDashboardOverviewMetrics();
        return NextResponse.json({ overview });
    } catch (error) {
        console.error('Get dashboard overview error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat memuat ringkasan dashboard.' },
            { status: 500 }
        );
    }
}
