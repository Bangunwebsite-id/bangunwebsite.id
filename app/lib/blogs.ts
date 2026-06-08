import { unstable_noStore as noStore } from 'next/cache';
import { cache } from 'react';

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

type PublicBlogPostListRecord = Omit<BlogPostRecord, 'content'>;

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
        id: Number(row.id),
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

function mapRecordToPublicPostListItem(
    row: PublicBlogPostListRecord
): PublicBlogPost {
    return {
        id: Number(row.id),
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        content: '',
        author: row.author,
        image: row.image ?? '',
        categories: normalizeCategories(row.categories),
        published_at: row.published_at.toISOString(),
    };
}

function mapRecordToAdminPost(row: AdminBlogPostListItem): AdminBlogPostListItem {
    return {
        ...row,
        id: Number(row.id),
        image: row.image ?? '',
        categories: normalizeCategories(row.categories),
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

    const result = await dbPool.query<PublicBlogPostListRecord>(
        `
            SELECT
                id,
                title,
                slug,
                summary,
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

    return result.rows.map(mapRecordToPublicPostListItem);
}

export async function countPublishedBlogPosts() {
    noStore();
    const result = await dbPool.query<{ total: string }>(
        'SELECT COUNT(*) as total FROM blog_posts',
    );
    return parseInt(result.rows[0]?.total ?? '0', 10);
}

export const getPublishedBlogPostBySlug = cache(async (slug: string) => {
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
});

export async function listRelatedBlogPosts(
    slug: string,
    categories: string[] = [],
    limit = 3,
) {
    noStore();

    // Prioritize posts that share at least one category, then by date
    const result = await dbPool.query<PublicBlogPostListRecord>(
        `
            SELECT
                id,
                title,
                slug,
                summary,
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

    return result.rows.map(mapRecordToPublicPostListItem);
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

    return result.rows.map(mapRecordToAdminPost);
}

export async function getAdminBlogPostById(id: number) {
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
            WHERE id = $1
            LIMIT 1
        `,
        [id],
    );

    const row = result.rows[0];

    if (!row) {
        return null;
    }

    return mapRecordToAdminPost(row);
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
        console.info('[BlogAdmin][DB] update start', {
            id,
            title: input.title,
            slug: input.slug,
            summaryLength: input.summary.length,
            contentLength: input.content.length,
            image: input.image,
            categories: normalizeCategories(input.categories),
            publishedAt: input.publishedAt,
        });

        const result = await dbPool.query<AdminBlogPostListItem>(
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
                RETURNING
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

        const rowCount = result.rowCount ?? 0;

        console.info('[BlogAdmin][DB] update result', {
            id,
            rowCount,
            returnedId: result.rows[0]?.id,
            returnedTitle: result.rows[0]?.title,
            returnedSlug: result.rows[0]?.slug,
            returnedSummaryLength: result.rows[0]?.summary.length,
            returnedContentLength: result.rows[0]?.content.length,
        });

        if (rowCount === 0 || !result.rows[0]) {
            return { status: 'not_found' as const };
        }

        return { status: 'updated' as const, post: mapRecordToAdminPost(result.rows[0]) };
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
