'use client';

import { DragEvent, FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

type TodoPriority = 'Tinggi' | 'Sedang' | 'Rendah';
type TodoStatus = 'todo' | 'done';
type ModalMode = 'create' | 'edit' | 'history';

type DashboardTodo = {
    id: number;
    task_date: string;
    title: string;
    priority: TodoPriority;
    status: TodoStatus;
    created_at: string;
    updated_at: string;
};

type DashboardTodoNote = {
    note_date: string;
    note: string;
    created_at: string;
    updated_at: string;
};

type TodoFormState = {
    title: string;
    priority: TodoPriority;
};

const priorities: TodoPriority[] = ['Tinggi', 'Sedang', 'Rendah'];
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
const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
});
const swalConfirmButtonColor = '#0891b2';
const swalCancelButtonColor = '#475569';
const swalDeleteButtonColor = '#dc2626';

function showSuccessAlert(text: string, title = 'Berhasil!') {
    return Swal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonColor: swalConfirmButtonColor,
    });
}

function showErrorAlert(text: string, title = 'Gagal!') {
    return Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: swalConfirmButtonColor,
    });
}

function confirmSaveChanges() {
    return Swal.fire({
        icon: 'warning',
        title: 'Simpan Perubahan?',
        text: 'Perubahan yang Anda lakukan akan disimpan.',
        showCancelButton: true,
        confirmButtonText: 'Ya, Simpan',
        cancelButtonText: 'Batal',
        confirmButtonColor: swalConfirmButtonColor,
        cancelButtonColor: swalCancelButtonColor,
    });
}

function confirmDeleteTodo() {
    return Swal.fire({
        icon: 'warning',
        title: 'Hapus Data?',
        text: 'Hapus tugas ini?',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: swalDeleteButtonColor,
        cancelButtonColor: swalCancelButtonColor,
    });
}

function getDefaultFormState(): TodoFormState {
    return {
        title: '',
        priority: 'Sedang',
    };
}

function toDateInputValue(date: Date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}

function getTodayDateInput() {
    return toDateInputValue(new Date());
}

function toLocalDate(value: string) {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
}

function formatDateShort(value: string) {
    return dateFormatter.format(toLocalDate(value));
}

function formatTime(value: string) {
    return timeFormatter.format(new Date(value));
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

function getPriorityClass(priority: TodoPriority) {
    if (priority === 'Tinggi') {
        return 'border-red-200 bg-red-50 text-red-700';
    }

    if (priority === 'Rendah') {
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }

    return 'border-amber-200 bg-amber-50 text-amber-700';
}

function getCalendarDayClass(dateKey: string, todos: DashboardTodo[]) {
    if (dateKey === getTodayDateInput()) {
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }

    if (todos.length === 0) {
        return 'bg-slate-50/60 text-slate-400';
    }

    const doneCount = todos.filter((item) => item.status === 'done').length;
    const isPast = dateKey < getTodayDateInput();

    if (doneCount === todos.length) {
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    }

    if (isPast) {
        return 'border-red-200 bg-red-50 text-red-800';
    }

    return 'border-amber-200 bg-amber-50 text-amber-800';
}

function Modal({
    title,
    children,
    onClose,
}: {
    title: string;
    children: ReactNode;
    onClose: () => void;
}) {
    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm'>
            <div className='max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl'>
                <div className='sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4'>
                    <h4 className='text-lg font-bold text-slate-900'>{title}</h4>
                    <button
                        type='button'
                        onClick={onClose}
                        className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-xl font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700'
                        aria-label='Tutup modal'
                    >
                        x
                    </button>
                </div>
                <div className='p-5'>{children}</div>
            </div>
        </div>
    );
}

