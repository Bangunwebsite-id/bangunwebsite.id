'use client';

import { useMemo, useState } from 'react';

type TodoPriority = 'Tinggi' | 'Sedang' | 'Rendah';
type TodoStatus = 'todo' | 'done';

type SharedTodo = {
    id: number;
    task_date: string;
    title: string;
    priority: TodoPriority;
    status: TodoStatus;
    created_at: string;
    updated_at: string;
};

type SharedTodoViewProps = {
    todos: SharedTodo[];
    initialDate: string;
    isDateLocked: boolean;
};

const monthFormatter = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
});
const dayFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'short' });
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

function toDateInputValue(date: Date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}

function toLocalDate(value: string) {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
}

function formatDateShort(value: string) {
    return dateFormatter.format(toLocalDate(value));
}

function buildCalendarDays(monthDate: Date) {
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return date;
    });
}

function getCalendarDayClass(todos: SharedTodo[]) {
    if (todos.length === 0) {
        return 'bg-slate-50/60 text-slate-400';
    }

    const doneCount = todos.filter((item) => item.status === 'done').length;

    if (doneCount === todos.length) {
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    }

    if (doneCount > 0) {
        return 'border-amber-200 bg-amber-50 text-amber-800';
    }

    return 'border-red-200 bg-red-50 text-red-800';
}

function getPriorityClass(priority: TodoPriority) {
    if (priority === 'Tinggi') {
        return 'border-red-200 bg-red-50 text-red-700';
    }

    if (priority === 'Rendah') {
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }

    return 'border-amber-200 bg-amber-50 text-amber-700';
}

