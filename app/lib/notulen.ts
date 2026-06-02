import { unstable_noStore as noStore } from 'next/cache';

import { dbPool } from './db';

export type NotulenStatus = 'Draft' | 'Final' | 'Arsip';

export type NotulenRecord = {
    id: number;
    title: string;
    meeting_date: Date | string;
    start_time: string | null;
    end_time: string | null;
    place: string | null;
    leader: string;
    note_taker: string;
    attendees: string | null;
    agenda: string | null;
    decisions: string | null;
    follow_up: string | null;
    notes: string | null;
    status: NotulenStatus;
    created_at: Date;
    updated_at: Date;
};

export type UpsertNotulenInput = {
    title: string;
    meetingDate: string;
    startTime: string;
    endTime: string;
    place: string;
    leader: string;
    noteTaker: string;
    attendees: string;
    agenda: string;
    decisions: string;
    followUp: string;
    notes: string;
    status: NotulenStatus;
};

let isTableReady = false;

async function ensureNotulenTable() {
    if (isTableReady) {
        return;
    }

    await dbPool.query(`
        CREATE TABLE IF NOT EXISTS meeting_minutes (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            meeting_date DATE NOT NULL,
            start_time TIME,
            end_time TIME,
            place TEXT,
            leader TEXT NOT NULL,
            note_taker TEXT NOT NULL,
            attendees TEXT,
            agenda TEXT,
            decisions TEXT,
            follow_up TEXT,
            notes TEXT,
            status TEXT NOT NULL DEFAULT 'Draft'
                CHECK (status IN ('Draft', 'Final', 'Arsip')),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    isTableReady = true;
}

function normalizeOptional(value: string) {
    const cleaned = value.trim();
    return cleaned || null;
}

export async function listAdminNotulen() {
    noStore();
    await ensureNotulenTable();

    const result = await dbPool.query<NotulenRecord>(`
        SELECT
            id,
            title,
            meeting_date,
            start_time::text,
            end_time::text,
            place,
            leader,
            note_taker,
            attendees,
            agenda,
            decisions,
            follow_up,
            notes,
            status,
            created_at,
            updated_at
        FROM meeting_minutes
        ORDER BY meeting_date DESC, id DESC
    `);

    return result.rows;
}

export async function createNotulen(input: UpsertNotulenInput) {
    await ensureNotulenTable();

    const result = await dbPool.query<{ id: number }>(
        `
            INSERT INTO meeting_minutes (
                title,
                meeting_date,
                start_time,
                end_time,
                place,
                leader,
                note_taker,
                attendees,
                agenda,
                decisions,
                follow_up,
                notes,
                status
            )
            VALUES (
                $1,
                $2::date,
                NULLIF($3, '')::time,
                NULLIF($4, '')::time,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                $13
            )
            RETURNING id
        `,
        [
            input.title,
            input.meetingDate,
            input.startTime,
            input.endTime,
            normalizeOptional(input.place),
            input.leader,
            input.noteTaker,
            normalizeOptional(input.attendees),
            normalizeOptional(input.agenda),
            normalizeOptional(input.decisions),
            normalizeOptional(input.followUp),
            normalizeOptional(input.notes),
            input.status,
        ],
    );

    return { id: result.rows[0]?.id ?? 0 };
}

export async function updateNotulenById(
    id: number,
    input: UpsertNotulenInput,
) {
    await ensureNotulenTable();

    const result = await dbPool.query(
        `
            UPDATE meeting_minutes
            SET
                title = $2,
                meeting_date = $3::date,
                start_time = NULLIF($4, '')::time,
                end_time = NULLIF($5, '')::time,
                place = $6,
                leader = $7,
                note_taker = $8,
                attendees = $9,
                agenda = $10,
                decisions = $11,
                follow_up = $12,
                notes = $13,
                status = $14,
                updated_at = NOW()
            WHERE id = $1
        `,
        [
            id,
            input.title,
            input.meetingDate,
            input.startTime,
            input.endTime,
            normalizeOptional(input.place),
            input.leader,
            input.noteTaker,
            normalizeOptional(input.attendees),
            normalizeOptional(input.agenda),
            normalizeOptional(input.decisions),
            normalizeOptional(input.followUp),
            normalizeOptional(input.notes),
            input.status,
        ],
    );

    return (result.rowCount ?? 0) > 0;
}

export async function deleteNotulenById(id: number) {
    await ensureNotulenTable();

    const result = await dbPool.query(
        `
            DELETE FROM meeting_minutes
            WHERE id = $1
        `,
        [id],
    );

    return (result.rowCount ?? 0) > 0;
}
