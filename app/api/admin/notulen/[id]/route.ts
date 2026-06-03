import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    deleteNotulenById,
    NotulenStatus,
    updateNotulenById,
    UpsertNotulenInput,
} from '@/app/lib/notulen';

type RouteParams = {
    params: Promise<{ id: string }>;
};

type NotulenPayload = Partial<UpsertNotulenInput>;

const statuses = new Set<NotulenStatus>(['Draft', 'Final', 'Arsip']);

function isNotulenStatus(value: string): value is NotulenStatus {
    return statuses.has(value as NotulenStatus);
}

function getValidatedId(rawId: string) {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

function normalizePayload(body: NotulenPayload): UpsertNotulenInput {
    const status = (body.status ?? 'Draft').trim();

    return {
        meetingDate: (body.meetingDate ?? '').trim(),
        startTime: (body.startTime ?? '').trim(),
        endTime: (body.endTime ?? '').trim(),
        place: (body.place ?? '').trim(),
        noteTaker: (body.noteTaker ?? '').trim(),
        attendees: (body.attendees ?? '').trim(),
        decisions: (body.decisions ?? '').trim(),
        documentationPhotoUrl: (body.documentationPhotoUrl ?? '').trim(),
        status: isNotulenStatus(status) ? status : 'Draft',
    };
}

function validatePayload(payload: UpsertNotulenInput) {
    if (!payload.meetingDate || !Date.parse(payload.meetingDate)) {
        return 'Tanggal rapat wajib diisi dengan format yang valid.';
    }

    if (!payload.noteTaker) {
        return 'Notulis wajib diisi.';
    }

    if (!statuses.has(payload.status)) {
        return 'Status notulen tidak valid.';
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
            { message: 'ID notulen tidak valid.' },
            { status: 400 },
        );
    }

    try {
        const body = (await request.json()) as NotulenPayload;
        const payload = normalizePayload(body);
        const validationMessage = validatePayload(payload);

        if (validationMessage) {
            return NextResponse.json(
                { message: validationMessage },
                { status: 400 },
            );
        }

        const updated = await updateNotulenById(id, payload);

        if (!updated) {
            return NextResponse.json(
                { message: 'Notulen tidak ditemukan.' },
                { status: 404 },
            );
        }

        return NextResponse.json({ message: 'Notulen berhasil diperbarui.' });
    } catch (error) {
        console.error('Update notulen error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat update notulen.' },
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
            { message: 'ID notulen tidak valid.' },
            { status: 400 },
        );
    }

    try {
        const deleted = await deleteNotulenById(id);

        if (!deleted) {
            return NextResponse.json(
                { message: 'Notulen tidak ditemukan.' },
                { status: 404 },
            );
        }

        return NextResponse.json({ message: 'Notulen berhasil dihapus.' });
    } catch (error) {
        console.error('Delete notulen error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menghapus notulen.' },
            { status: 500 },
        );
    }
}
