import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    deleteSecretVariableById,
    updateSecretVariableById,
    updateSecretVariablePinnedById,
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
        const validationMessage = validatePayload(payload);

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
            message: 'Notes Secret berhasil diperbarui.',
        });
    } catch (error) {
        console.error('Update notes secret error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat update Notes Secret.' },
            { status: 500 },
        );
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const { id: rawId } = await params;
    const id = getValidatedId(rawId);

    if (!id) {
        return NextResponse.json(
            { message: 'ID Notes Secret tidak valid.' },
            { status: 400 },
        );
    }

    try {
        const body = (await request.json()) as { pinned?: boolean };

        if (typeof body.pinned !== 'boolean') {
            return NextResponse.json(
                { message: 'Status pin Notes Secret tidak valid.' },
                { status: 400 },
            );
        }

        const updated = await updateSecretVariablePinnedById(id, body.pinned);

        if (!updated) {
            return NextResponse.json(
                { message: 'Notes Secret tidak ditemukan.' },
                { status: 404 },
            );
        }

        return NextResponse.json({
            message: body.pinned ? 'Notes Secret berhasil disematkan.' : 'Notes Secret berhasil dilepas.',
        });
    } catch (error) {
        console.error('Pin notes secret error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat mengubah pin Notes Secret.' },
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
            message: 'Notes Secret berhasil dihapus.',
        });
    } catch (error) {
        console.error('Delete notes secret error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menghapus Notes Secret.' },
            { status: 500 },
        );
    }
}
