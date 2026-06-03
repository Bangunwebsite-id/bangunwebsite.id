import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    deleteSecretVariableById,
    secretVariableCategoryExists,
    updateSecretVariableById,
    UpsertSecretVariableInput,
} from '@/app/lib/secret-variables';

type RouteParams = {
    params: Promise<{ id: string }>;
};

type SecretVariablePayload = Partial<UpsertSecretVariableInput>;

function getValidatedId(rawId: string) {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

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

export async function PUT(request: Request, { params }: RouteParams) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const { id: rawId } = await params;
    const id = getValidatedId(rawId);

    if (!id) {
        return NextResponse.json(
            { message: 'ID secret variable tidak valid.' },
            { status: 400 },
        );
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

        const updated = await updateSecretVariableById(id, payload);

        if (!updated) {
            return NextResponse.json(
                { message: 'Secret variable tidak ditemukan.' },
                { status: 404 },
            );
        }

        return NextResponse.json({
            message: 'Secret variable berhasil diperbarui.',
        });
    } catch (error) {
        console.error('Update secret variable error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat update secret variable.' },
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
            { message: 'ID secret variable tidak valid.' },
            { status: 400 },
        );
    }

    try {
        const deleted = await deleteSecretVariableById(id);

        if (!deleted) {
            return NextResponse.json(
                { message: 'Secret variable tidak ditemukan.' },
                { status: 404 },
            );
        }

        return NextResponse.json({
            message: 'Secret variable berhasil dihapus.',
        });
    } catch (error) {
        console.error('Delete secret variable error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menghapus secret variable.' },
            { status: 500 },
        );
    }
}
