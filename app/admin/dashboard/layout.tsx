import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { DashboardShell } from './dashboard-shell';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/app/lib/auth';

export default async function AdminDashboardLayout({
    children,
}: LayoutProps<'/admin/dashboard'>) {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifySessionToken(token);

    if (!session) {
        redirect('/admin/login');
    }

    return <DashboardShell username={session.username}>{children}</DashboardShell>;
}
