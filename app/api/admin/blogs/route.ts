import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import { createBlogPost, listAdminBlogPosts } from '@/app/lib/blogs';

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

export async function GET(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const posts = await listAdminBlogPosts();
    const serialized = posts.map((post) => ({
        ...post,
        published_at: post.published_at.toISOString(),
        created_at: post.created_at.toISOString(),
        updated_at: post.updated_at.toISOString(),
    }));

    return NextResponse.json({ posts: serialized });
}

export async function POST(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
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

        const result = await createBlogPost(payload);

        if (result.status === 'slug_exists') {
            return NextResponse.json(
                { message: 'Slug sudah dipakai artikel lain.' },
                { status: 409 }
            );
        }

        revalidatePath('/blog');
        revalidatePath(`/blog/${payload.slug}`);

        return NextResponse.json({
            message: 'Artikel blog berhasil dibuat.',
            id: result.id,
        });
    } catch (error) {
        console.error('Create blog post error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat membuat artikel.' },
            { status: 500 }
        );
    }
}
