'use client';

import { DragEvent, FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

type TodoPriority = 'Tinggi' | 'Sedang' | 'Rendah';
type TodoStatus = 'todo' | 'done';
type NotulenStatus = 'Draft' | 'Final' | 'Arsip';
type ModalMode = 'create' | 'edit' | 'detail' | 'history' | 'share' | 'notulen-detail';

type DashboardTodo = {
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
    created_at: string;
    updated_at: string;
};

type DashboardNotulen = {
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

type MutationStatus = 'pending' | 'success' | 'error';

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

function useDebouncedValue(value: string, delay = 180) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => setDebounced(value), delay);

        return () => window.clearTimeout(timeoutId);
    }, [delay, value]);

    return debounced;
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

function parsePointLines(value: string | null) {
    return (value ?? '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
}

function photoGallery(item: DashboardNotulen | null) {
    return (item?.documentation_photo_url ?? '')
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);
}

function renderBulletList(value: string | null) {
    const lines = parsePointLines(value);

    if (lines.length === 0) {
        return <p className='text-sm font-medium text-slate-400'>-</p>;
    }

    return (
        <ul className='list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700'>
            {lines.map((line, index) => (
                <li key={`${line}-${index}`}>{line}</li>
            ))}
        </ul>
    );
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
    const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
    const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null);
    const [sourceNotulen, setSourceNotulen] = useState<DashboardNotulen | null>(null);
    const [todoSearch, setTodoSearch] = useState('');
    const [doneSearch, setDoneSearch] = useState('');
    const [dailyNote, setDailyNote] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingShareLink, setIsGeneratingShareLink] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [draggedId, setDraggedId] = useState<number | null>(null);
    const [mutationStatuses, setMutationStatuses] = useState<Record<number, MutationStatus>>({});

    const debouncedTodoSearch = useDebouncedValue(todoSearch);
    const debouncedDoneSearch = useDebouncedValue(doneSearch);
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

    const todoQuery = debouncedTodoSearch.trim().toLowerCase();
    const doneQuery = debouncedDoneSearch.trim().toLowerCase();
    const activeTodos = useMemo(
        () => todosByDate.get(activeDate) ?? [],
        [activeDate, todosByDate],
    );
    const todoItems = useMemo(
        () =>
            activeTodos.filter((item) =>
                item.status === 'todo' && (todoQuery ? item.title.toLowerCase().includes(todoQuery) : true),
            ),
        [activeTodos, todoQuery],
    );
    const doneItems = useMemo(
        () =>
            activeTodos.filter((item) =>
                item.status === 'done' && (doneQuery ? item.title.toLowerCase().includes(doneQuery) : true),
            ),
        [activeTodos, doneQuery],
    );
    const totalToday = (todosByDate.get(activeDate) ?? []).length;
    const doneToday = (todosByDate.get(activeDate) ?? []).filter((item) => item.status === 'done').length;
    const todoToday = totalToday - doneToday;
    const progress = totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0;
    const historyDate = selectedHistoryDate ?? activeDate;
    const historyTodos = todosByDate.get(historyDate) ?? [];
    const historyNote = notesByDate.get(historyDate)?.note ?? '';
    const selectedTodo = todos.find((item) => item.id === selectedTodoId) ?? null;

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
        setSelectedTodoId(null);
        setSelectedHistoryDate(null);
        setSourceNotulen(null);
        setShareLink('');
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

    function openDetailModal(item: DashboardTodo) {
        setSelectedTodoId(item.id);
        setModalMode('detail');
    }

    async function openSourceNotulenModal(item: DashboardTodo) {
        if (!item.source_notulen_id) {
            return;
        }

        try {
            const response = await fetch('/api/admin/notulen', { method: 'GET', cache: 'no-store' });
            const result = (await response.json()) as { message?: string; notulen?: DashboardNotulen[] };

            if (!response.ok || !result.notulen) {
                throw new Error(result.message ?? 'Gagal memuat detail notulen.');
            }

            const found = result.notulen.find((notulen) => notulen.id === item.source_notulen_id);

            if (!found) {
                throw new Error('Notulen sumber tidak ditemukan.');
            }

            setSelectedTodoId(item.id);
            setSourceNotulen(found);
            setModalMode('notulen-detail');
        } catch (error) {
            await showErrorAlert(error instanceof Error ? error.message : 'Gagal memuat detail notulen.');
        }
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

    function setItemMutationStatus(id: number, status: MutationStatus) {
        setMutationStatuses((prev) => ({ ...prev, [id]: status }));

        if (status === 'success') {
            window.setTimeout(() => {
                setMutationStatuses((prev) => {
                    if (prev[id] !== 'success') {
                        return prev;
                    }

                    const next = { ...prev };
                    delete next[id];
                    return next;
                });
            }, 1800);
        }
    }

    async function updateStatus(item: DashboardTodo, status: TodoStatus) {
        if (item.status === status) {
            return;
        }

        const previousTodos = todos;
        const now = new Date().toISOString();

        setItemMutationStatus(item.id, 'pending');
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === item.id ? { ...todo, status, updated_at: now } : todo,
            ),
        );

        try {
            const response = await fetch(`/api/admin/todos/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify({ status }),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                console.error(result.message ?? 'Data gagal disimpan. Silakan coba lagi.');
                setTodos(previousTodos);
                setItemMutationStatus(item.id, 'error');
                return;
            }

            setItemMutationStatus(item.id, 'success');
        } catch {
            setTodos(previousTodos);
            setItemMutationStatus(item.id, 'error');
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

    function selectCalendarDate(dateKey: string) {
        setActiveDate(dateKey);
        setMonthDate(toLocalDate(dateKey));
    }

    function changeMonth(offset: number) {
        setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    }

    function openHistoryModal(dateKey: string) {
        setSelectedHistoryDate(dateKey);
        setModalMode('history');
    }

    async function openShareModal(dateKey?: string) {
        setIsGeneratingShareLink(true);
        setModalMode('share');
        setShareLink('');

        try {
            const response = await fetch('/api/admin/todos/share', {
                method: 'POST',
                cache: 'no-store',
            });
            const result = (await response.json()) as {
                message?: string;
                url?: string;
            };

            if (!response.ok || !result.url) {
                throw new Error(result.message ?? 'Gagal membuat link share.');
            }

            const url = new URL(result.url);

            if (dateKey) {
                url.searchParams.set('date', dateKey);
            }

            setShareLink(url.toString());
        } catch (error) {
            await showErrorAlert(error instanceof Error ? error.message : 'Gagal membuat link share.');
            setModalMode(null);
        } finally {
            setIsGeneratingShareLink(false);
        }
    }

    async function copyShareLink() {
        if (!shareLink) {
            return;
        }

        try {
            await navigator.clipboard.writeText(shareLink);
            await showSuccessAlert('Link berhasil disalin.');
        } catch {
            await showErrorAlert('Link gagal disalin. Silakan copy manual.');
        }
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
                            + Tambah Tugas
                        </button>
                        <button type='button' onClick={() => void openShareModal()} className='rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100'>
                            Share
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
                    onDragEnd={() => setDraggedId(null)}
                    onDetail={openDetailModal}
                    onComplete={updateStatus}
                    search={todoSearch}
                    onSearchChange={setTodoSearch}
                    searchPlaceholder='Cari tugas di To Do...'
                    mutationStatuses={mutationStatuses}
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
                    onDragEnd={() => setDraggedId(null)}
                    onDetail={openDetailModal}
                    onComplete={updateStatus}
                    search={doneSearch}
                    onSearchChange={setDoneSearch}
                    searchPlaceholder='Cari tugas di Done...'
                    mutationStatuses={mutationStatuses}
                />

                <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                        <div>
                            <h4 className='text-lg font-bold text-slate-900'>RIWAYAT KALENDER</h4>
                            <p className='mt-1 text-sm text-slate-600'>Klik tanggal untuk menampilkan tugas pada hari tersebut.</p>
                        </div>
                    </div>

                    <div className='mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4'>
                        <div className='flex flex-wrap items-center justify-between gap-2'>
                            <h5 className='text-sm font-bold text-slate-900'>{formatDateShort(activeDate)}</h5>
                            <input
                                type='date'
                                value={activeDate}
                                onChange={(event) => selectCalendarDate(event.target.value)}
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
                        <button type='button' onClick={() => openHistoryModal(activeDate)} className='ml-2 mt-3 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100'>
                            Riwayat Tanggal Ini
                        </button>
                    </div>

                    <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
                        <h5 className='text-sm font-bold capitalize text-slate-900'>{monthFormatter.format(monthDate)}</h5>
                        <div className='flex items-center gap-2'>
                            <button type='button' onClick={() => changeMonth(-1)} className='rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100'>Sebelumnya</button>
                            <button type='button' onClick={() => selectCalendarDate(getTodayDateInput())} className='rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100'>Bulan Ini</button>
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
                                    onClick={() => selectCalendarDate(key)}
                                    className={`min-h-16 border-b border-r border-slate-200 p-1.5 text-left transition hover:ring-2 hover:ring-cyan-300 ${key === activeDate ? 'ring-2 ring-cyan-500' : ''} ${isOutsideMonth ? 'opacity-60' : ''} ${getCalendarDayClass(key, dayTodos)}`}
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

            {modalMode === 'detail' && selectedTodo && (
                <Modal title='Detail Tugas' onClose={closeModal}>
                    <div className='space-y-5'>
                        <div className='flex flex-wrap items-start justify-between gap-3'>
                            <div>
                                <p className='text-sm font-bold uppercase tracking-[0.16em] text-slate-500'>JUDUL TUGAS</p>
                                <h4 className='mt-2 text-lg font-bold text-slate-900'>{selectedTodo.title}</h4>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getPriorityClass(selectedTodo.priority)}`}>{selectedTodo.priority}</span>
                        </div>

                        <div className='grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2'>
                            <p><span className='font-bold text-slate-900'>Status:</span> {selectedTodo.status === 'done' ? 'Selesai' : 'To Do'}</p>
                            <p><span className='font-bold text-slate-900'>Prioritas:</span> {selectedTodo.priority}</p>
                            <p><span className='font-bold text-slate-900'>Tanggal Dibuat:</span> {formatDateShort(selectedTodo.task_date)}</p>
                            <p><span className='font-bold text-slate-900'>Waktu Dibuat:</span> {formatTime(selectedTodo.created_at)}</p>
                        </div>

                        <section>
                            <h5 className='border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>Sumber</h5>
                            {selectedTodo.source_type === 'notulen' ? (
                                <div className='mt-3 space-y-3 text-sm text-slate-700'>
                                    <span className='inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700'>Dari Notulen</span>
                                    <p><span className='font-bold text-slate-900'>Nama Notulen:</span> {selectedTodo.source_notulen_title ?? '-'}</p>
                                    <p><span className='font-bold text-slate-900'>Tanggal Notulen:</span> {selectedTodo.source_meeting_date ? formatDateShort(selectedTodo.source_meeting_date) : '-'}</p>
                                </div>
                            ) : (
                                <p className='mt-3 text-sm font-medium text-slate-400'>-</p>
                            )}
                        </section>

                        <div className='flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4'>
                            {selectedTodo.source_type === 'notulen' && (
                                <button type='button' onClick={() => void openSourceNotulenModal(selectedTodo)} className='rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100'>
                                    Lihat Notulen
                                </button>
                            )}
                            <button type='button' onClick={() => openEditModal(selectedTodo)} className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'>Edit</button>
                            <button type='button' onClick={() => void handleDelete(selectedTodo)} className='rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700'>Hapus</button>
                        </div>
                    </div>
                </Modal>
            )}

            {modalMode === 'history' && (
                <Modal title='Riwayat Tugas' onClose={closeModal}>
                    <div className='space-y-5'>
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                            <h4 className='text-lg font-bold text-slate-900'>{formatDateShort(historyDate)}</h4>
                            <button type='button' onClick={() => void openShareModal(historyDate)} className='rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100'>
                                Share Hari Ini
                            </button>
                        </div>
                        <HistorySection title='TO DO' items={historyTodos.filter((item) => item.status === 'todo')} />
                        <HistorySection title='DONE' items={historyTodos.filter((item) => item.status === 'done')} />
                        <section>
                            <h5 className='border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>Catatan</h5>
                            <p className='mt-3 whitespace-pre-line text-sm leading-6 text-slate-700'>{historyNote || '-'}</p>
                        </section>
                    </div>
                </Modal>
            )}

            {modalMode === 'notulen-detail' && sourceNotulen && (
                <Modal title='Detail Notulen' onClose={closeModal}>
                    <div className='space-y-5'>
                        <div className='flex flex-wrap items-start justify-between gap-3'>
                            <div>
                                <p className='text-sm font-bold uppercase tracking-[0.16em] text-slate-500'>NOTULEN RAPAT</p>
                                <p className='mt-2 text-lg font-bold text-slate-900'>{formatDateShort(sourceNotulen.meeting_date)}</p>
                            </div>
                            <span className='inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700'>Dari Notulen</span>
                        </div>

                        <div className='grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2'>
                            <p><span className='font-bold text-slate-900'>Tanggal Notulen:</span> {formatDateShort(sourceNotulen.meeting_date)}</p>
                            <p><span className='font-bold text-slate-900'>Waktu:</span> {sourceNotulen.start_time ?? '-'} - {sourceNotulen.end_time ?? '-'}</p>
                            <p><span className='font-bold text-slate-900'>Tempat:</span> {sourceNotulen.place ?? '-'}</p>
                            <p><span className='font-bold text-slate-900'>Notulis:</span> {sourceNotulen.note_taker}</p>
                        </div>

                        <DetailSection title='HASIL RAPAT'>{renderBulletList(sourceNotulen.decisions)}</DetailSection>
                        <DetailSection title='FOTO RAPAT'>
                            {photoGallery(sourceNotulen).length > 0 ? (
                                <div className='grid gap-3 sm:grid-cols-2'>
                                    {photoGallery(sourceNotulen).map((url) => (
                                        <img key={url} src={url} alt='Foto dokumentasi notulen' className='max-h-72 w-full rounded-xl border border-slate-200 bg-slate-50 object-contain' />
                                    ))}
                                </div>
                            ) : (
                                <p className='text-sm font-medium text-slate-400'>-</p>
                            )}
                        </DetailSection>
                    </div>
                </Modal>
            )}

            {modalMode === 'share' && (
                <Modal title='Share To Do List' onClose={closeModal}>
                    <div className='space-y-4'>
                        <Field label='Link Publik To Do List' id='todo-share-link'>
                            <input
                                id='todo-share-link'
                                type='text'
                                value={isGeneratingShareLink ? 'Membuat link...' : shareLink}
                                readOnly
                                className='w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none'
                            />
                        </Field>
                        <div className='flex justify-end gap-3 border-t border-slate-200 pt-4'>
                            <button type='button' onClick={copyShareLink} disabled={!shareLink || isGeneratingShareLink} className='rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60'>
                                Copy Link
                            </button>
                            <button type='button' onClick={closeModal} className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'>
                                Tutup
                            </button>
                        </div>
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
    search,
    searchPlaceholder,
    mutationStatuses,
    onDrop,
    onDragOver,
    onDragStart,
    onDragEnd,
    onDetail,
    onComplete,
    onSearchChange,
}: {
    title: string;
    emptyText: string;
    items: DashboardTodo[];
    status: TodoStatus;
    draggedId: number | null;
    search: string;
    searchPlaceholder: string;
    mutationStatuses: Record<number, MutationStatus>;
    onDrop: (status: TodoStatus) => Promise<void>;
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    onDragStart: (item: DashboardTodo) => void;
    onDragEnd: () => void;
    onDetail: (item: DashboardTodo) => void;
    onComplete: (item: DashboardTodo, status: TodoStatus) => Promise<void>;
    onSearchChange: (value: string) => void;
}) {
    return (
        <article className='rounded-2xl border border-slate-200 bg-white p-5' onDragOver={onDragOver} onDrop={() => void onDrop(status)}>
            <div className='flex items-center justify-between gap-2'>
                <h4 className='text-lg font-bold text-slate-900'>{title}</h4>
                <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600'>{items.length}</span>
            </div>
            <input
                type='search'
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                className='mt-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
            />
            <div className='mt-4 min-h-80 space-y-3'>
                {items.length === 0 ? (
                    <p className='rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm font-medium text-slate-500'>{emptyText}</p>
                ) : (
                    items.map((item) => (
                        <article
                            key={item.id}
                            draggable
                            onDragStart={() => onDragStart(item)}
                            onDragEnd={onDragEnd}
                            onDoubleClick={() => onDetail(item)}
                            className={`relative rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:cursor-grab active:cursor-grabbing ${draggedId === item.id ? 'opacity-60 cursor-grabbing' : ''}`}
                        >
                            <MutationIndicator status={mutationStatuses[item.id]} />
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <h5 className='font-bold text-slate-900'>{item.title}</h5>
                                    {item.source_type === 'notulen' && (
                                        <span className='mt-2 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-700'>Dari Notulen</span>
                                    )}
                                    <p className='mt-2 text-xs font-semibold text-slate-500'>Dibuat {formatTime(item.created_at)}</p>
                                </div>
                                <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getPriorityClass(item.priority)}`}>{item.priority}</span>
                            </div>
                            {status === 'todo' && (
                                <div className='mt-4 flex justify-end'>
                                    <button
                                        type='button'
                                        onClick={() => void onComplete(item, 'done')}
                                        className='rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100'
                                    >
                                        Selesai
                                    </button>
                                </div>
                            )}
                        </article>
                    ))
                )}
            </div>
        </article>
    );
}

function MutationIndicator({ status }: { status?: MutationStatus }) {
    if (!status) {
        return null;
    }

    if (status === 'success') {
        return (
            <span className='absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white' title='Tersimpan'>
                ✓
            </span>
        );
    }

    if (status === 'error') {
        return <span className='absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500' title='Gagal tersimpan' />;
    }

    return <span className='absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500' title='Belum tersimpan' />;
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h5 className='border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>{title}</h5>
            <div className='mt-3'>{children}</div>
        </section>
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
