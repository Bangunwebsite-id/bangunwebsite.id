import { unstable_noStore as noStore } from 'next/cache';

import { dbPool } from './db';

export type NotulenStatus = 'Draft' | 'Final' | 'Arsip';

export type NotulenRecord = {
    id: number;
    meeting_date: Date | string;
    start_time: string | null;
    end_time: string | null;
    place: string | null;
    note_taker: string;
    attendees: string | null;
    decisions: string | null;
    status: NotulenStatus;
    created_at: Date;
    updated_at: Date;
};

export type UpsertNotulenInput = {
    meetingDate: string;
    startTime: string;
    endTime: string;
    place: string;
    noteTaker: string;
    attendees: string;
    decisions: string;
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
            meeting_date DATE NOT NULL,
            start_time TIME,
            end_time TIME,
            place TEXT,
            note_taker TEXT NOT NULL,
            attendees TEXT,
            decisions TEXT,
            status TEXT NOT NULL DEFAULT 'Draft'
                CHECK (status IN ('Draft', 'Final', 'Arsip')),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await dbPool.query(`
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'meeting_minutes'
                    AND column_name = 'title'
            ) THEN
                ALTER TABLE meeting_minutes ALTER COLUMN title DROP NOT NULL;
            END IF;

            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'meeting_minutes'
                    AND column_name = 'leader'
            ) THEN
                ALTER TABLE meeting_minutes ALTER COLUMN leader DROP NOT NULL;
            END IF;
        END $$;
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
            meeting_date,
            start_time::text,
            end_time::text,
            place,
            note_taker,
            attendees,
            decisions,
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
                meeting_date,
                start_time,
                end_time,
                place,
                note_taker,
                attendees,
                decisions,
                status
            )
            VALUES (
                $1,
                NULLIF($2, '')::time,
                NULLIF($3, '')::time,
                $4,
                $5,
                $6,
                $7,
                $8
            )
            RETURNING id
        `,
        [
            input.meetingDate,
            input.startTime,
            input.endTime,
            normalizeOptional(input.place),
            input.noteTaker,
            normalizeOptional(input.attendees),
            normalizeOptional(input.decisions),
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
                meeting_date = $2::date,
                start_time = NULLIF($3, '')::time,
                end_time = NULLIF($4, '')::time,
                place = $5,
                note_taker = $6,
                attendees = $7,
                decisions = $8,
                status = $9,
                updated_at = NOW()
            WHERE id = $1
        `,
        [
            id,
            input.meetingDate,
            input.startTime,
            input.endTime,
            normalizeOptional(input.place),
            input.noteTaker,
            normalizeOptional(input.attendees),
            normalizeOptional(input.decisions),
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
