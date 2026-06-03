import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    createSecretVariableCategory,
    listSecretVariableCategories,
    UpsertSecretCategoryInput,
} from '@/app/lib/secret-variables';

type SecretCategoryPayload = Partial<UpsertSecretCategoryInput>;

function normalizePayload(body: SecretCategoryPayload): UpsertSecretCategoryInput {
    return {
        name: (body.name ?? '').trim(),
        description: (body.description ?? '').trim(),
    };
}

function validatePayload(payload: UpsertSecretCategoryInput) {
    if (!payload.name) {
        return 'Nama kategori wajib diisi.';
    }

    if (payload.name.length > 80) {
        return 'Nama kategori maksimal 80 karakter.';
    }

    return null;
}

function serializeDate(value: Date) {
    return value.toISOString();
}

export async function GET(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const categories = await listSecretVariableCategories();

        return NextResponse.json({
            categories: categories.map((item) => ({
                ...item,
                created_at: serializeDate(item.created_at),
                updated_at: serializeDate(item.updated_at),
            })),
        });
    } catch (error) {
        console.error('List secret variable categories error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat memuat kategori secret variable.' },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const body = (await request.json()) as SecretCategoryPayload;
        const payload = normalizePayload(body);
        const validationMessage = validatePayload(payload);

        if (validationMessage) {
            return NextResponse.json(
                { message: validationMessage },
                { status: 400 },
            );
        }

        const result = await createSecretVariableCategory(payload);

        return NextResponse.json({
            message: 'Kategori berhasil dibuat.',
            id: result.id,
        });
    } catch (error) {
        console.error('Create secret variable category error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat membuat kategori.' },
            { status: 500 },
        );
    }
}
