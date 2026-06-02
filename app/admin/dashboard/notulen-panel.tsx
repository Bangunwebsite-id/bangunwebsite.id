'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type NotulenStatus = 'Draft' | 'Final' | 'Arsip';

type DashboardNotulen = {
    id: number;
    title: string;
    meeting_date: string;
    start_time: string | null;
    end_time: string | null;
    place: string | null;
    leader: string;
    note_taker: string;
    attendees: string | null;
    agenda: string | null;
    decisions: string | null;
    follow_up: string | null;
    notes: string | null;
    status: NotulenStatus;
    created_at: string;
    updated_at: string;
};

type NotulenFormState = {
    title: string;
    meetingDate: string;
    startTime: string;
    endTime: string;
    place: string;
    leader: string;
    noteTaker: string;
    attendees: string;
    agenda: string;
    decisions: string;
    followUp: string;
    notes: string;
    status: NotulenStatus;
};

const pageSize = 5;
const statuses: NotulenStatus[] = ['Draft', 'Final', 'Arsip'];

function getTodayDateInput() {
    return new Date().toISOString().slice(0, 10);
}

function getDefaultFormState(): NotulenFormState {
    return {
        title: '',
        meetingDate: getTodayDateInput(),
        startTime: '',
        endTime: '',
        place: '',
        leader: '',
        noteTaker: '',
        attendees: '',
        agenda: '',
        decisions: '',
        followUp: '',
        notes: '',
        status: 'Draft',
    };
}

