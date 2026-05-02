import { Pool } from 'pg';

const baseDbUrl = process.env.DB_URL;

if (!baseDbUrl) {
    throw new Error('DB_URL is not set in environment variables');
}

const normalizedBase = baseDbUrl.endsWith('/') ? baseDbUrl : `${baseDbUrl}/`;
const appDbUrl = process.env.APP_DB_URL ?? `${normalizedBase}bangun_website`;

declare global {
    var __bangunWebsiteDbPool: Pool | undefined;
}

export const dbPool =
    global.__bangunWebsiteDbPool ??
    new Pool({
        connectionString: appDbUrl,
    });

if (process.env.NODE_ENV !== 'production') {
    global.__bangunWebsiteDbPool = dbPool;
}
