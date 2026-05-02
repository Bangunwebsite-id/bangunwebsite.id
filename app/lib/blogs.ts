import { unstable_noStore as noStore } from 'next/cache';

import { dbPool } from './db';

export type BlogPostRecord = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    author: string;
    image: string | null;
    categories: string[] | null;
    published_at: Date;
    created_at: Date;
    updated_at: Date;
};

export type PublicBlogPost = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    author: string;
    image: string;
    categories: string[];
    published_at: string;
};

export type AdminBlogPostListItem = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    author: string;
    image: string;
    categories: string[];
    published_at: Date;
    created_at: Date;
    updated_at: Date;
};

export type UpsertBlogPostInput = {
    title: string;
    slug: string;
    summary: string;
    content: string;
    author: string;
    image: string;
    categories: string[];
    publishedAt: string;
};

function normalizeCategories(categories: string[] | null | undefined) {
    if (!categories || categories.length === 0) {
        return [] as string[];
    }

    const unique = new Set<string>();

    for (const category of categories) {
        const cleaned = category.trim();
        if (cleaned) {
            unique.add(cleaned);
        }
    }

    return Array.from(unique);
}

function mapRecordToPublicPost(row: BlogPostRecord): PublicBlogPost {
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        content: row.content,
        author: row.author,
        image: row.image ?? '',
        categories: normalizeCategories(row.categories),
        published_at: row.published_at.toISOString(),
    };
}

export async function listPublishedBlogPosts(limit?: number, offset?: number) {
    noStore();

    const params: Array<number> = [];
    let limitClause = '';
    let offsetClause = '';

    if (limit && Number.isFinite(limit) && limit > 0) {
        params.push(limit);
        limitClause = `LIMIT $${params.length}`;
    }

    if (offset && Number.isFinite(offset) && offset >= 0) {
        params.push(offset);
        offsetClause = `OFFSET $${params.length}`;
    }

    const result = await dbPool.query<BlogPostRecord>(
        `
            SELECT
                id,
                title,
                slug,
                summary,
                content,
                author,
                image,
                categories,
                published_at,
                created_at,
                updated_at
            FROM blog_posts
            ORDER BY published_at DESC, id DESC
            ${limitClause}
            ${offsetClause}
        `,
        params,
    );

    return result.rows.map(mapRecordToPublicPost);
}

export async function countPublishedBlogPosts() {
    noStore();
    const result = await dbPool.query<{ total: string }>(
        'SELECT COUNT(*) as total FROM blog_posts',
    );
    return parseInt(result.rows[0]?.total ?? '0', 10);
}

export async function getPublishedBlogPostBySlug(slug: string) {
    noStore();

    const result = await dbPool.query<BlogPostRecord>(
        `
            SELECT
                id,
                title,
                slug,
                summary,
                content,
                author,
                image,
                categories,
                published_at,
                created_at,
                updated_at
            FROM blog_posts
            WHERE slug = $1
            LIMIT 1
        `,
        [slug],
    );

    const row = result.rows[0];
    return row ? mapRecordToPublicPost(row) : null;
}

export async function listRelatedBlogPosts(
    slug: string,
    categories: string[] = [],
    limit = 3,
) {
    noStore();

    // Prioritize posts that share at least one category, then by date
    const result = await dbPool.query<BlogPostRecord>(
        `
            SELECT
                id,
                title,
                slug,
                summary,
                content,
                author,
                image,
                categories,
                published_at,
                created_at,
                updated_at,
                (
                    SELECT COUNT(*)
                    FROM unnest(categories) AS c
                    WHERE c = ANY($2::text[])
                ) as match_count
            FROM blog_posts
            WHERE slug <> $1
            ORDER BY match_count DESC, published_at DESC, id DESC
            LIMIT $3
        `,
        [slug, categories, limit],
    );

    return result.rows.map(mapRecordToPublicPost);
}

export async function listAdminBlogPosts() {
    const result = await dbPool.query<AdminBlogPostListItem>(
        `
            SELECT
                id,
                title,
                slug,
                summary,
                content,
                author,
                COALESCE(image, '') AS image,
                COALESCE(categories, ARRAY[]::text[]) AS categories,
                published_at,
                created_at,
                updated_at
            FROM blog_posts
            ORDER BY published_at DESC, id DESC
        `,
    );

    return result.rows.map((item) => ({
        ...item,
        categories: normalizeCategories(item.categories),
    }));
}

export async function createBlogPost(input: UpsertBlogPostInput) {
    try {
        const result = await dbPool.query<{ id: number }>(
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
                RETURNING id
            `,
            [
                input.title,
                input.slug,
                input.summary,
                input.content,
                input.author,
                input.image || null,
                normalizeCategories(input.categories),
                input.publishedAt,
            ],
        );

        return { status: 'created' as const, id: result.rows[0]?.id ?? 0 };
    } catch (error) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23505'
        ) {
            return { status: 'slug_exists' as const };
        }

        throw error;
    }
}

export async function updateBlogPostById(
    id: number,
    input: UpsertBlogPostInput,
) {
    try {
        const result = await dbPool.query<{ id: number }>(
            `
                UPDATE blog_posts
                SET
                    title = $2,
                    slug = $3,
                    summary = $4,
                    content = $5,
                    author = $6,
                    image = $7,
                    categories = $8::text[],
                    published_at = $9::timestamptz,
                    updated_at = NOW()
                WHERE id = $1
                RETURNING id
            `,
            [
                id,
                input.title,
                input.slug,
                input.summary,
                input.content,
                input.author,
                input.image || null,
                normalizeCategories(input.categories),
                input.publishedAt,
            ],
        );

        if ((result.rowCount ?? 0) === 0) {
            return { status: 'not_found' as const };
        }

        return { status: 'updated' as const };
    } catch (error) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23505'
        ) {
            return { status: 'slug_exists' as const };
        }

        throw error;
    }
}

export async function listAllBlogPostSlugs() {
    const result = await dbPool.query<{ slug: string }>(
        'SELECT slug FROM blog_posts ORDER BY published_at DESC'
    );
    return result.rows.map((row) => row.slug);
}

export async function deleteBlogPostById(id: number) {
    const result = await dbPool.query(
        `
            DELETE FROM blog_posts
            WHERE id = $1
        `,
        [id],
    );

    return (result.rowCount ?? 0) > 0;
}