export function TodoListPanel() {
    const [todos, setTodos] = useState<DashboardTodo[]>([]);
    const [notes, setNotes] = useState<DashboardTodoNote[]>([]);
    const [form, setForm] = useState<TodoFormState>(getDefaultFormState());
    const [activeDate, setActiveDate] = useState(getTodayDateInput());
    const [monthDate, setMonthDate] = useState(() => toLocalDate(getTodayDateInput()));
    const [modalMode, setModalMode] = useState<ModalMode | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [dailyNote, setDailyNote] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    const visibleDays = useMemo(() => buildCalendarDays(monthDate), [monthDate]);
    const notesByDate = useMemo(() => {
        const map = new Map<string, DashboardTodoNote>();

        for (const note of notes) {
            map.set(note.note_date.slice(0, 10), note);
        }

        return map;
    }, [notes]);
    const todosByDate = useMemo(() => {
        const map = new Map<string, DashboardTodo[]>();

        for (const todo of todos) {
            const key = todo.task_date.slice(0, 10);
            map.set(key, [...(map.get(key) ?? []), todo]);
        }

        return map;
    }, [todos]);

    const query = search.trim().toLowerCase();
    const activeTodos = useMemo(
        () =>
            (todosByDate.get(activeDate) ?? []).filter((item) =>
                query ? item.title.toLowerCase().includes(query) : true,
            ),
        [activeDate, query, todosByDate],
    );
    const todoItems = activeTodos.filter((item) => item.status === 'todo');
    const doneItems = activeTodos.filter((item) => item.status === 'done');
    const totalToday = (todosByDate.get(activeDate) ?? []).length;
    const doneToday = (todosByDate.get(activeDate) ?? []).filter((item) => item.status === 'done').length;
    const todoToday = totalToday - doneToday;
    const progress = totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0;
    const historyDate = selectedHistoryDate ?? activeDate;
    const historyTodos = (todosByDate.get(historyDate) ?? []).filter((item) =>
        query ? item.title.toLowerCase().includes(query) : true,
    );
    const historyNote = notesByDate.get(historyDate)?.note ?? '';

    const fetchTodos = useCallback(async () => {
        const response = await fetch('/api/admin/todos', { method: 'GET', cache: 'no-store' });
        const result = (await response.json()) as {
            message?: string;
            todos?: DashboardTodo[];
            notes?: DashboardTodoNote[];
        };

        if (!response.ok || !result.todos || !result.notes) {
            throw new Error(result.message ?? 'Gagal memuat To Do List.');
        }

        return {
            todos: result.todos,
            notes: result.notes,
        };
    }, []);

    const refreshTodos = useCallback(async () => {
        setIsLoading(true);

        try {
            const result = await fetchTodos();
            setTodos(result.todos);
            setNotes(result.notes);
            setDailyNote(result.notes.find((item) => item.note_date.slice(0, 10) === activeDate)?.note ?? '');
        } catch (error) {
            await showErrorAlert(error instanceof Error ? error.message : 'Terjadi masalah koneksi saat memuat To Do List.');
        } finally {
            setIsLoading(false);
        }
    }, [activeDate, fetchTodos]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshTodos();
    }, [refreshTodos]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDailyNote(notesByDate.get(activeDate)?.note ?? '');
    }, [activeDate, notesByDate]);

    function closeModal() {
        setModalMode(null);
        setEditingId(null);
        setSelectedHistoryDate(null);
        setForm(getDefaultFormState());
    }

    function openCreateModal() {
        setForm(getDefaultFormState());
        setEditingId(null);
        setModalMode('create');
    }

    function openEditModal(item: DashboardTodo) {
        setEditingId(item.id);
        setForm({
            title: item.title,
            priority: item.priority,
        });
        setModalMode('edit');
    }

    async function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const isEditing = editingId !== null;

        if (isEditing) {
            const confirmation = await confirmSaveChanges();

            if (!confirmation.isConfirmed) {
                return;
            }
        }

        setIsSubmitting(true);

        const endpoint = isEditing ? `/api/admin/todos/${editingId}` : '/api/admin/todos';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const editingTodo = todos.find((item) => item.id === editingId);
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskDate: editingTodo?.task_date.slice(0, 10) ?? activeDate,
                    title: form.title,
                    priority: form.priority,
                }),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Data gagal disimpan. Silakan coba lagi.');
                return;
            }

            await refreshTodos();
            closeModal();
            await showSuccessAlert(isEditing ? 'To Do berhasil diperbarui.' : 'To Do berhasil disimpan.');
        } catch {
            await showErrorAlert('Data gagal disimpan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function updateStatus(item: DashboardTodo, status: TodoStatus) {
        if (item.status === status) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/todos/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Data gagal disimpan. Silakan coba lagi.');
                return;
            }

            await refreshTodos();
            await showSuccessAlert(status === 'done' ? 'To Do berhasil dipindahkan ke Done.' : 'To Do berhasil dipindahkan kembali.');
        } catch {
            await showErrorAlert('Data gagal disimpan. Silakan coba lagi.');
        }
    }

    async function handleDelete(item: DashboardTodo) {
        const confirmation = await confirmDeleteTodo();

        if (!confirmation.isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/todos/${item.id}`, { method: 'DELETE' });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Data gagal dihapus.');
                return;
            }

            await refreshTodos();
            await showSuccessAlert('Data berhasil dihapus.');
        } catch {
            await showErrorAlert('Data gagal dihapus.');
        }
    }

    async function moveToTomorrow(item: DashboardTodo) {
        const nextDate = toLocalDate(item.task_date);
        nextDate.setDate(nextDate.getDate() + 1);

        try {
            const response = await fetch(`/api/admin/todos/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskDate: toDateInputValue(nextDate) }),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Data gagal disimpan. Silakan coba lagi.');
                return;
            }

            await refreshTodos();
            await showSuccessAlert('To Do berhasil dipindahkan ke besok.');
        } catch {
            await showErrorAlert('Data gagal disimpan. Silakan coba lagi.');
        }
    }

    async function saveDailyNote() {
        try {
            const response = await fetch('/api/admin/todos', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    noteDate: activeDate,
                    note: dailyNote,
                }),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Data gagal disimpan. Silakan coba lagi.');
                return;
            }

            await refreshTodos();
            await showSuccessAlert('Catatan hari ini berhasil disimpan.');
        } catch {
            await showErrorAlert('Data gagal disimpan. Silakan coba lagi.');
        }
    }

    function handleDragStart(item: DashboardTodo) {
        setDraggedId(item.id);
    }

    function handleDragOver(event: DragEvent<HTMLElement>) {
        event.preventDefault();
    }

    async function handleDrop(status: TodoStatus) {
        const item = todos.find((todo) => todo.id === draggedId);
        setDraggedId(null);

        if (!item) {
            return;
        }

        await updateStatus(item, status);
    }

    function changeMonth(offset: number) {
        setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    }

    function openHistoryModal(dateKey: string) {
        setSelectedHistoryDate(dateKey);
        setModalMode('history');
    }

    const formTitle = modalMode === 'edit' ? 'Edit Tugas' : 'Tambah Tugas';

    return (
        <section className='space-y-4'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>To Do List</h3>
                        <p className='mt-2 text-sm font-medium text-slate-600'>Kelola tugas harian dan riwayat pekerjaan.</p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <button type='button' onClick={openCreateModal} className='rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'>
                            Tambah Tugas
                        </button>
                        <button type='button' onClick={() => void refreshTodos()} disabled={isLoading} className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'>
                            {isLoading ? 'Memuat...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                <div className='mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                    {[
                        ['Total Tugas', totalToday],
                        ['Selesai', doneToday],
                        ['Belum Selesai', todoToday],
                        ['Progress', `${progress}%`],
                    ].map(([label, value]) => (
                        <article key={label} className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>{label}</p>
                            <p className='mt-1 text-2xl font-bold text-slate-900'>{value}</p>
                        </article>
                    ))}
                </div>
                <div className='mt-4 h-3 overflow-hidden rounded-full bg-slate-200'>
                    <div className='h-full rounded-full bg-cyan-600 transition-all' style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className='grid gap-4 xl:grid-cols-[1fr_1fr_1.1fr]'>
                <TaskColumn
                    title='TO DO'
                    emptyText='Belum ada tugas aktif.'
                    items={todoItems}
                    status='todo'
                    draggedId={draggedId}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    onMoveTomorrow={moveToTomorrow}
                />
                <TaskColumn
                    title='DONE'
                    emptyText='Belum ada tugas selesai.'
                    items={doneItems}
                    status='done'
                    draggedId={draggedId}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    onMoveTomorrow={moveToTomorrow}
                />

                <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                        <div>
                            <h4 className='text-lg font-bold text-slate-900'>RIWAYAT KALENDER</h4>
                            <p className='mt-1 text-sm text-slate-600'>Klik tanggal untuk membuka riwayat tugas.</p>
                        </div>
                        <input
                            type='search'
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder='Cari Tugas'
                            className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2 sm:w-56'
                        />
                    </div>

                    <div className='mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4'>
                        <div className='flex flex-wrap items-center justify-between gap-2'>
                            <h5 className='text-sm font-bold text-slate-900'>{formatDateShort(activeDate)}</h5>
                            <input
                                type='date'
                                value={activeDate}
                                onChange={(event) => setActiveDate(event.target.value)}
                                className='rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 outline-none ring-cyan-400 focus:border-cyan-500 focus:ring-2'
                            />
                        </div>
                        <label htmlFor='todo-daily-note' className='mt-3 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>Catatan Hari Ini</label>
                        <textarea
                            id='todo-daily-note'
                            value={dailyNote}
                            onChange={(event) => setDailyNote(event.target.value)}
                            rows={4}
                            placeholder='Meeting client ditunda.'
                            className='mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                        />
                        <button type='button' onClick={() => void saveDailyNote()} className='mt-3 rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'>
                            Simpan Catatan
                        </button>
                    </div>

                    <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
                        <h5 className='text-sm font-bold capitalize text-slate-900'>{monthFormatter.format(monthDate)}</h5>
                        <div className='flex items-center gap-2'>
                            <button type='button' onClick={() => changeMonth(-1)} className='rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100'>Sebelumnya</button>
                            <button type='button' onClick={() => setMonthDate(toLocalDate(getTodayDateInput()))} className='rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100'>Bulan Ini</button>
                            <button type='button' onClick={() => changeMonth(1)} className='rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100'>Berikutnya</button>
                        </div>
                    </div>

                    <div className='mt-4 grid grid-cols-7 border-l border-t border-slate-200 text-sm'>
                        {visibleDays.slice(0, 7).map((date) => (
                            <div key={dayFormatter.format(date)} className='border-b border-r border-slate-200 bg-slate-50 px-1 py-2 text-center text-[11px] font-bold uppercase text-slate-500'>
                                {dayFormatter.format(date)}
                            </div>
                        ))}
                        {visibleDays.map((date) => {
                            const key = toDateInputValue(date);
                            const dayTodos = todosByDate.get(key) ?? [];
                            const isOutsideMonth = date.getMonth() !== monthDate.getMonth();

                            return (
                                <button
                                    key={key}
                                    type='button'
                                    onClick={() => openHistoryModal(key)}
                                    className={`min-h-16 border-b border-r border-slate-200 p-1.5 text-left transition hover:ring-2 hover:ring-cyan-300 ${isOutsideMonth ? 'opacity-60' : ''} ${getCalendarDayClass(key, dayTodos)}`}
                                >
                                    <span className='block text-xs font-bold'>{date.getDate()}</span>
                                    {dayTodos.length > 0 && <span className='mt-1 block text-[11px] font-bold'>{dayTodos.filter((item) => item.status === 'done').length}/{dayTodos.length}</span>}
                                </button>
                            );
                        })}
                    </div>
                </article>
            </div>

            {(modalMode === 'create' || modalMode === 'edit') && (
                <Modal title={formTitle} onClose={closeModal}>
                    <form className='space-y-4' onSubmit={handleSave}>
                        <Field label='Judul Tugas' id='todo-title'>
                            <input
                                id='todo-title'
                                type='text'
                                value={form.title}
                                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                                placeholder='Follow Up Client'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </Field>
                        <Field label='Prioritas' id='todo-priority'>
                            <select
                                id='todo-priority'
                                value={form.priority}
                                onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value as TodoPriority }))}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                            >
                                {priorities.map((priority) => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                        </Field>

                        <div className='flex justify-end gap-3 border-t border-slate-200 pt-4'>
                            <button type='button' onClick={closeModal} className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'>Batal</button>
                            <button type='submit' disabled={isSubmitting} className='rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:opacity-70'>
                                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modalMode === 'history' && (
                <Modal title='Riwayat Tugas' onClose={closeModal}>
                    <div className='space-y-5'>
                        <h4 className='text-lg font-bold text-slate-900'>{formatDateShort(historyDate)}</h4>
                        <HistorySection title='TO DO' items={historyTodos.filter((item) => item.status === 'todo')} />
                        <HistorySection title='DONE' items={historyTodos.filter((item) => item.status === 'done')} />
                        <section>
                            <h5 className='border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>Catatan</h5>
                            <p className='mt-3 whitespace-pre-line text-sm leading-6 text-slate-700'>{historyNote || '-'}</p>
                        </section>
                    </div>
                </Modal>
            )}
        </section>
    );
}

