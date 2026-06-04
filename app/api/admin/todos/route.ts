import { NextResponse } from 'next/server';

import { ensureAdminSession } from '@/app/lib/admin-guard';
import {
    createTodo,
    listTodos,
    TodoPriority,
    UpsertTodoInput,
    upsertTodoNote,
} from '@/app/lib/todos';

type TodoPayload = Partial<UpsertTodoInput>;
type NotePayload = {
    noteDate?: string;
    note?: string;
};

const priorities = new Set<TodoPriority>(['Tinggi', 'Sedang', 'Rendah']);

function isTodoPriority(value: string): value is TodoPriority {
    return priorities.has(value as TodoPriority);
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

function serializeDate(value: Date) {
    return value.toISOString();
}

export async function GET(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const result = await listTodos();

        return NextResponse.json({
            todos: result.todos.map((item) => ({
                ...item,
                created_at: serializeDate(item.created_at),
                updated_at: serializeDate(item.updated_at),
            })),
            notes: result.notes.map((item) => ({
                ...item,
                created_at: serializeDate(item.created_at),
                updated_at: serializeDate(item.updated_at),
            })),
        });
    } catch (error) {
        console.error('List todos error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat memuat To Do List.' },
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
        const body = (await request.json()) as TodoPayload;
        const payload = normalizeTodoPayload(body);
        const validationMessage = validateTodoPayload(payload);

        if (validationMessage) {
            return NextResponse.json(
                { message: validationMessage },
                { status: 400 },
            );
        }

        const result = await createTodo(payload);

        return NextResponse.json({
            message: 'To Do berhasil disimpan.',
            id: result.id,
        });
    } catch (error) {
        console.error('Create todo error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menyimpan To Do.' },
            { status: 500 },
        );
    }
}

export async function PATCH(request: Request) {
    const { unauthorizedResponse } = ensureAdminSession(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const body = (await request.json()) as NotePayload;
        const noteDate = (body.noteDate ?? '').trim();

        if (!isValidDateInput(noteDate)) {
            return NextResponse.json(
                { message: 'Tanggal catatan tidak valid.' },
                { status: 400 },
            );
        }

        await upsertTodoNote(noteDate, body.note ?? '');

        return NextResponse.json({
            message: 'Catatan hari ini berhasil disimpan.',
        });
    } catch (error) {
        console.error('Save todo note error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat menyimpan catatan.' },
            { status: 500 },
        );
    }
}
