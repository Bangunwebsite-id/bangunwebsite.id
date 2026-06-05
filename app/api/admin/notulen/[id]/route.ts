import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    deleteNotulenById,
    NotulenRecord,
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
        followUps: (body.followUps ?? '').trim(),
        documentationPhotoUrl: (body.documentationPhotoUrl ?? '').trim(),
        status: isNotulenStatus(status) ? status : 'Draft',
    };
}

function isValidDateInput(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

function validatePayload(payload: UpsertNotulenInput) {
    if (!isValidDateInput(payload.meetingDate)) {
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

function serializeNotulen(item: NotulenRecord) {
    return {
        ...item,
        created_at: item.created_at.toISOString(),
        updated_at: item.updated_at.toISOString(),
    };
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
        console.info('Update notulen payload:', {
            id,
            hasDocumentationPhotoUrl: payload.documentationPhotoUrl.length > 0,
            documentationPhotoUrl: payload.documentationPhotoUrl || null,
            receivedDocumentationPhotoUrl:
                typeof body.documentationPhotoUrl === 'string'
                    ? body.documentationPhotoUrl
                    : null,
        });
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

        console.info('Update notulen persisted:', {
            id,
            hasDocumentationPhotoUrl:
                (updated.documentation_photo_url ?? '').trim().length > 0,
            documentationPhotoUrl: updated.documentation_photo_url,
        });

        return NextResponse.json({
            message: 'Notulen berhasil diperbarui.',
            notulen: serializeNotulen(updated),
            todoSync: updated.todoSync,
        });
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