function TaskColumn({
    title,
    emptyText,
    items,
    status,
    draggedId,
    onDrop,
    onDragOver,
    onDragStart,
    onEdit,
    onDelete,
    onMoveTomorrow,
}: {
    title: string;
    emptyText: string;
    items: DashboardTodo[];
    status: TodoStatus;
    draggedId: number | null;
    onDrop: (status: TodoStatus) => Promise<void>;
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    onDragStart: (item: DashboardTodo) => void;
    onEdit: (item: DashboardTodo) => void;
    onDelete: (item: DashboardTodo) => Promise<void>;
    onMoveTomorrow: (item: DashboardTodo) => Promise<void>;
}) {
    return (
        <article className='rounded-2xl border border-slate-200 bg-white p-5' onDragOver={onDragOver} onDrop={() => void onDrop(status)}>
            <div className='flex items-center justify-between gap-2'>
                <h4 className='text-lg font-bold text-slate-900'>{title}</h4>
                <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600'>{items.length}</span>
            </div>
            <div className='mt-4 min-h-80 space-y-3'>
                {items.length === 0 ? (
                    <p className='rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm font-medium text-slate-500'>{emptyText}</p>
                ) : (
                    items.map((item) => (
                        <article key={item.id} draggable onDragStart={() => onDragStart(item)} className={`rounded-xl border border-slate-200 bg-slate-50 p-4 transition ${draggedId === item.id ? 'opacity-60' : ''}`}>
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <h5 className='font-bold text-slate-900'>{item.title}</h5>
                                    <p className='mt-2 text-xs font-semibold text-slate-500'>Dibuat {formatTime(item.created_at)}</p>
                                </div>
                                <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getPriorityClass(item.priority)}`}>{item.priority}</span>
                            </div>
                            <div className='mt-4 flex flex-wrap gap-2'>
                                <button type='button' onClick={() => onEdit(item)} className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-white'>Edit</button>
                                <button type='button' onClick={() => void onMoveTomorrow(item)} className='rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100'>Pindah ke Besok</button>
                                <button type='button' onClick={() => void onDelete(item)} className='rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 transition hover:bg-red-50'>Hapus</button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </article>
    );
}

function HistorySection({ title, items }: { title: string; items: DashboardTodo[] }) {
    return (
        <section>
            <h5 className='border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>{title}</h5>
            {items.length === 0 ? (
                <p className='mt-3 text-sm font-medium text-slate-400'>-</p>
            ) : (
                <ul className='mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700'>
                    {items.map((item) => (
                        <li key={item.id}>{item.title}</li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
    return (
        <div>
            <label htmlFor={id} className='mb-1 block text-sm font-semibold text-slate-700'>{label}</label>
            {children}
        </div>
    );
}
