import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    deleteTodoById,
    moveTodoToDateById,
    TodoPriority,
    TodoStatus,
    updateTodoById,
    updateTodoStatusById,
    UpsertTodoInput,
} from '@/app/lib/todos';

type RouteParams = {
    params: Promise<{ id: string }>;
};

type TodoPayload = Partial<UpsertTodoInput>;
type TodoPatchPayload = {
    status?: TodoStatus;
    taskDate?: string;
};

const priorities = new Set<TodoPriority>(['Tinggi', 'Sedang', 'Rendah']);
const statuses = new Set<TodoStatus>(['todo', 'done']);

function getValidatedId(rawId: string) {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

function isTodoPriority(value: string): value is TodoPriority {
    return priorities.has(value as TodoPriority);
}

function isTodoStatus(value: string): value is TodoStatus {
    return statuses.has(value as TodoStatus);
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

function normalizeTodoPayload(body: TodoPayload): UpsertTodoInput {
    const priority = (body.priority ?? 'Sedang').trim();

    return {
        taskDate: (body.taskDate ?? '').trim(),
        title: (body.title ?? '').trim(),
        priority: isTodoPriority(priority) ? priority : 'Sedang',
    };
}

function validateTodoPayload(payload: UpsertTodoInput) {
    if (!isValidDateInput(payload.taskDate)) {
        return 'Tanggal tugas wajib valid.';
    }

    if (!payload.title) {
        return 'Judul tugas wajib diisi.';
    }

    if (!priorities.has(payload.priority)) {
        return 'Prioritas tugas tidak valid.';
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
            { message: 'ID tugas tidak valid.' },
            { status: 400 },
        );
    }

    try {
        const body = (await request.json()) as TodoPayload;
        const payload = normalizeTodoPayload(body);
        const validationMessage = validateTodoPayload(payload);

        if (validationMessage) {
            return NextResponse.json(
                { message: validationMessage },
                { status: 400 },
            );
        }

        const updated = await updateTodoById(id, payload);

        if (!updated) {
            return NextResponse.json(
                { message: 'Tugas tidak ditemukan.' },
                { status: 404 },
            );
        }

        return NextResponse.json({
            message: 'To Do berhasil diperbarui.',
        });
    } catch (error) {
        console.error('Update todo error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat memperbarui To Do.' },
            { status: 500 },
        );
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    const { id: rawId } = await params;
    const id = getValidatedId(rawId);

    if (!id) {
        return NextResponse.json(
            { message: 'ID tugas tidak valid.' },
            { status: 400 },
        );
    }

    try {
        const body = (await request.json()) as TodoPatchPayload;
        let updated = false;

        if (body.status && isTodoStatus(body.status)) {
            updated = await updateTodoStatusById(id, body.status);
        } else if (body.taskDate && isValidDateInput(body.taskDate)) {
            updated = await moveTodoToDateById(id, body.taskDate);
        } else {
            return NextResponse.json(
                { message: 'Payload tugas tidak valid.' },
                { status: 400 },
            );
        }

        if (!updated) {
            return NextResponse.json(
                { message: 'Tugas tidak ditemukan.' },
                { status: 404 },
            );
        }

        return NextResponse.json({
            message: 'To Do berhasil diperbarui.',
        });
    } catch (error) {
        console.error('Patch todo error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat memperbarui To Do.' },
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
            { message: 'ID tugas tidak valid.' },
            { status: 400 },
        );
    }

    try {
        const deleted = await deleteTodoById(id);

        if (!deleted) {
            return NextResponse.json(
                { message: 'Tugas tidak ditemukan.' },
                { status: 404 },
            );
        }

        return NextResponse.json({
            message: 'Data berhasil dihapus.',
        });
    } catch (error) {
        console.error('Delete todo error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menghapus To Do.' },
            { status: 500 },
        );
    }
}
