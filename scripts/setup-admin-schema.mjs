import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { hash } from 'bcryptjs';
import { Client } from 'pg';

const baseDbUrl = process.env.DB_URL;

if (!baseDbUrl) {
    throw new Error('DB_URL harus diisi. Contoh: postgresql://user:pass@host:5432/');
}

const normalizedBase = baseDbUrl.endsWith('/') ? baseDbUrl : `${baseDbUrl}/`;
const adminDbUrl = `${normalizedBase}postgres`;
const appDbUrl = `${normalizedBase}bangun_website`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adminSeedUsername = (process.env.ADMIN_SEED_USERNAME || 'admin').trim();
const adminSeedPassword = (process.env.ADMIN_SEED_PASSWORD || '').trim();

async function loadStaticBlogPosts() {
    const sourceFile = path.resolve(__dirname, '../app/data/blog-posts.ts');
    const rawSource = await fs.readFile(sourceFile, 'utf8');

    const marker = 'export const blogPosts: BlogPost[] =';
    const markerIndex = rawSource.indexOf(marker);

    if (markerIndex < 0) {
        throw new Error('Tidak menemukan export blogPosts pada app/data/blog-posts.ts');
    }

    const arrayStart = rawSource.indexOf('[', markerIndex + marker.length);
    const arrayEnd = rawSource.lastIndexOf('];');

    if (arrayStart < 0 || arrayEnd < 0 || arrayEnd <= arrayStart) {
        throw new Error('Format app/data/blog-posts.ts tidak dikenali');
    }

    const jsonArrayText = rawSource.slice(arrayStart, arrayEnd + 1);
    const parsed = JSON.parse(jsonArrayText);

    if (!Array.isArray(parsed)) {
        throw new Error('blogPosts harus berupa array');
    }

    return parsed;
}

async function ensureDatabase() {
    const client = new Client({ connectionString: adminDbUrl });
    await client.connect();

    const dbCheck = await client.query(
        'SELECT 1 FROM pg_database WHERE datname = $1 LIMIT 1',
        ['bangun_website']
    );

    if (dbCheck.rowCount === 0) {
        await client.query('CREATE DATABASE bangun_website');
        console.log('Database bangun_website berhasil dibuat');
    } else {
        console.log('Database bangun_website sudah ada');
    }

    await client.end();
}

