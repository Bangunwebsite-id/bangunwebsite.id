import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { LoginForm } from './login-form';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/app/lib/auth';

export default async function AdminLoginPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifySessionToken(token);

    if (session) {
        redirect('/admin/dashboard');
    }

    return <LoginForm />;
}
