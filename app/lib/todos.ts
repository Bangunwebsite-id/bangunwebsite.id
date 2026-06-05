import { unstable_noStore as noStore } from 'next/cache';
import { randomBytes } from 'crypto';

import { dbPool } from './db';

export type TodoPriority = 'Tinggi' | 'Sedang' | 'Rendah';
export type TodoStatus = 'todo' | 'done';

export type TodoRecord = {
    id: number;
    task_date: string;
    title: string;
    priority: TodoPriority;
    status: TodoStatus;
    source_type: 'notulen' | null;
    source_notulen_id: number | null;
    source_notulen_point_index: number | null;
    source_notulen_title: string | null;
    source_meeting_date: string | null;
    created_at: Date;
    updated_at: Date;
};

export type TodoNoteRecord = {
    note_date: string;
    note: string;
    created_at: Date;
    updated_at: Date;
};

export type TodoShareRecord = {
    id: number;
    token: string;
    created_at: Date;
    updated_at: Date;
};

export type UpsertTodoInput = {
    taskDate: string;
    title: string;
    priority: TodoPriority;
};

let isTableReady = false;

export async function ensureTodoTables() {
    if (isTableReady) {
        return;
    }

    await dbPool.query(`
        CREATE TABLE IF NOT EXISTS admin_todos (
            id SERIAL PRIMARY KEY,
            task_date DATE NOT NULL,
            title TEXT NOT NULL,
            priority TEXT NOT NULL DEFAULT 'Sedang'
                CHECK (priority IN ('Tinggi', 'Sedang', 'Rendah')),
            status TEXT NOT NULL DEFAULT 'todo'
                CHECK (status IN ('todo', 'done')),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await dbPool.query(`
        CREATE TABLE IF NOT EXISTS admin_todo_notes (
            note_date DATE PRIMARY KEY,
            note TEXT NOT NULL DEFAULT '',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await dbPool.query(`
        CREATE TABLE IF NOT EXISTS admin_todo_shares (
            id SERIAL PRIMARY KEY,
            token TEXT NOT NULL UNIQUE,
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
                WHERE table_name = 'admin_todos'
                    AND column_name = 'source_type'
            ) THEN
                ALTER TABLE admin_todos ADD COLUMN source_type TEXT;
            END IF;

            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'admin_todos'
                    AND column_name = 'source_notulen_id'
            ) THEN
                ALTER TABLE admin_todos ADD COLUMN source_notulen_id INTEGER;
            END IF;

            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'admin_todos'
                    AND column_name = 'source_notulen_point_index'
            ) THEN
                ALTER TABLE admin_todos ADD COLUMN source_notulen_point_index INTEGER;
            END IF;

            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'admin_todos'
                    AND column_name = 'source_notulen_title'
            ) THEN
                ALTER TABLE admin_todos ADD COLUMN source_notulen_title TEXT;
            END IF;

            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'admin_todos'
                    AND column_name = 'source_meeting_date'
            ) THEN
                ALTER TABLE admin_todos ADD COLUMN source_meeting_date DATE;
            END IF;
        END $$;
    `);

    await dbPool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS admin_todos_notulen_point_unique
        ON admin_todos (source_notulen_id, source_notulen_point_index)
        WHERE source_type = 'notulen'
            AND source_notulen_id IS NOT NULL
            AND source_notulen_point_index IS NOT NULL
    `);

    isTableReady = true;
}

function createShareToken() {
    return randomBytes(18).toString('base64url');
}

export async function getOrCreateTodoShareToken() {
    await ensureTodoTables();

    const existing = await dbPool.query<TodoShareRecord>(`
        SELECT
            id,
            token,
            created_at,
            updated_at
        FROM admin_todo_shares
        ORDER BY created_at DESC, id DESC
        LIMIT 1
    `);

    const existingToken = existing.rows[0]?.token;

    if (existingToken) {
        return existingToken;
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
        const token = createShareToken();

        try {
            const result = await dbPool.query<{ token: string }>(
                `
                    INSERT INTO admin_todo_shares (token)
                    VALUES ($1)
                    RETURNING token
                `,
                [token],
            );

            return result.rows[0]?.token ?? token;
        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === '23505'
            ) {
                continue;
            }

            throw error;
        }
    }

    throw new Error('Gagal membuat token share To Do List.');
}

export async function getSharedTodoDataByToken(token: string) {
    noStore();
    await ensureTodoTables();

    const share = await dbPool.query<{ id: number }>(
        `
            SELECT id
            FROM admin_todo_shares
            WHERE token = $1
            LIMIT 1
        `,
        [token],
    );

    if (!share.rows[0]) {
        return null;
    }

    return listTodos();
}

export async function listTodos() {
    noStore();
    await ensureTodoTables();

    const [todosResult, notesResult] = await Promise.all([
        dbPool.query<TodoRecord>(`
            SELECT
                id,
                task_date::text AS task_date,
                title,
                priority,
                status,
                source_type,
                source_notulen_id,
                source_notulen_point_index,
                source_notulen_title,
                source_meeting_date::text AS source_meeting_date,
                created_at,
                updated_at
            FROM admin_todos
            ORDER BY task_date DESC, status ASC, created_at ASC, id ASC
        `),
        dbPool.query<TodoNoteRecord>(`
            SELECT
                note_date::text AS note_date,
                note,
                created_at,
                updated_at
            FROM admin_todo_notes
            ORDER BY note_date DESC
        `),
    ]);

    return {
        todos: todosResult.rows,
        notes: notesResult.rows,
    };
}

export type NotulenTodoSyncInput = {
    notulenId: number;
    meetingDate: string;
    sourceTitle: string;
    workItems: string[];
};

export type NotulenTodoSyncResult = {
    created: number;
    updated: number;
    unlinked: number;
};

export async function syncTodosFromNotulenWorkItems(input: NotulenTodoSyncInput) {
    await ensureTodoTables();

    const client = await dbPool.connect();
    const syncResult: NotulenTodoSyncResult = {
        created: 0,
        updated: 0,
        unlinked: 0,
    };

    try {
        await client.query('BEGIN');

        const activeIndexes = input.workItems.map((_, index) => index);
        const activeTitles = input.workItems;

        if (activeIndexes.length > 0) {
            await client.query(
                `
                    UPDATE admin_todos
                    SET
                        source_notulen_point_index = NULL,
                        updated_at = NOW()
                    WHERE source_type = 'notulen'
                        AND source_notulen_id = $1
                        AND status = 'done'
                        AND NOT EXISTS (
                            SELECT 1
                            FROM unnest($2::int[], $3::text[]) AS active(point_index, title)
                            WHERE active.point_index = admin_todos.source_notulen_point_index
                                AND active.title = admin_todos.title
                        )
                `,
                [input.notulenId, activeIndexes, activeTitles],
            );
        } else {
            await client.query(
                `
                    UPDATE admin_todos
                    SET
                        source_notulen_point_index = NULL,
                        updated_at = NOW()
                    WHERE source_type = 'notulen'
                        AND source_notulen_id = $1
                        AND status = 'done'
                `,
                [input.notulenId],
            );
        }

        for (const [index, title] of input.workItems.entries()) {
            const result = await client.query<{ inserted: boolean }>(
                `
                    INSERT INTO admin_todos (
                        task_date,
                        title,
                        priority,
                        source_type,
                        source_notulen_id,
                        source_notulen_point_index,
                        source_notulen_title,
                        source_meeting_date
                    )
                    VALUES ($1::date, $2, 'Sedang', 'notulen', $3, $4, $5, $1::date)
                    ON CONFLICT (source_notulen_id, source_notulen_point_index)
                    WHERE source_type = 'notulen'
                        AND source_notulen_id IS NOT NULL
                        AND source_notulen_point_index IS NOT NULL
                    DO UPDATE SET
                        task_date = EXCLUDED.task_date,
                        title = EXCLUDED.title,
                        source_notulen_title = EXCLUDED.source_notulen_title,
                        source_meeting_date = EXCLUDED.source_meeting_date,
                        updated_at = NOW()
                    RETURNING (xmax = 0) AS inserted
                `,
                [
                    input.meetingDate,
                    title,
                    input.notulenId,
                    index,
                    input.sourceTitle,
                ],
            );

            if (result.rows[0]?.inserted) {
                syncResult.created += 1;
            } else {
                syncResult.updated += 1;
            }
        }

        const unlinkResult =
            activeIndexes.length > 0
                ? await client.query(
                      `
                        DELETE FROM admin_todos
                        WHERE source_type = 'notulen'
                            AND source_notulen_id = $1
                            AND source_notulen_point_index <> ALL($2::int[])
                            AND status = 'todo'
                    `,
                      [input.notulenId, activeIndexes],
                  )
                : await client.query(
                      `
                        DELETE FROM admin_todos
                        WHERE source_type = 'notulen'
                            AND source_notulen_id = $1
                            AND status = 'todo'
                    `,
                      [input.notulenId],
                  );

        syncResult.unlinked = unlinkResult.rowCount ?? 0;

        await client.query('COMMIT');
        return syncResult;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function unlinkTodosFromNotulen(notulenId: number) {
    await ensureTodoTables();

    await dbPool.query(
        `
            UPDATE admin_todos
            SET
                source_type = NULL,
                source_notulen_id = NULL,
                source_notulen_point_index = NULL,
                source_notulen_title = NULL,
                source_meeting_date = NULL,
                updated_at = NOW()
            WHERE source_type = 'notulen'
                AND source_notulen_id = $1
        `,
        [notulenId],
    );
}

export async function createTodo(input: UpsertTodoInput) {
    await ensureTodoTables();

    const result = await dbPool.query<{ id: number }>(
        `
            INSERT INTO admin_todos (
                task_date,
                title,
                priority
            )
            VALUES ($1::date, $2, $3)
            RETURNING id
        `,
        [input.taskDate, input.title.trim(), input.priority],
    );

    return { id: result.rows[0]?.id ?? 0 };
}

export async function updateTodoById(id: number, input: UpsertTodoInput) {
    await ensureTodoTables();

    const result = await dbPool.query(
        `
            UPDATE admin_todos
            SET
                task_date = $2::date,
                title = $3,
                priority = $4,
                updated_at = NOW()
            WHERE id = $1
        `,
        [id, input.taskDate, input.title.trim(), input.priority],
    );

    return (result.rowCount ?? 0) > 0;
}

export async function updateTodoStatusById(id: number, status: TodoStatus) {
    await ensureTodoTables();

    const result = await dbPool.query(
        `
            UPDATE admin_todos
            SET
                status = $2,
                updated_at = NOW()
            WHERE id = $1
        `,
        [id, status],
    );

    return (result.rowCount ?? 0) > 0;
}

export async function moveTodoToDateById(id: number, taskDate: string) {
    await ensureTodoTables();

    const result = await dbPool.query(
        `
            UPDATE admin_todos
            SET
                task_date = $2::date,
                status = 'todo',
                updated_at = NOW()
            WHERE id = $1
        `,
        [id, taskDate],
    );

    return (result.rowCount ?? 0) > 0;
}

export async function deleteTodoById(id: number) {
    await ensureTodoTables();

    const result = await dbPool.query(
        `
            DELETE FROM admin_todos
            WHERE id = $1
        `,
        [id],
    );

    return (result.rowCount ?? 0) > 0;
}

export async function upsertTodoNote(noteDate: string, note: string) {
    await ensureTodoTables();

    await dbPool.query(
        `
            INSERT INTO admin_todo_notes (
                note_date,
                note
            )
            VALUES ($1::date, $2)
            ON CONFLICT (note_date)
            DO UPDATE SET
                note = EXCLUDED.note,
                updated_at = NOW()
        `,
        [noteDate, note],
    );
}
