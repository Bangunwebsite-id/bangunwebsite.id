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
    created_at: Date;
    updated_at: Date;
};

export type UpsertSecretCategoryInput = {
    name: string;
    description: string;
};

export type UpsertSecretVariableInput = {
    category: string;
    name: string;
    value: string;
    description: string;
};

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
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await dbPool.query(`
        DO $$
        DECLARE
            constraint_record record;
        BEGIN
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
            created_at,
            updated_at
        FROM secret_variables
        ORDER BY category ASC, name ASC
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
                description
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `,
        [
            input.category.trim(),
            input.name.trim(),
            input.value,
            normalizeOptional(input.description),
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
            input.category.trim(),
            input.name.trim(),
            input.value,
            normalizeOptional(input.description),
        ],
    );

    return (result.rowCount ?? 0) > 0;
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
