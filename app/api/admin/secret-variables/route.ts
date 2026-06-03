import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    createSecretVariable,
    listSecretVariableCategories,
    listSecretVariables,
    secretVariableCategoryExists,
    UpsertSecretVariableInput,
} from '@/app/lib/secret-variables';

type SecretVariablePayload = Partial<UpsertSecretVariableInput>;

function normalizePayload(body: SecretVariablePayload): UpsertSecretVariableInput {
    return {
        category: (body.category ?? '').trim(),
        name: (body.name ?? '').trim(),
        value: body.value ?? '',
        description: (body.description ?? '').trim(),
    };
}

async function validatePayload(payload: UpsertSecretVariableInput) {
    if (!payload.category) {
        return 'Kategori secret variable wajib dipilih.';
    }

    const categoryExists = await secretVariableCategoryExists(payload.category);

    if (!categoryExists) {
        return 'Kategori secret variable tidak ditemukan.';
    }

    if (!payload.name) {
        return 'Nama variable wajib diisi.';
    }

    if (payload.name.length > 120) {
        return 'Nama variable maksimal 120 karakter.';
    }

    if (!payload.value) {
        return 'Value wajib diisi.';
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
        const [secretVariables, categories] = await Promise.all([
            listSecretVariables(),
            listSecretVariableCategories(),
        ]);

        return NextResponse.json({
            categories: categories.map((item) => ({
                ...item,
                created_at: serializeDate(item.created_at),
                updated_at: serializeDate(item.updated_at),
            })),
            secretVariables: secretVariables.map((item) => ({
                ...item,
                created_at: serializeDate(item.created_at),
                updated_at: serializeDate(item.updated_at),
            })),
        });
    } catch (error) {
        console.error('List secret variables error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat memuat secret variable.' },
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
        const body = (await request.json()) as SecretVariablePayload;
        const payload = normalizePayload(body);
        const validationMessage = await validatePayload(payload);

        if (validationMessage) {
            return NextResponse.json(
                { message: validationMessage },
                { status: 400 },
            );
        }

        const result = await createSecretVariable(payload);

        return NextResponse.json({
            message: 'Secret variable berhasil dibuat.',
            id: result.id,
        });
    } catch (error) {
        console.error('Create secret variable error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat membuat secret variable.' },
            { status: 500 },
        );
    }
}
