import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import { deleteBlogPostById, updateBlogPostById } from '@/app/lib/blogs';

type BlogPayload = {
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    author?: string;
    image?: string;
    categories?: string[] | string;
    publishedAt?: string;
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

function normalizePayload(body: BlogPayload) {
    const title = (body.title ?? '').trim();
    const summary = (body.summary ?? '').trim();
    const content = (body.content ?? '').trim();
    const author = (body.author ?? 'Tim Bangunwebsite.id').trim();
    const image = (body.image ?? '').trim();
    const categories = normalizeCategories(body.categories);
    const slug = slugify((body.slug ?? '').trim()) || slugify(title);
    const publishedAt = (body.publishedAt ?? '').trim() || new Date().toISOString();

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
        const payload = normalizePayload(body);

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

        return NextResponse.json({ message: 'Artikel berhasil diperbarui.' });
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
        const deleted = await deleteBlogPostById(id);

        if (!deleted) {
            return NextResponse.json(
                { message: 'Artikel tidak ditemukan.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Artikel berhasil dihapus.' });
    } catch (error) {
        console.error('Delete blog post error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menghapus artikel.' },
            { status: 500 }
        );
    }
}
