import { UsersPanel } from './users-panel';
import { listAdminUsers } from '@/app/lib/users';

export default async function AdminUsersPage() {
    const users = await listAdminUsers();
    const initialUsers = users.map((user) => ({
        id: user.id,
        username: user.username,
        created_at: new Date(user.created_at).toISOString(),
        updated_at: new Date(user.updated_at).toISOString(),
    }));

    return <UsersPanel initialUsers={initialUsers} />;
}
