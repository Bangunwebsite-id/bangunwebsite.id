import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    deleteBlogPostById,
    getAdminBlogPostById,
    updateBlogPostById,
} from '@/app/lib/blogs';

type BlogPayload = {
    id?: number | string;
    title?: string;
    slug?: string;
    summary?: string;
    excerpt?: string;
    content?: string;
    author?: string;
    image?: string;
    imagePath?: string;
    categories?: string[] | string;
    category?: string[] | string;
    publishedAt?: string;
    publishedDate?: string;
    status?: string;
};

type RouteParams = {
    params: Promise<{ id: string }>;
};

function slugify(raw: string) {
    return raw
        .toLowerCase()
        .trim()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function normalizeCategories(input: BlogPayload['categories']) {
    const rawValues = Array.isArray(input) ? input : (input ?? '').split(',');
    const unique = new Set<string>();

    for (const rawValue of rawValues) {
        const cleaned = rawValue.trim();
        if (cleaned) {
            unique.add(cleaned);
        }
    }

    return Array.from(unique);
}

function isValidSlug(slug: string) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function normalizePayload(
    body: BlogPayload,
    existing: NonNullable<Awaited<ReturnType<typeof getAdminBlogPostById>>>,
) {
    const title = (body.title ?? existing.title).trim();
    const summary = (body.summary ?? body.excerpt ?? existing.summary).trim();
    const content = (body.content ?? existing.content).trim();
    const author = (body.author ?? existing.author).trim();
    const image = (body.image ?? body.imagePath ?? existing.image).trim();
    const categories = normalizeCategories(
        body.categories ?? body.category ?? existing.categories
    );
    const slug = slugify((body.slug ?? existing.slug).trim()) || existing.slug;
    const publishedAt =
        (body.publishedAt ?? body.publishedDate ?? '').trim() ||
        existing.published_at.toISOString();

    return {
        title,
        slug,
        summary,
        content,
        author,
        image,
        categories,
        publishedAt,
    };
}

function getValidatedId(rawId: string) {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

function serializeAdminPost(
    post: NonNullable<Awaited<ReturnType<typeof getAdminBlogPostById>>>
) {
    return {
        ...post,
        published_at: post.published_at.toISOString(),
        created_at: post.created_at.toISOString(),
        updated_at: post.updated_at.toISOString(),
    };
}

export async function PUT(request: Request, { params }: RouteParams) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const { id: rawId } = await params;
    const id = getValidatedId(rawId);

    if (!id) {
        return NextResponse.json(
            { message: 'ID artikel tidak valid.' },
            { status: 400 }
        );
    }

    try {
        const body = (await request.json()) as BlogPayload;
        console.info('[BlogAdmin][API] update request', {
            routeId: id,
            payloadId: body.id,
            title: body.title,
            slug: body.slug,
            excerpt: body.excerpt ?? body.summary,
            contentLength: body.content?.length,
            category: body.category ?? body.categories,
            image: body.imagePath ?? body.image,
            publishedAt: body.publishedDate ?? body.publishedAt,
            status: body.status,
        });

        if (body.id !== undefined && Number(body.id) !== id) {
            return NextResponse.json(
                { message: 'ID artikel pada payload tidak sesuai URL.' },
                { status: 400 }
            );
        }

        const existing = await getAdminBlogPostById(id);

        if (!existing) {
            return NextResponse.json(
                { message: 'Artikel tidak ditemukan.' },
                { status: 404 }
            );
        }

        const previousSlug = existing.slug;
        const payload = normalizePayload(body, existing);

        console.info('[BlogAdmin][API] normalized update payload', {
            id,
            title: payload.title,
            slug: payload.slug,
            summaryLength: payload.summary.length,
            contentLength: payload.content.length,
            author: payload.author,
            image: payload.image,
            categories: payload.categories,
            publishedAt: payload.publishedAt,
            previousSlug,
        });

        if (payload.title.length < 8) {
            return NextResponse.json(
                { message: 'Judul minimal 8 karakter.' },
                { status: 400 }
            );
        }

        if (!isValidSlug(payload.slug)) {
            return NextResponse.json(
                {
                    message:
                        'Slug hanya boleh huruf kecil, angka, dan tanda minus.',
                },
                { status: 400 }
            );
        }

        if (payload.summary.length < 20) {
            return NextResponse.json(
                { message: 'Ringkasan minimal 20 karakter.' },
                { status: 400 }
            );
        }

        if (payload.content.length < 40) {
            return NextResponse.json(
                { message: 'Konten artikel minimal 40 karakter.' },
                { status: 400 }
            );
        }

        if (!Date.parse(payload.publishedAt)) {
            return NextResponse.json(
                { message: 'Tanggal publikasi tidak valid.' },
                { status: 400 }
            );
        }

        const result = await updateBlogPostById(id, payload);

        if (result.status === 'not_found') {
            return NextResponse.json(
                { message: 'Artikel tidak ditemukan.' },
                { status: 404 }
            );
        }

        if (result.status === 'slug_exists') {
            return NextResponse.json(
                { message: 'Slug sudah dipakai artikel lain.' },
                { status: 409 }
            );
        }

        if (!result.post) {
            return NextResponse.json(
                { message: 'Artikel berhasil diperbarui, tetapi data terbaru gagal dimuat.' },
                { status: 500 }
            );
        }

        revalidatePath('/blog');
        revalidatePath(`/blog/${previousSlug}`);
        revalidatePath(`/blog/${result.post.slug}`);

        console.info('[BlogAdmin][API] update response', {
            id,
            status: result.status,
            returnedId: result.post.id,
            returnedTitle: result.post.title,
            returnedSlug: result.post.slug,
            returnedSummaryLength: result.post.summary.length,
            returnedContentLength: result.post.content.length,
            returnedCategories: result.post.categories,
            returnedImage: result.post.image,
        });

        return NextResponse.json({
            message: 'Artikel berhasil diperbarui.',
            post: serializeAdminPost(result.post),
        });
    } catch (error) {
        console.error('Update blog post error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat update artikel.' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const { id: rawId } = await params;
    const id = getValidatedId(rawId);

    if (!id) {
        return NextResponse.json(
            { message: 'ID artikel tidak valid.' },
            { status: 400 }
        );
    }

    try {
        const existing = await getAdminBlogPostById(id);

        if (!existing) {
            return NextResponse.json(
                { message: 'Artikel tidak ditemukan.' },
                { status: 404 }
            );
        }

        const deleted = await deleteBlogPostById(id);

        if (!deleted) {
            return NextResponse.json(
                { message: 'Artikel tidak ditemukan.' },
                { status: 404 }
            );
        }

        revalidatePath('/blog');
        revalidatePath(`/blog/${existing.slug}`);

        return NextResponse.json({ message: 'Artikel berhasil dihapus.' });
    } catch (error) {
        console.error('Delete blog post error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menghapus artikel.' },
            { status: 500 }
        );
    }
}
