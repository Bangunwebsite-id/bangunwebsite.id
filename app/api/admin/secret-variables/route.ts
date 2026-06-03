import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    createSecretVariable,
    listSecretVariables,
    SecretVariableCategory,
    UpsertSecretVariableInput,
} from '@/app/lib/secret-variables';

type SecretVariablePayload = Partial<UpsertSecretVariableInput>;

const categories = new Set<SecretVariableCategory>([
    'Akses Server',
    'Akses Lain',
]);

function isCategory(value: string): value is SecretVariableCategory {
    return categories.has(value as SecretVariableCategory);
}

function normalizePayload(body: SecretVariablePayload): UpsertSecretVariableInput {
    const category = (body.category ?? '').trim();

    return {
        category: isCategory(category) ? category : 'Akses Lain',
        name: (body.name ?? '').trim(),
        value: body.value ?? '',
        description: (body.description ?? '').trim(),
    };
}

function validatePayload(payload: UpsertSecretVariableInput) {
    if (!categories.has(payload.category)) {
        return 'Kategori secret variable tidak valid.';
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
        const secretVariables = await listSecretVariables();

        return NextResponse.json({
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
        const validationMessage = validatePayload(payload);

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
