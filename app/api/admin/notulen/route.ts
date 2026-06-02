import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    createNotulen,
    listAdminNotulen,
    NotulenStatus,
    UpsertNotulenInput,
} from '@/app/lib/notulen';

type NotulenPayload = Partial<UpsertNotulenInput>;

const statuses = new Set<NotulenStatus>(['Draft', 'Final', 'Arsip']);

function isNotulenStatus(value: string): value is NotulenStatus {
    return statuses.has(value as NotulenStatus);
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

function serializeDate(value: Date | string) {
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    return value;
}

export async function GET(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const notulen = await listAdminNotulen();

        return NextResponse.json({
            notulen: notulen.map((item) => ({
                ...item,
                meeting_date: serializeDate(item.meeting_date),
                created_at: item.created_at.toISOString(),
                updated_at: item.updated_at.toISOString(),
            })),
        });
    } catch (error) {
        console.error('List notulen error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat memuat notulen.' },
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
        const body = (await request.json()) as NotulenPayload;
        const payload = normalizePayload(body);
        const validationMessage = validatePayload(payload);

        if (validationMessage) {
            return NextResponse.json(
                { message: validationMessage },
                { status: 400 },
            );
        }

        const result = await createNotulen(payload);

        return NextResponse.json({
            message: 'Notulen berhasil dibuat.',
            id: result.id,
        });
    } catch (error) {
        console.error('Create notulen error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat membuat notulen.' },
            { status: 500 },
        );
    }
}