function formatDateShort(value: string) {
    return new Date(value).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function formatMonthKey(value: string) {
    return new Date(value).toISOString().slice(0, 7);
}

function getStatusClass(status: NotulenStatus) {
    if (status === 'Final') {
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }

    if (status === 'Arsip') {
        return 'border-slate-200 bg-slate-100 text-slate-700';
    }

    return 'border-amber-200 bg-amber-50 text-amber-700';
}

function renderMultiline(value: string | null) {
    const lines = (value ?? '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

    if (lines.length === 0) {
        return <p className='text-sm font-medium text-slate-400'>-</p>;
    }

    return (
        <div className='space-y-1'>
            {lines.map((line, index) => (
                <p key={`${line}-${index}`} className='text-sm leading-6 text-slate-700'>
                    {line}
                </p>
            ))}
        </div>
    );
}

function buildPrintDocument(item: DashboardNotulen) {
    const timeRange = `${item.start_time ?? '-'} - ${item.end_time ?? '-'}`;
    const sections = [
        ['DAFTAR HADIR', item.attendees],
        ['AGENDA RAPAT', item.agenda],
        ['HASIL RAPAT', item.decisions],
        ['TINDAK LANJUT', item.follow_up],
        ['CATATAN TAMBAHAN', item.notes],
        ['STATUS', item.status],
    ];

    const escapeHtml = (value: string | null) =>
        (value ?? '-')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br />');

    return `
        <!doctype html>
        <html>
            <head>
                <title>Notulen - ${escapeHtml(item.title)}</title>
                <style>
                    body { font-family: Arial, sans-serif; color: #0f172a; margin: 40px; }
                    h1 { text-align: center; font-size: 22px; letter-spacing: 0.08em; margin-bottom: 28px; }
                    h2 { font-size: 18px; text-align: center; margin: 0 0 24px; }
                    .meta { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
                    .meta td { padding: 6px 0; vertical-align: top; }
                    .meta td:first-child { width: 150px; font-weight: 700; }
                    section { margin-top: 24px; page-break-inside: avoid; }
                    h3 { border-bottom: 1px solid #cbd5e1; font-size: 13px; letter-spacing: 0.08em; padding-bottom: 8px; }
                    p { line-height: 1.65; white-space: normal; }
                </style>
            </head>
            <body>
                <h1>NOTULEN RAPAT</h1>
                <h2>${escapeHtml(item.title)}</h2>
                <table class="meta">
                    <tr><td>Hari, Tanggal</td><td>${formatDateShort(item.meeting_date)}</td></tr>
                    <tr><td>Waktu</td><td>${escapeHtml(timeRange)}</td></tr>
                    <tr><td>Tempat</td><td>${escapeHtml(item.place)}</td></tr>
                    <tr><td>Pemimpin Rapat</td><td>${escapeHtml(item.leader)}</td></tr>
                    <tr><td>Notulis</td><td>${escapeHtml(item.note_taker)}</td></tr>
                </table>
                ${sections
                    .map(
                        ([title, content]) => `
                            <section>
                                <h3>${title}</h3>
                                <p>${escapeHtml(content)}</p>
                            </section>
                        `,
                    )
                    .join('')}
            </body>
        </html>
    `;
}

export function NotulenPanel() {
    const [notulen, setNotulen] = useState<DashboardNotulen[]>([]);
    const [form, setForm] = useState<NotulenFormState>(getDefaultFormState());
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const filteredNotulen = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return notulen;
        }

        return notulen.filter((item) =>
            item.title.toLowerCase().includes(query),
        );
    }, [notulen, search]);

    const totalPages = Math.max(1, Math.ceil(filteredNotulen.length / pageSize));
    const paginatedNotulen = filteredNotulen.slice(
        (page - 1) * pageSize,
        page * pageSize,
    );
    const selectedNotulen =
        notulen.find((item) => item.id === selectedId) ?? notulen[0] ?? null;
    const currentMonthKey = new Date().toISOString().slice(0, 7);
    const thisMonthTotal = notulen.filter(
        (item) => formatMonthKey(item.meeting_date) === currentMonthKey,
    ).length;
    const draftTotal = notulen.filter((item) => item.status === 'Draft').length;
    const finalTotal = notulen.filter((item) => item.status === 'Final').length;

    const fetchNotulen = useCallback(async () => {
        const response = await fetch('/api/admin/notulen', {
            method: 'GET',
            cache: 'no-store',
        });
        const result = (await response.json()) as {
            message?: string;
            notulen?: DashboardNotulen[];
        };

        if (!response.ok || !result.notulen) {
            throw new Error(result.message ?? 'Gagal memuat data notulen.');
        }

        return result.notulen;
    }, []);

    const refreshNotulen = useCallback(async () => {
        setIsLoading(true);
        setFeedback(null);

        try {
            const nextNotulen = await fetchNotulen();
            setNotulen(nextNotulen);
            setIsLoaded(true);
            setSelectedId((current) => current ?? nextNotulen[0]?.id ?? null);
            setPage(1);
        } catch (error) {
            setFeedback({
                type: 'error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Terjadi masalah koneksi saat memuat notulen.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [fetchNotulen]);

    useEffect(() => {
        let isActive = true;

        async function loadInitialNotulen() {
            try {
                const nextNotulen = await fetchNotulen();

                if (!isActive) {
                    return;
                }

                setNotulen(nextNotulen);
                setIsLoaded(true);
                setSelectedId(nextNotulen[0]?.id ?? null);
                setPage(1);
            } catch (error) {
                if (!isActive) {
                    return;
                }

                setFeedback({
                    type: 'error',
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Terjadi masalah koneksi saat memuat notulen.',
                });
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        void loadInitialNotulen();

        return () => {
            isActive = false;
        };
    }, [fetchNotulen]);

    function resetForm(clearFeedback = true) {
        setEditingId(null);
        setForm(getDefaultFormState());
        if (clearFeedback) {
            setFeedback(null);
        }
    }

    function handleEdit(item: DashboardNotulen) {
        setEditingId(item.id);
        setSelectedId(item.id);
        setFeedback(null);
        setForm({
            title: item.title,
            meetingDate: item.meeting_date,
            startTime: item.start_time ?? '',
            endTime: item.end_time ?? '',
            place: item.place ?? '',
            leader: item.leader,
            noteTaker: item.note_taker,
            attendees: item.attendees ?? '',
            agenda: item.agenda ?? '',
            decisions: item.decisions ?? '',
            followUp: item.follow_up ?? '',
            notes: item.notes ?? '',
            status: item.status,
        });
    }

    async function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);

        const endpoint = editingId
            ? `/api/admin/notulen/${editingId}`
            : '/api/admin/notulen';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                setFeedback({
                    type: 'error',
                    message: result.message ?? 'Gagal menyimpan notulen.',
                });
                return;
            }

            setFeedback({
                type: 'success',
                message:
                    result.message ??
                    (editingId
                        ? 'Notulen berhasil diperbarui.'
                        : 'Notulen berhasil dibuat.'),
            });
            await refreshNotulen();
            resetForm(false);
        } catch {
            setFeedback({
                type: 'error',
                message: 'Terjadi masalah koneksi. Coba lagi beberapa saat.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm('Yakin ingin menghapus notulen ini?');
        if (!confirmed) {
            return;
        }

        setDeletingId(id);
        setFeedback(null);

        try {
            const response = await fetch(`/api/admin/notulen/${id}`, {
                method: 'DELETE',
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                setFeedback({
                    type: 'error',
                    message: result.message ?? 'Gagal menghapus notulen.',
                });
                return;
            }

            if (editingId === id) {
                resetForm(false);
            }

            setFeedback({
                type: 'success',
                message: result.message ?? 'Notulen berhasil dihapus.',
            });
            await refreshNotulen();
        } catch {
            setFeedback({
                type: 'error',
                message: 'Terjadi masalah koneksi saat menghapus notulen.',
            });
        } finally {
            setDeletingId(null);
        }
    }

    function handleExportPdf(item: DashboardNotulen) {
        const printWindow = window.open('', '_blank', 'width=900,height=1200');
        if (!printWindow) {
            setFeedback({
                type: 'error',
                message: 'Popup print diblokir browser. Izinkan popup lalu coba lagi.',
            });
            return;
        }

        printWindow.document.open();
        printWindow.document.write(buildPrintDocument(item));
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    return (
        <section className='space-y-4'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>
                            Dashboard Notulen
                        </h3>
                        <p className='mt-2 text-sm font-medium text-slate-600'>
                            Kelola catatan rapat resmi dari dashboard admin.
                        </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <button
                            type='button'
                            onClick={() => resetForm()}
                            className='rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                        >
                            Tambah Notulen
                        </button>
                        <button
                            type='button'
                            onClick={() => void refreshNotulen()}
                            disabled={isLoading}
                            className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            {isLoading ? 'Memuat...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                {feedback && (
                    <p
                        className={`mt-3 rounded-xl border px-3 py-2 text-sm font-semibold ${
                            feedback.type === 'success'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-red-200 bg-red-50 text-red-700'
                        }`}
                    >
                        {feedback.message}
                    </p>
                )}

                <div className='mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                    <article className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                        <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                            Total Notulen
                        </p>
                        <p className='mt-1 text-2xl font-bold text-slate-900'>
                            {isLoaded ? notulen.length : isLoading ? '...' : '-'}
                        </p>
                    </article>
                    <article className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                        <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                            Notulen Bulan Ini
                        </p>
                        <p className='mt-1 text-2xl font-bold text-slate-900'>
                            {isLoaded ? thisMonthTotal : isLoading ? '...' : '-'}
                        </p>
                    </article>
                    <article className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                        <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                            Draft
                        </p>
                        <p className='mt-1 text-2xl font-bold text-slate-900'>
                            {isLoaded ? draftTotal : isLoading ? '...' : '-'}
                        </p>
                    </article>
                    <article className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                        <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                            Final
                        </p>
                        <p className='mt-1 text-2xl font-bold text-slate-900'>
                            {isLoaded ? finalTotal : isLoading ? '...' : '-'}
                        </p>
                    </article>
                </div>
            </div>

            <div className='grid gap-4 xl:grid-cols-5'>
                <article className='rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2'>
                    <div className='flex items-center justify-between gap-2'>
                        <h4 className='text-lg font-bold text-slate-900'>
                            {editingId ? 'Edit Notulen' : 'Tambah Notulen'}
                        </h4>
                        {editingId && (
                            <button
                                type='button'
                                onClick={() => resetForm()}
                                className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100'
                            >
                                Batal Edit
                            </button>
                        )}
                    </div>

                    <form className='mt-4 space-y-3' onSubmit={handleSave}>
                        <div>
                            <label htmlFor='notulen-title' className='mb-1 block text-sm font-semibold text-slate-700'>
                                Judul Rapat
                            </label>
                            <input
                                id='notulen-title'
                                type='text'
                                value={form.title}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, title: event.target.value }))
                                }
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </div>

                        <div className='grid gap-3 sm:grid-cols-2'>
                            <div>
                                <label htmlFor='notulen-date' className='mb-1 block text-sm font-semibold text-slate-700'>
                                    Tanggal
                                </label>
                                <input
                                    id='notulen-date'
                                    type='date'
                                    value={form.meetingDate}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, meetingDate: event.target.value }))
                                    }
                                    className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor='notulen-place' className='mb-1 block text-sm font-semibold text-slate-700'>
                                    Tempat
                                </label>
                                <input
                                    id='notulen-place'
                                    type='text'
                                    value={form.place}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, place: event.target.value }))
                                    }
                                    className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                />
                            </div>
                        </div>

                        <div className='grid gap-3 sm:grid-cols-2'>
                            <div>
                                <label htmlFor='notulen-start' className='mb-1 block text-sm font-semibold text-slate-700'>
                                    Waktu Mulai
                                </label>
                                <input
                                    id='notulen-start'
                                    type='time'
                                    value={form.startTime}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, startTime: event.target.value }))
                                    }
                                    className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                />
                            </div>
                            <div>
                                <label htmlFor='notulen-end' className='mb-1 block text-sm font-semibold text-slate-700'>
                                    Waktu Selesai
                                </label>
                                <input
                                    id='notulen-end'
                                    type='time'
                                    value={form.endTime}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, endTime: event.target.value }))
                                    }
                                    className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                />
                            </div>
                        </div>

                        <div className='grid gap-3 sm:grid-cols-2'>
                            <div>
                                <label htmlFor='notulen-leader' className='mb-1 block text-sm font-semibold text-slate-700'>
                                    Pemimpin Rapat
                                </label>
                                <input
                                    id='notulen-leader'
                                    type='text'
                                    value={form.leader}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, leader: event.target.value }))
                                    }
                                    className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor='notulen-note-taker' className='mb-1 block text-sm font-semibold text-slate-700'>
                                    Notulis
                                </label>
                                <input
                                    id='notulen-note-taker'
                                    type='text'
                                    value={form.noteTaker}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, noteTaker: event.target.value }))
                                    }
                                    className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                    required
                                />
                            </div>
                        </div>

                        {[
                            ['Daftar Hadir', 'attendees', 5],
                            ['Agenda Rapat', 'agenda', 4],
                            ['Hasil Rapat', 'decisions', 8],
                            ['Tindak Lanjut', 'followUp', 7],
                            ['Catatan Tambahan', 'notes', 4],
                        ].map(([label, key, rows]) => (
                            <div key={key}>
                                <label className='mb-1 block text-sm font-semibold text-slate-700'>
                                    {label}
                                </label>
                                <textarea
                                    value={form[key as keyof NotulenFormState]}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            [key]: event.target.value,
                                        }))
                                    }
                                    rows={Number(rows)}
                                    className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                />
                            </div>
                        ))}

                        <div>
                            <label htmlFor='notulen-status' className='mb-1 block text-sm font-semibold text-slate-700'>
                                Status
                            </label>
                            <select
                                id='notulen-status'
                                value={form.status}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        status: event.target.value as NotulenStatus,
                                    }))
                                }
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full rounded-xl bg-cyan-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70'
                        >
                            {isSubmitting
                                ? 'Menyimpan...'
                                : editingId
                                  ? 'Update Notulen'
                                  : 'Simpan Notulen'}
                        </button>
                    </form>
                </article>

                <div className='space-y-4 xl:col-span-3'>
                    <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                            <div>
                                <h4 className='text-lg font-bold text-slate-900'>
                                    Daftar Notulen
                                </h4>
                                <p className='mt-1 text-sm text-slate-600'>
                                    Cari berdasarkan judul rapat, lalu pilih untuk melihat detail.
                                </p>
                            </div>
                            <input
                                type='search'
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                                placeholder='Cari judul rapat...'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2 sm:w-64'
                            />
                        </div>

                        <div className='mt-4 overflow-x-auto'>
                            <table className='min-w-full text-left'>
                                <thead>
                                    <tr className='border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500'>
                                        <th className='px-2 py-2'>Judul Rapat</th>
                                        <th className='px-2 py-2'>Tanggal</th>
                                        <th className='px-2 py-2'>Pemimpin Rapat</th>
                                        <th className='px-2 py-2'>Notulis</th>
                                        <th className='px-2 py-2'>Status</th>
                                        <th className='px-2 py-2 text-right'>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedNotulen.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className='px-2 py-8 text-center'>
                                                <p className='text-sm font-bold text-slate-700'>
                                                    {isLoading
                                                        ? 'Memuat daftar notulen...'
                                                        : 'Belum ada data notulen.'}
                                                </p>
                                                <p className='mt-1 text-sm text-slate-500'>
                                                    Tambahkan notulen pertama atau ubah kata kunci pencarian.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedNotulen.map((item) => (
                                            <tr key={item.id} className='border-b border-slate-100 text-sm text-slate-700'>
                                                <td className='px-2 py-3 font-semibold text-slate-900'>
                                                    {item.title}
                                                </td>
                                                <td className='px-2 py-3'>
                                                    {formatDateShort(item.meeting_date)}
                                                </td>
                                                <td className='px-2 py-3'>{item.leader}</td>
                                                <td className='px-2 py-3'>{item.note_taker}</td>
                                                <td className='px-2 py-3'>
                                                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${getStatusClass(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className='px-2 py-3'>
                                                    <div className='flex flex-wrap justify-end gap-2'>
                                                        <button type='button' onClick={() => setSelectedId(item.id)} className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100'>
                                                            Lihat
                                                        </button>
                                                        <button type='button' onClick={() => handleEdit(item)} className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100'>
                                                            Edit
                                                        </button>
                                                        <button type='button' onClick={() => void handleDelete(item.id)} disabled={deletingId === item.id} className='rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50'>
                                                            {deletingId === item.id ? 'Hapus...' : 'Hapus'}
                                                        </button>
                                                        <button type='button' onClick={() => handleExportPdf(item)} className='rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100'>
                                                            Export PDF
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                            <p className='text-xs font-semibold text-slate-500'>
                                Halaman {page} dari {totalPages} - {filteredNotulen.length} data
                            </p>
                            <div className='flex gap-2'>
                                <button type='button' onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1} className='rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'>
                                    Prev
                                </button>
                                <button type='button' onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages} className='rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'>
                                    Next
                                </button>
                            </div>
                        </div>
                    </article>

                    <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                        {selectedNotulen ? (
                            <div className='mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-5 text-slate-800'>
                                <div className='flex flex-wrap items-start justify-between gap-3'>
                                    <div>
                                        <p className='text-center text-sm font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-left'>
                                            NOTULEN RAPAT
                                        </p>
                                        <h4 className='mt-2 text-2xl font-bold text-slate-900'>
                                            {selectedNotulen.title}
                                        </h4>
                                    </div>
                                    <button type='button' onClick={() => handleExportPdf(selectedNotulen)} className='rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100'>
                                        Export PDF
                                    </button>
                                </div>

                                <div className='mt-5 grid gap-3 border-y border-slate-200 py-4 text-sm sm:grid-cols-2'>
                                    <p><span className='font-bold'>Hari, Tanggal:</span> {formatDateShort(selectedNotulen.meeting_date)}</p>
                                    <p><span className='font-bold'>Waktu:</span> {selectedNotulen.start_time ?? '-'} - {selectedNotulen.end_time ?? '-'}</p>
                                    <p><span className='font-bold'>Tempat:</span> {selectedNotulen.place ?? '-'}</p>
                                    <p><span className='font-bold'>Pemimpin Rapat:</span> {selectedNotulen.leader}</p>
                                    <p><span className='font-bold'>Notulis:</span> {selectedNotulen.note_taker}</p>
                                    <p><span className='font-bold'>Status:</span> {selectedNotulen.status}</p>
                                </div>

                                {[
                                    ['DAFTAR HADIR', selectedNotulen.attendees],
                                    ['AGENDA RAPAT', selectedNotulen.agenda],
                                    ['HASIL RAPAT', selectedNotulen.decisions],
                                    ['TINDAK LANJUT', selectedNotulen.follow_up],
                                    ['CATATAN TAMBAHAN', selectedNotulen.notes],
                                ].map(([title, content]) => (
                                    <section key={title} className='mt-5'>
                                        <h5 className='border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>
                                            {title}
                                        </h5>
                                        <div className='mt-3'>{renderMultiline(content)}</div>
                                    </section>
                                ))}
                            </div>
                        ) : (
                            <div className='rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                                <p className='text-sm font-bold text-slate-700'>
                                    Belum ada detail notulen.
                                </p>
                                <p className='mt-1 text-sm text-slate-500'>
                                    Pilih data dari tabel atau buat notulen baru.
                                </p>
                            </div>
                        )}
                    </article>
                </div>
            </div>
        </section>
    );
}
