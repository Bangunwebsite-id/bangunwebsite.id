import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AdminDashboardClient } from './admin-dashboard-client';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/app/lib/auth';
import { listAdminBlogPosts } from '@/app/lib/blogs';
import { getTrafficSummary } from '@/app/lib/admin-metrics';
import { listAdminUsers } from '@/app/lib/users';

export default async function AdminDashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifySessionToken(token);

    if (!session) {
        redirect('/admin/login');
    }

    const [users, trafficSummary, blogPosts] = await Promise.all([
        listAdminUsers(),
        getTrafficSummary(),
        listAdminBlogPosts(),
    ]);

    const serializedUsers = users.map((user) => ({
        ...user,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
    }));
    const serializedBlogPosts = blogPosts.map((post) => ({
        ...post,
        published_at: post.published_at.toISOString(),
        created_at: post.created_at.toISOString(),
        updated_at: post.updated_at.toISOString(),
    }));

    return (
        <AdminDashboardClient
            username={session.username}
            initialUsers={serializedUsers}
            initialBlogPosts={serializedBlogPosts}
            trafficSummary={trafficSummary}
            timezone={process.env.APP_TIMEZONE ?? 'UTC'}
        />
    );
}
