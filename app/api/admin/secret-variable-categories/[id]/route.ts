import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    deleteSecretVariableCategoryById,
    updateSecretVariableCategoryById,
    UpsertSecretCategoryInput,
} from '@/app/lib/secret-variables';

type RouteParams = {
    params: Promise<{ id: string }>;
};

type SecretCategoryPayload = Partial<UpsertSecretCategoryInput>;

function getValidatedId(rawId: string) {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

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

export async function PUT(request: Request, { params }: RouteParams) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const { id: rawId } = await params;
    const id = getValidatedId(rawId);

    if (!id) {
        return NextResponse.json(
            { message: 'ID kategori tidak valid.' },
            { status: 400 },
        );
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

        const updated = await updateSecretVariableCategoryById(id, payload);

        if (!updated) {
            return NextResponse.json(
                { message: 'Kategori tidak ditemukan.' },
                { status: 404 },
            );
        }

        return NextResponse.json({ message: 'Kategori berhasil diperbarui.' });
    } catch (error) {
        console.error('Update secret variable category error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat update kategori.' },
            { status: 500 },
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
            { message: 'ID kategori tidak valid.' },
            { status: 400 },
        );
    }

    try {
        const result = await deleteSecretVariableCategoryById(id);

        if (result === 'has_variables') {
            return NextResponse.json(
                {
                    message:
                        'Kategori masih memiliki data Secret Variable. Pindahkan atau hapus data terlebih dahulu.',
                },
                { status: 409 },
            );
        }

        if (result === 'not_found') {
            return NextResponse.json(
                { message: 'Kategori tidak ditemukan.' },
                { status: 404 },
            );
        }

        return NextResponse.json({ message: 'Kategori berhasil dihapus.' });
    } catch (error) {
        console.error('Delete secret variable category error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menghapus kategori.' },
            { status: 500 },
        );
    }
}
