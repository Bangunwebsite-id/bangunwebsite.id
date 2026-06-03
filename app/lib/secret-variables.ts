import { unstable_noStore as noStore } from 'next/cache';

import { dbPool } from './db';

export type SecretVariableCategory = 'Akses Server' | 'Akses Lain';

export type SecretVariableRecord = {
    id: number;
    category: SecretVariableCategory;
    name: string;
    value: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
};

export type UpsertSecretVariableInput = {
    category: SecretVariableCategory;
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
            category TEXT NOT NULL
                CHECK (category IN ('Akses Server', 'Akses Lain')),
            name TEXT NOT NULL,
            value TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
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
            input.category,
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
            input.category,
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