async function setupSchemaAndSeed() {
    const client = new Client({ connectionString: appDbUrl });
    await client.connect();

    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS traffic_daily_visitors (
            id BIGSERIAL PRIMARY KEY,
            visit_date DATE NOT NULL,
            visitor_key CHAR(64) NOT NULL,
            visitor_id VARCHAR(128) NOT NULL,
            ip_address VARCHAR(80),
            user_agent TEXT,
            source_label VARCHAR(80) NOT NULL,
            source_host VARCHAR(255),
            referrer TEXT,
            landing_path TEXT NOT NULL,
            first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE (visit_date, visitor_key)
        )
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS blog_posts (
            id BIGSERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            slug VARCHAR(220) UNIQUE NOT NULL,
            summary TEXT NOT NULL,
            content TEXT NOT NULL,
            author VARCHAR(120) NOT NULL DEFAULT 'Tim Bangunwebsite.id',
            image TEXT,
            categories TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
            published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    // Cleanup duplicates before enforcing stronger unique indexes.
    await client.query(`
        DELETE FROM traffic_daily_visitors t
        USING (
            SELECT id
            FROM (
                SELECT
                    id,
                    ROW_NUMBER() OVER (
                        PARTITION BY visit_date, visitor_id
                        ORDER BY first_seen_at ASC, id ASC
                    ) AS rn
                FROM traffic_daily_visitors
            ) ranked
            WHERE ranked.rn > 1
        ) dup
        WHERE t.id = dup.id
    `);

    await client.query(`
        DELETE FROM traffic_daily_visitors t
        USING (
            SELECT id
            FROM (
                SELECT
                    id,
                    ROW_NUMBER() OVER (
                        PARTITION BY visit_date, ip_address
                        ORDER BY first_seen_at ASC, id ASC
                    ) AS rn
                FROM traffic_daily_visitors
                WHERE ip_address IS NOT NULL
            ) ranked
            WHERE ranked.rn > 1
        ) dup
        WHERE t.id = dup.id
    `);

    await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS uq_traffic_daily_visitors_date_visitor
        ON traffic_daily_visitors (visit_date, visitor_id)
    `);

    await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS uq_traffic_daily_visitors_date_ip
        ON traffic_daily_visitors (visit_date, ip_address)
        WHERE ip_address IS NOT NULL
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_traffic_daily_visitors_visit_date
        ON traffic_daily_visitors (visit_date)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_traffic_daily_visitors_source
        ON traffic_daily_visitors (source_label)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_traffic_daily_visitors_landing_path
        ON traffic_daily_visitors (landing_path)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
        ON blog_posts (published_at DESC)
    `);

    await client.query(`
        CREATE INDEX IF NOT EXISTS idx_blog_posts_categories
        ON blog_posts USING GIN (categories)
    `);

    if (adminSeedPassword) {
        const adminPasswordHash = await hash(adminSeedPassword, 10);

        await client.query(
            `
                INSERT INTO users (username, password_hash)
                VALUES ($1, $2)
                ON CONFLICT (username)
                DO UPDATE SET
                    password_hash = EXCLUDED.password_hash,
                    updated_at = NOW()
            `,
            [adminSeedUsername, adminPasswordHash]
        );
    } else {
        console.log(
            'ADMIN_SEED_PASSWORD tidak diisi. Lewati update password seed admin.'
        );
    }

    const users = await client.query(
        'SELECT id, username, created_at, updated_at FROM users ORDER BY id'
    );

    console.log('Seed user admin selesai. Users:', users.rows);

    const staticBlogPosts = await loadStaticBlogPosts();

    for (const item of staticBlogPosts) {
        const title =
            typeof item.title === 'string' && item.title.trim()
                ? item.title.trim()
                : '';
        const slug =
            typeof item.slug === 'string' && item.slug.trim()
                ? item.slug.trim()
                : '';
        const summary =
            typeof item.summary === 'string' ? item.summary.trim() : '';
        const content = typeof item.content === 'string' ? item.content : '';
        const author =
            typeof item.author === 'string' && item.author.trim()
                ? item.author.trim()
                : 'Tim Bangunwebsite.id';
        const image = typeof item.image === 'string' ? item.image.trim() : '';
        const categories = Array.isArray(item.categories)
            ? item.categories
                  .map((category) =>
                      typeof category === 'string' ? category.trim() : ''
                  )
                  .filter(Boolean)
            : [];
        const publishedAtRaw =
            typeof item.date === 'string' && item.date.trim()
                ? item.date.trim()
                : new Date().toISOString();
        const publishedAt = Number.isNaN(Date.parse(publishedAtRaw))
            ? new Date().toISOString()
            : publishedAtRaw;

        if (!title || !slug || !summary || !content) {
            continue;
        }

        await client.query(
            `
                INSERT INTO blog_posts (
                    title,
                    slug,
                    summary,
                    content,
                    author,
                    image,
                    categories,
                    published_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7::text[], $8::timestamptz)
                ON CONFLICT (slug)
                DO UPDATE SET
                    title = EXCLUDED.title,
                    summary = EXCLUDED.summary,
                    content = EXCLUDED.content,
                    author = EXCLUDED.author,
                    image = EXCLUDED.image,
                    categories = EXCLUDED.categories,
                    published_at = EXCLUDED.published_at,
                    updated_at = NOW()
            `,
            [
                title,
                slug,
                summary,
                content,
                author,
                image || null,
                categories,
                publishedAt,
            ]
        );
    }

    const blogCount = await client.query(
        'SELECT COUNT(*)::text AS total FROM blog_posts'
    );
    console.log(
        `Seed blog selesai. Total artikel: ${Number(blogCount.rows[0]?.total ?? 0)}`
    );

    await client.end();
}

await ensureDatabase();
await setupSchemaAndSeed();
