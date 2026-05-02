import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AdminDashboardClient } from './admin-dashboard-client';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/app/lib/auth';
import { getDashboardOverviewMetrics } from '@/app/lib/admin-metrics';

export default async function AdminDashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifySessionToken(token);

    if (!session) {
        redirect('/admin/login');
    }

    const initialOverviewMetrics = await getDashboardOverviewMetrics();

    return (
        <AdminDashboardClient
            username={session.username}
            initialOverviewMetrics={initialOverviewMetrics}
            timezone={process.env.APP_TIMEZONE ?? 'UTC'}
        />
    );
}
