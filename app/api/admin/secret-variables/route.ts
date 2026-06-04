import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    createSecretVariable,
    listSecretVariableCategories,
    listSecretVariables,
    reorderSecretVariables,
    ReorderSecretVariableInput,
    UpsertSecretVariableInput,
} from '@/app/lib/secret-variables';

type SecretVariablePayload = Partial<UpsertSecretVariableInput>;
type ReorderPayload = {
    order?: Array<Partial<ReorderSecretVariableInput>>;
};

function normalizePayload(body: SecretVariablePayload): UpsertSecretVariableInput {
    return {
        category: (body.category ?? 'Notes Secret').trim(),
        name: (body.name ?? '').trim(),
        value: body.value ?? '',
        description: (body.description ?? '').trim(),
    };
}

function validatePayload(payload: UpsertSecretVariableInput) {
    if (!payload.name) {
        return 'Judul wajib diisi.';
    }

    if (payload.name.length > 120) {
        return 'Judul maksimal 120 karakter.';
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
        const validationMessage = validatePayload(payload);

        if (validationMessage) {
            return NextResponse.json(
                { message: validationMessage },
                { status: 400 },
            );
        }

        const result = await createSecretVariable(payload);

        return NextResponse.json({
            message: 'Notes Secret berhasil dibuat.',
            id: result.id,
        });
    } catch (error) {
        console.error('Create notes secret error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat membuat Notes Secret.' },
            { status: 500 },
        );
    }
}

export async function PATCH(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const body = (await request.json()) as ReorderPayload;
        const order = body.order ?? [];
        const normalized = order
            .map((item) => ({
                id: Number(item.id),
                displayOrder: Number(item.displayOrder),
            }))
            .filter((item) => Number.isInteger(item.id) && item.id > 0 && Number.isInteger(item.displayOrder));

        if (normalized.length !== order.length) {
            return NextResponse.json(
                { message: 'Urutan Notes Secret tidak valid.' },
                { status: 400 },
            );
        }

        await reorderSecretVariables(normalized);

        return NextResponse.json({
            message: 'Urutan Notes Secret berhasil disimpan.',
        });
    } catch (error) {
        console.error('Reorder notes secret error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menyimpan urutan Notes Secret.' },
            { status: 500 },
        );
    }
}
