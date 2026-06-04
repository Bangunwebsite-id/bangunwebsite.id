import { unstable_noStore as noStore } from 'next/cache';

import { dbPool } from './db';

export type SecretVariableCategoryRecord = {
    id: number;
    name: string;
    description: string | null;
    variable_count: number;
    created_at: Date;
    updated_at: Date;
};

export type SecretVariableRecord = {
    id: number;
    category: string;
    name: string;
    value: string;
    description: string | null;
    pinned: boolean;
    display_order: number;
    created_at: Date;
    updated_at: Date;
};

export type UpsertSecretCategoryInput = {
    name: string;
    description: string;
};

export type UpsertSecretVariableInput = {
    name: string;
    value: string;
    category?: string;
    description?: string;
};

export type ReorderSecretVariableInput = {
    id: number;
    displayOrder: number;
};

const DEFAULT_NOTES_SECRET_CATEGORY = 'Notes Secret';

let isTableReady = false;

async function ensureSecretVariablesTable() {
    if (isTableReady) {
        return;
    }

    await dbPool.query(`
        CREATE TABLE IF NOT EXISTS secret_variables (
            id SERIAL PRIMARY KEY,
            category TEXT NOT NULL,
            name TEXT NOT NULL,
            value TEXT NOT NULL,
            description TEXT,
            pinned BOOLEAN NOT NULL DEFAULT FALSE,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await dbPool.query(`
        DO $$
        DECLARE
            constraint_record record;
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'secret_variables'
                    AND column_name = 'pinned'
            ) THEN
                ALTER TABLE secret_variables ADD COLUMN pinned BOOLEAN NOT NULL DEFAULT FALSE;
            END IF;

            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'secret_variables'
                    AND column_name = 'display_order'
            ) THEN
                ALTER TABLE secret_variables ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;
            END IF;

            FOR constraint_record IN
                SELECT conname
                FROM pg_constraint
                WHERE conrelid = 'secret_variables'::regclass
                    AND contype = 'c'
                    AND pg_get_constraintdef(oid) ILIKE '%category%'
            LOOP
                EXECUTE format(
                    'ALTER TABLE secret_variables DROP CONSTRAINT IF EXISTS %I',
                    constraint_record.conname
                );
            END LOOP;
        END $$;
    `);

    await dbPool.query(`
        CREATE TABLE IF NOT EXISTS secret_variable_categories (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await dbPool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS secret_variable_categories_name_key
        ON secret_variable_categories (lower(name))
    `);

    await dbPool.query(`
        INSERT INTO secret_variable_categories (name)
        SELECT DISTINCT TRIM(category)
        FROM secret_variables
        WHERE TRIM(category) <> ''
        ON CONFLICT DO NOTHING
    `);

    await dbPool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS secret_variables_category_name_key
        ON secret_variables (category, lower(name))
    `);

    await dbPool.query(`
        WITH ordered AS (
            SELECT
                id,
                ROW_NUMBER() OVER (ORDER BY category ASC, name ASC, id ASC) AS next_order
            FROM secret_variables
            WHERE display_order = 0
        )
        UPDATE secret_variables variable
        SET display_order = ordered.next_order
        FROM ordered
        WHERE variable.id = ordered.id
    `);

    isTableReady = true;
}

function normalizeOptional(value: string) {
    const cleaned = value.trim();
    return cleaned || null;
}

export async function listSecretVariableCategories() {
    noStore();
    await ensureSecretVariablesTable();

    const result = await dbPool.query<SecretVariableCategoryRecord>(`
        SELECT
            category.id,
            category.name,
            category.description,
            COUNT(variable.id)::int AS variable_count,
            category.created_at,
            category.updated_at
        FROM secret_variable_categories category
        LEFT JOIN secret_variables variable
            ON variable.category = category.name
        GROUP BY category.id
        ORDER BY category.name ASC
    `);

    return result.rows;
}

export async function secretVariableCategoryExists(name: string) {
    await ensureSecretVariablesTable();

    const result = await dbPool.query<{ exists: boolean }>(
        `
            SELECT EXISTS (
                SELECT 1
                FROM secret_variable_categories
                WHERE lower(name) = lower($1)
            ) AS exists
        `,
        [name.trim()],
    );

    return result.rows[0]?.exists ?? false;
}

export async function createSecretVariableCategory(input: UpsertSecretCategoryInput) {
    await ensureSecretVariablesTable();

    const result = await dbPool.query<{ id: number }>(
        `
            INSERT INTO secret_variable_categories (
                name,
                description
            )
            VALUES ($1, $2)
            RETURNING id
        `,
        [input.name.trim(), normalizeOptional(input.description)],
    );

    return { id: result.rows[0]?.id ?? 0 };
}