export function SharedTodoView({
    todos,
    initialDate,
    isDateLocked,
}: SharedTodoViewProps) {
    const [activeDate, setActiveDate] = useState(initialDate);
    const [monthDate, setMonthDate] = useState(() => toLocalDate(initialDate));
    const visibleDays = useMemo(() => buildCalendarDays(monthDate), [monthDate]);
    const todosByDate = useMemo(() => {
        const map = new Map<string, SharedTodo[]>();

        for (const todo of todos) {
            const key = todo.task_date.slice(0, 10);
            map.set(key, [...(map.get(key) ?? []), todo]);
        }

        return map;
    }, [todos]);

    const activeTodos = todosByDate.get(activeDate) ?? [];
    const todoItems = activeTodos.filter((item) => item.status === 'todo');
    const doneItems = activeTodos.filter((item) => item.status === 'done');
    const totalTasks = activeTodos.length;
    const doneTasks = doneItems.length;
    const pendingTasks = totalTasks - doneTasks;
    const progress =
        totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    function changeMonth(offset: number) {
        setMonthDate(
            (current) =>
                new Date(current.getFullYear(), current.getMonth() + offset, 1)
        );
    }

    function selectDate(dateKey: string) {
        if (isDateLocked) {
            return;
        }

        setActiveDate(dateKey);
    }

    return (
        <section className='mx-auto w-full max-w-6xl px-4 py-10 md:py-14'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-cyan-700'>
                    Share To Do List
                </p>
                <div className='mt-3 flex flex-wrap items-end justify-between gap-3'>
                    <div>
                        <h1 className='text-3xl font-bold leading-tight text-slate-900 md:text-5xl'>
                            {formatDateShort(activeDate)}
                        </h1>
                        <p className='mt-2 text-sm font-medium text-slate-600'>
                            Progress pekerjaan harian dalam mode read only.
                        </p>
                    </div>
                    <div className='min-w-32 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-center'>
                        <p className='text-xs font-bold uppercase tracking-[0.12em] text-cyan-700'>
                            Progress
                        </p>
                        <p className='mt-1 text-3xl font-bold text-cyan-800'>
                            {progress}%
                        </p>
                    </div>
                </div>

                <div className='mt-5 grid gap-3 md:grid-cols-3'>
                    {[
                        ['Total Tugas', totalTasks],
                        ['Selesai', doneTasks],
                        ['Belum Selesai', pendingTasks],
                    ].map(([label, value]) => (
                        <article
                            key={label}
                            className='rounded-xl border border-slate-200 bg-slate-50 p-4'
                        >
                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                {label}
                            </p>
                            <p className='mt-1 text-2xl font-bold text-slate-900'>
                                {value}
                            </p>
                        </article>
                    ))}
                </div>
                <div className='mt-4 h-3 overflow-hidden rounded-full bg-slate-200'>
                    <div
                        className='h-full rounded-full bg-cyan-600 transition-all'
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className='mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_1.1fr]'>
                <ReadOnlyTaskColumn
                    title='TO DO'
                    emptyText='Tidak ada tugas aktif.'
                    items={todoItems}
                    showCheck={false}
                />
                <ReadOnlyTaskColumn
                    title='DONE'
                    emptyText='Belum ada tugas selesai.'
                    items={doneItems}
                    showCheck
                />

                <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                        <div>
                            <h2 className='text-lg font-bold text-slate-900'>
                                RIWAYAT KALENDER
                            </h2>
                            <p className='mt-1 text-sm text-slate-600'>
                                Warna tanggal menunjukkan status pekerjaan.
                            </p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <button
                                type='button'
                                onClick={() => changeMonth(-1)}
                                className='rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100'
                            >
                                Sebelumnya
                            </button>
                            <button
                                type='button'
                                onClick={() => setMonthDate(toLocalDate(initialDate))}
                                className='rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100'
                            >
                                Bulan Link
                            </button>
                            <button
                                type='button'
                                onClick={() => changeMonth(1)}
                                className='rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100'
                            >
                                Berikutnya
                            </button>
                        </div>
                    </div>

                    <h3 className='mt-5 text-sm font-bold capitalize text-slate-900'>
                        {monthFormatter.format(monthDate)}
                    </h3>
                    <div className='mt-4 grid grid-cols-7 border-l border-t border-slate-200 text-sm'>
                        {visibleDays.slice(0, 7).map((date) => (
                            <div
                                key={dayFormatter.format(date)}
                                className='border-b border-r border-slate-200 bg-slate-50 px-1 py-2 text-center text-[11px] font-bold uppercase text-slate-500'
                            >
                                {dayFormatter.format(date)}
                            </div>
                        ))}
                        {visibleDays.map((date) => {
                            const key = toDateInputValue(date);
                            const dayTodos = todosByDate.get(key) ?? [];
                            const isOutsideMonth =
                                date.getMonth() !== monthDate.getMonth();
                            const isActive = key === activeDate;

                            return (
                                <button
                                    key={key}
                                    type='button'
                                    onClick={() => selectDate(key)}
                                    disabled={isDateLocked}
                                    className={`min-h-16 border-b border-r border-slate-200 p-1.5 text-left transition ${isDateLocked ? 'cursor-default' : 'hover:ring-2 hover:ring-cyan-300'} ${isOutsideMonth ? 'opacity-60' : ''} ${isActive ? 'ring-2 ring-cyan-500' : ''} ${getCalendarDayClass(dayTodos)}`}
                                >
                                    <span className='block text-xs font-bold'>
                                        {date.getDate()}
                                    </span>
                                    {dayTodos.length > 0 && (
                                        <span className='mt-1 block text-[11px] font-bold'>
                                            {
                                                dayTodos.filter(
                                                    (item) =>
                                                        item.status === 'done'
                                                ).length
                                            }
                                            /{dayTodos.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className='mt-4 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-2'>
                        <LegendItem className='bg-emerald-100' text='Semua selesai' />
                        <LegendItem className='bg-amber-100' text='Sebagian selesai' />
                        <LegendItem className='bg-red-100' text='Ada tugas belum selesai' />
                        <LegendItem className='bg-slate-100' text='Tidak ada tugas' />
                    </div>
                </article>
            </div>
        </section>
    );
}

function ReadOnlyTaskColumn({
    title,
    emptyText,
    items,
    showCheck,
}: {
    title: string;
    emptyText: string;
    items: SharedTodo[];
    showCheck: boolean;
}) {
    return (
        <article className='rounded-2xl border border-slate-200 bg-white p-5'>
            <div className='flex items-center justify-between gap-2'>
                <h2 className='text-lg font-bold text-slate-900'>{title}</h2>
                <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600'>
                    {items.length}
                </span>
            </div>
            <div className='mt-4 min-h-80 space-y-3'>
                {items.length === 0 ? (
                    <p className='rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm font-medium text-slate-500'>
                        {emptyText}
                    </p>
                ) : (
                    items.map((item) => (
                        <article
                            key={item.id}
                            className='rounded-xl border border-slate-200 bg-slate-50 p-4'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <h3 className='font-bold text-slate-900'>
                                    {showCheck ? '✓ ' : ''}
                                    {item.title}
                                </h3>
                                <span
                                    className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getPriorityClass(item.priority)}`}
                                >
                                    {item.priority}
                                </span>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </article>
    );
}

function LegendItem({
    className,
    text,
}: {
    className: string;
    text: string;
}) {
    return (
        <div className='flex items-center gap-2'>
            <span
                className={`h-3 w-3 rounded-full border border-slate-200 ${className}`}
            />
            <span>{text}</span>
        </div>
    );
}
