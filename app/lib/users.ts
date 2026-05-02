import { dbPool } from './db';

export type UserRecord = {
    id: number;
    username: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
};

export async function findUserByUsername(username: string) {
    const result = await dbPool.query<UserRecord>(
        `
            SELECT id, username, password_hash, created_at, updated_at
            FROM users
            WHERE username = $1
            LIMIT 1
        `,
        [username]
    );

    return result.rows[0] ?? null;
}

export type AdminUserListItem = {
    id: number;
    username: string;
    created_at: Date;
    updated_at: Date;
};

export async function listAdminUsers() {
    const result = await dbPool.query<AdminUserListItem>(
        `
            SELECT id, username, created_at, updated_at
            FROM users
            ORDER BY id ASC
        `
    );

    return result.rows;
}

export async function createAdminUser(
    username: string,
    passwordHash: string
): Promise<'created' | 'exists'> {
    const result = await dbPool.query<{ id: number }>(
        `
            INSERT INTO users (username, password_hash)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING id
        `,
        [username, passwordHash]
    );

    return (result.rowCount ?? 0) > 0 ? 'created' : 'exists';
}