export async function updateSecretVariableCategoryById(
    id: number,
    input: UpsertSecretCategoryInput,
) {
    await ensureSecretVariablesTable();

    const client = await dbPool.connect();

    try {
        await client.query('BEGIN');

        const current = await client.query<{ name: string }>(
            `
                SELECT name
                FROM secret_variable_categories
                WHERE id = $1
                FOR UPDATE
            `,
            [id],
        );

        const previousName = current.rows[0]?.name;

        if (!previousName) {
            await client.query('ROLLBACK');
            return false;
        }

        await client.query(
            `
                UPDATE secret_variable_categories
                SET
                    name = $2,
                    description = $3,
                    updated_at = NOW()
                WHERE id = $1
            `,
            [id, input.name.trim(), normalizeOptional(input.description)],
        );

        await client.query(
            `
                UPDATE secret_variables
                SET
                    category = $2,
                    updated_at = NOW()
                WHERE category = $1
            `,
            [previousName, input.name.trim()],
        );

        await client.query('COMMIT');
        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteSecretVariableCategoryById(id: number) {
    await ensureSecretVariablesTable();

    const countResult = await dbPool.query<{ variable_count: number }>(
        `
            SELECT COUNT(variable.id)::int AS variable_count
            FROM secret_variable_categories category
            LEFT JOIN secret_variables variable
                ON variable.category = category.name
            WHERE category.id = $1
            GROUP BY category.id
        `,
        [id],
    );

    const variableCount = countResult.rows[0]?.variable_count;

    if (variableCount === undefined) {
        return 'not_found';
    }

    if (variableCount > 0) {
        return 'has_variables';
    }

    const result = await dbPool.query(
        `
            DELETE FROM secret_variable_categories
            WHERE id = $1
        `,
        [id],
    );

    return (result.rowCount ?? 0) > 0 ? 'deleted' : 'not_found';
}

export async function listSecretVariables() {
    noStore();
    await ensureSecretVariablesTable();

    const result = await dbPool.query<SecretVariableRecord>(`
        SELECT
            id,
            category,
            name,
            value,
            description,
            pinned,
            display_order,
            created_at,
            updated_at
        FROM secret_variables
        ORDER BY pinned DESC, display_order ASC, created_at DESC, id DESC
    `);

    return result.rows;
}

export async function createSecretVariable(input: UpsertSecretVariableInput) {
    await ensureSecretVariablesTable();

    const result = await dbPool.query<{ id: number }>(
        `
            INSERT INTO secret_variables (
                category,
                name,
                value,
                description,
                display_order
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                COALESCE((SELECT MAX(display_order) + 1 FROM secret_variables), 1)
            )
            RETURNING id
        `,
        [
            (input.category ?? DEFAULT_NOTES_SECRET_CATEGORY).trim() || DEFAULT_NOTES_SECRET_CATEGORY,
            input.name.trim(),
            input.value,
            normalizeOptional(input.description ?? ''),
        ],
    );

    return { id: result.rows[0]?.id ?? 0 };
}

export async function updateSecretVariableById(
    id: number,
    input: UpsertSecretVariableInput,
) {
    await ensureSecretVariablesTable();

    const result = await dbPool.query(
        `
            UPDATE secret_variables
            SET
                category = $2,
                name = $3,
                value = $4,
                description = $5,
                updated_at = NOW()
            WHERE id = $1
        `,
        [
            id,
            (input.category ?? DEFAULT_NOTES_SECRET_CATEGORY).trim() || DEFAULT_NOTES_SECRET_CATEGORY,
            input.name.trim(),
            input.value,
            normalizeOptional(input.description ?? ''),
        ],
    );

    return (result.rowCount ?? 0) > 0;
}

export async function updateSecretVariablePinnedById(id: number, pinned: boolean) {
    await ensureSecretVariablesTable();

    const result = await dbPool.query(
        `
            UPDATE secret_variables
            SET
                pinned = $2,
                updated_at = NOW()
            WHERE id = $1
        `,
        [id, pinned],
    );

    return (result.rowCount ?? 0) > 0;
}

export async function reorderSecretVariables(items: ReorderSecretVariableInput[]) {
    await ensureSecretVariablesTable();

    const client = await dbPool.connect();

    try {
        await client.query('BEGIN');

        for (const item of items) {
            await client.query(
                `
                    UPDATE secret_variables
                    SET
                        display_order = $2,
                        updated_at = NOW()
                    WHERE id = $1
                `,
                [item.id, item.displayOrder],
            );
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteSecretVariableById(id: number) {
    await ensureSecretVariablesTable();

    const result = await dbPool.query(
        `
            DELETE FROM secret_variables
            WHERE id = $1
        `,
        [id],
    );

    return (result.rowCount ?? 0) > 0;
}
