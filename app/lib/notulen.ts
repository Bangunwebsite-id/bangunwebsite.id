import { unstable_noStore as noStore } from 'next/cache';

import { dbPool } from './db';
import {
    syncTodosFromNotulenWorkItems,
    unlinkTodosFromNotulen,
    NotulenTodoSyncResult,
} from './todos';

export type NotulenStatus = 'Draft' | 'Final' | 'Arsip';

export type NotulenRecord = {
    id: number;
    meeting_date: string;
    start_time: string | null;
    end_time: string | null;
    place: string | null;
    note_taker: string;
    attendees: string | null;
    decisions: string | null;
    follow_ups: string | null;
    documentation_photo_url: string | null;
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
    followUps: string;
    documentationPhotoUrl: string;
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
            follow_ups TEXT,
            status TEXT NOT NULL DEFAULT 'Draft'
                CHECK (status IN ('Draft', 'Final', 'Arsip')),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await dbPool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'meeting_minutes'
                    AND column_name = 'documentation_photo_url'
            ) THEN
                ALTER TABLE meeting_minutes ADD COLUMN documentation_photo_url TEXT;
            END IF;

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

            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'meeting_minutes'
                    AND column_name = 'follow_ups'
            ) THEN
                ALTER TABLE meeting_minutes ADD COLUMN follow_ups TEXT;
            END IF;
        END $$;
    `);

    isTableReady = true;
}

function normalizeOptional(value: string) {
    const cleaned = value.trim();
    return cleaned || null;
}

function parsePointLines(value: string) {
    return value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
}

function buildNotulenSourceTitle(input: UpsertNotulenInput) {
    const place = input.place.trim();
    return place ? `Notulen Rapat ${place}` : `Notulen Rapat ${input.meetingDate}`;
}

export async function listAdminNotulen() {
    noStore();
    await ensureNotulenTable();

    const result = await dbPool.query<NotulenRecord>(`
        SELECT
            id,
            meeting_date::text AS meeting_date,
            start_time::text,
            end_time::text,
            place,
            note_taker,
            attendees,
            decisions,
            follow_ups,
            documentation_photo_url,
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
                follow_ups,
                documentation_photo_url,
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
                $8,
                $9,
                $10
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
            normalizeOptional(input.followUps),
            normalizeOptional(input.documentationPhotoUrl),
            input.status,
        ],
    );

    const id = result.rows[0]?.id ?? 0;
    const todoSync = await syncTodosFromNotulenWorkItems({
        notulenId: id,
        meetingDate: input.meetingDate,
        sourceTitle: buildNotulenSourceTitle(input),
        workItems: parsePointLines(input.decisions),
    });

    return { id, todoSync };
}

export async function updateNotulenById(
    id: number,
    input: UpsertNotulenInput,
): Promise<(NotulenRecord & { todoSync: NotulenTodoSyncResult }) | null> {
    await ensureNotulenTable();

    const result = await dbPool.query<NotulenRecord>(
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
                follow_ups = $9,
                documentation_photo_url = $10,
                status = $11,
                updated_at = NOW()
            WHERE id = $1
            RETURNING
                id,
                meeting_date::text AS meeting_date,
                start_time::text,
                end_time::text,
                place,
                note_taker,
                attendees,
                decisions,
                follow_ups,
                documentation_photo_url,
                status,
                created_at,
                updated_at
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
            normalizeOptional(input.followUps),
            normalizeOptional(input.documentationPhotoUrl),
            input.status,
        ],
    );

    const updated = result.rows[0] ?? null;

    if (!updated) {
        return null;
    }

    const todoSync = await syncTodosFromNotulenWorkItems({
        notulenId: id,
        meetingDate: input.meetingDate,
        sourceTitle: buildNotulenSourceTitle(input),
        workItems: parsePointLines(input.decisions),
    });

    return { ...updated, todoSync };
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

    const deleted = (result.rowCount ?? 0) > 0;

    if (deleted) {
        await unlinkTodosFromNotulen(id);
    }

    return deleted;
}
