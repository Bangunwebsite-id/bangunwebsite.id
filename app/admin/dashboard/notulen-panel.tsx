'use client';

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

type NotulenStatus = 'Draft' | 'Final' | 'Arsip';
type ModalMode = 'create' | 'edit' | 'detail';

type DashboardNotulen = {
    id: number;
    meeting_date: string;
    start_time: string | null;
    end_time: string | null;
    place: string | null;
    note_taker: string;
    attendees: string | null;
    decisions: string | null;
    documentation_photo_url: string | null;
    status: NotulenStatus;
    created_at: string;
    updated_at: string;
};

type NotulenFormState = {
    meetingDate: string;
    startTime: string;
    endTime: string;
    place: string;
    noteTaker: string;
    attendees: string;
    decisions: string;
    documentationPhotoUrl: string;
    status: NotulenStatus;
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
const statuses: NotulenStatus[] = ['Draft', 'Final', 'Arsip'];

function getTodayDateInput() {
    return new Date().toISOString().slice(0, 10);
}

function getDefaultFormState(): NotulenFormState {
    return {
        meetingDate: getTodayDateInput(),
        startTime: '',
        endTime: '',
        place: '',
        noteTaker: '',
        attendees: '',
        decisions: '',
        documentationPhotoUrl: '',
        status: 'Draft',
    };
}

function toLocalDate(value: string) {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
}

function formatDateShort(value: string) {
    return dateFormatter.format(toLocalDate(value));
}

function formatMonthKey(value: string) {
    return value.slice(0, 7);
}

function toDateInputValue(date: Date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
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

function photoGallery(item: DashboardNotulen | null) {
    return (item?.documentation_photo_url ?? '')
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);
}

function escapeHtml(value: string | null) {
    return (value ?? '-')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br />');
}

function buildPrintDocument(item: DashboardNotulen) {
    const photos = photoGallery(item);
    const logoSrc = `${window.location.origin}/bangun-website.png`;
    const photoHtml =
        photos.length > 0
            ? photos
                  .map(
                      (url) => `
                        <figure>
                            <img src="${escapeHtml(url)}" alt="Foto dokumentasi" />
                        </figure>
                    `,
                  )
                  .join('')
            : '<p>-</p>';

    return `
        <!doctype html>
        <html>
            <head>
                <title>Notulen Rapat</title>
                <style>
                    body { color: #0f172a; font-family: Arial, sans-serif; margin: 36px; }
                    header { align-items: center; border-bottom: 2px solid #0891b2; display: flex; gap: 14px; padding-bottom: 16px; }
                    header img { height: 42px; width: auto; }
                    header strong { display: block; font-size: 18px; }
                    h1 { font-size: 24px; letter-spacing: 0.08em; margin: 30px 0 24px; text-align: center; }
                    table { border-collapse: collapse; margin-bottom: 22px; width: 100%; }
                    td { border-bottom: 1px solid #e2e8f0; padding: 9px 0; vertical-align: top; }
                    td:first-child { color: #475569; font-weight: 700; width: 155px; }
                    section { margin-top: 24px; page-break-inside: avoid; }
                    h2 { border-bottom: 1px solid #cbd5e1; font-size: 13px; letter-spacing: 0.08em; padding-bottom: 8px; }
                    p { line-height: 1.65; }
                    .gallery { display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    figure { border: 1px solid #e2e8f0; margin: 0; padding: 8px; }
                    figure img { display: block; max-height: 260px; object-fit: contain; width: 100%; }
                    footer { border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; margin-top: 36px; padding-top: 14px; text-align: center; }
                    @media print { body { margin: 24px; } }
                </style>
            </head>
            <body>
                <header>
                    <img src="${logoSrc}" alt="Logo BangunWebsite" />
                    <strong>BangunWebsite</strong>
                </header>
                <h1>NOTULEN RAPAT</h1>
                <table>
                    <tr><td>Tanggal Rapat</td><td>${formatDateShort(item.meeting_date)}</td></tr>
                    <tr><td>Waktu</td><td>${escapeHtml(item.start_time ?? '-')} - ${escapeHtml(item.end_time ?? '-')}</td></tr>
                    <tr><td>Tempat</td><td>${escapeHtml(item.place)}</td></tr>
                    <tr><td>Notulis</td><td>${escapeHtml(item.note_taker)}</td></tr>
                    <tr><td>Foto Dokumentasi</td><td>${escapeHtml(item.documentation_photo_url)}</td></tr>
                </table>
                <section><h2>DAFTAR HADIR</h2><p>${escapeHtml(item.attendees)}</p></section>
                <section><h2>HASIL RAPAT</h2><p>${escapeHtml(item.decisions)}</p></section>
                <section><h2>FOTO DOKUMENTASI</h2><div class="gallery">${photoHtml}</div></section>
                <footer>© BangunWebsite</footer>
            </body>
        </html>
    `;
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
                        ×
                    </button>
                </div>
                <div className='p-5'>{children}</div>
            </div>
        </div>
    );
}

export function NotulenPanel() {
    const [notulen, setNotulen] = useState<DashboardNotulen[]>([]);
    const [form, setForm] = useState<NotulenFormState>(getDefaultFormState());
    const [monthDate, setMonthDate] = useState(() => toLocalDate(getTodayDateInput()));
    const [modalMode, setModalMode] = useState<ModalMode | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [imageUploadFeedback, setImageUploadFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const selectedNotulen = notulen.find((item) => item.id === selectedId) ?? null;
    const visibleDays = useMemo(() => buildCalendarDays(monthDate), [monthDate]);
    const currentMonthKey = toDateInputValue(monthDate).slice(0, 7);
    const thisMonthTotal = notulen.filter((item) => formatMonthKey(item.meeting_date) === currentMonthKey).length;
    const finalTotal = notulen.filter((item) => item.status === 'Final').length;
    const draftTotal = notulen.filter((item) => item.status === 'Draft').length;
    const notulenByDate = useMemo(() => {
        const map = new Map<string, DashboardNotulen[]>();
        for (const item of notulen) {
            const key = item.meeting_date.slice(0, 10);
            map.set(key, [...(map.get(key) ?? []), item]);
        }
        return map;
    }, [notulen]);

    const fetchNotulen = useCallback(async () => {
        const response = await fetch('/api/admin/notulen', { method: 'GET', cache: 'no-store' });
        const result = (await response.json()) as { message?: string; notulen?: DashboardNotulen[] };

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
        } catch (error) {
            setFeedback({
                type: 'error',
                message: error instanceof Error ? error.message : 'Terjadi masalah koneksi saat memuat notulen.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [fetchNotulen]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshNotulen();
    }, [refreshNotulen]);

    function closeModal() {
        setModalMode(null);
        setEditingId(null);
        setSelectedImageFile(null);
        setImageUploadFeedback(null);
        setForm(getDefaultFormState());
    }

    function openCreateModal() {
        setForm(getDefaultFormState());
        setEditingId(null);
        setSelectedImageFile(null);
        setImageUploadFeedback(null);
        setModalMode('create');
    }

    function openDetailModal(item: DashboardNotulen) {
        setSelectedId(item.id);
        setModalMode('detail');
    }

    function openEditModal(item: DashboardNotulen) {
        setSelectedId(item.id);
        setEditingId(item.id);
        setImageUploadFeedback(null);
        setSelectedImageFile(null);
        setForm({
            meetingDate: item.meeting_date,
            startTime: item.start_time ?? '',
            endTime: item.end_time ?? '',
            place: item.place ?? '',
            noteTaker: item.note_taker,
            attendees: item.attendees ?? '',
            decisions: item.decisions ?? '',
            documentationPhotoUrl: item.documentation_photo_url ?? '',
            status: item.status,
        });
        setModalMode('edit');
    }

    async function handleUploadDocumentationPhoto() {
        if (!selectedImageFile) {
            setImageUploadFeedback({ type: 'error', message: 'Pilih file gambar terlebih dulu.' });
            return;
        }

        setIsUploadingImage(true);
        setImageUploadFeedback(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedImageFile);

            const response = await fetch('/api/admin/blogs/upload', {
                method: 'POST',
                body: formData,
            });
            const result = (await response.json()) as { message?: string; imageUrl?: string };

            if (!response.ok || !result.imageUrl) {
                setImageUploadFeedback({
                    type: 'error',
                    message: result.message ?? 'Upload gambar gagal. Silakan coba lagi.',
                });
                return;
            }

            setForm((prev) => ({
                ...prev,
                documentationPhotoUrl: result.imageUrl ?? prev.documentationPhotoUrl,
            }));
            setSelectedImageFile(null);
            setImageUploadFeedback({
                type: 'success',
                message: 'Gambar berhasil diupload.',
            });
        } catch {
            setImageUploadFeedback({ type: 'error', message: 'Terjadi masalah koneksi saat upload gambar.' });
        } finally {
            setIsUploadingImage(false);
        }
    }

    async function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);

        const endpoint = editingId ? `/api/admin/notulen/${editingId}` : '/api/admin/notulen';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                setFeedback({ type: 'error', message: result.message ?? 'Gagal menyimpan notulen.' });
                return;
            }

            await refreshNotulen();
            closeModal();
            setFeedback({
                type: 'success',
                message: result.message ?? (editingId ? 'Notulen berhasil diperbarui.' : 'Notulen berhasil dibuat.'),
            });
        } catch {
            setFeedback({ type: 'error', message: 'Terjadi masalah koneksi. Coba lagi beberapa saat.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmation = await Swal.fire({
            title: 'Hapus Notulen?',
            text: 'Data notulen yang dihapus tidak dapat dikembalikan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#475569',
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        setDeletingId(id);

        try {
            const response = await fetch(`/api/admin/notulen/${id}`, { method: 'DELETE' });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await Swal.fire('Gagal', result.message ?? 'Gagal menghapus notulen.', 'error');
                return;
            }

            await refreshNotulen();
            closeModal();
            await Swal.fire('Berhasil', result.message ?? 'Notulen berhasil dihapus.', 'success');
        } catch {
            await Swal.fire('Gagal', 'Terjadi masalah koneksi saat menghapus notulen.', 'error');
        } finally {
            setDeletingId(null);
        }
    }

    function handleExportPdf(item: DashboardNotulen) {
        const printWindow = window.open('', '_blank', 'width=900,height=1200');
        if (!printWindow) {
            setFeedback({ type: 'error', message: 'Popup print diblokir browser. Izinkan popup lalu coba lagi.' });
            return;
        }

        printWindow.document.open();
        printWindow.document.write(buildPrintDocument(item));
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    function changeMonth(offset: number) {
        setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    }

    const formTitle = modalMode === 'edit' ? 'Edit Notulen' : 'Tambah Notulen';

    return (
        <section className='space-y-4'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>Dashboard Notulen</h3>
                        <p className='mt-2 text-sm font-medium text-slate-600'>Kelola catatan rapat resmi dalam tampilan kalender bulanan.</p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <button type='button' onClick={openCreateModal} className='rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'>
                            Tambah Notulen
                        </button>
                        <button type='button' onClick={() => void refreshNotulen()} disabled={isLoading} className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'>
                            {isLoading ? 'Memuat...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                {feedback && (
                    <p className={`mt-3 rounded-xl border px-3 py-2 text-sm font-semibold ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {feedback.message}
                    </p>
                )}

                <div className='mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                    {[
                        ['Total Notulen', isLoaded ? notulen.length : isLoading ? '...' : '-'],
                        ['Notulen Bulan Ini', isLoaded ? thisMonthTotal : isLoading ? '...' : '-'],
                        ['Draft', isLoaded ? draftTotal : isLoading ? '...' : '-'],
                        ['Final', isLoaded ? finalTotal : isLoading ? '...' : '-'],
                    ].map(([label, value]) => (
                        <article key={label} className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>{label}</p>
                            <p className='mt-1 text-2xl font-bold text-slate-900'>{value}</p>
                        </article>
                    ))}
                </div>
            </div>

            <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h4 className='text-lg font-bold capitalize text-slate-900'>{monthFormatter.format(monthDate)}</h4>
                        <p className='mt-1 text-sm text-slate-600'>Klik event pada tanggal rapat untuk melihat detail notulen.</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button type='button' onClick={() => changeMonth(-1)} className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'>
                            Sebelumnya
                        </button>
                        <button type='button' onClick={() => setMonthDate(toLocalDate(getTodayDateInput()))} className='rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100'>
                            Bulan Ini
                        </button>
                        <button type='button' onClick={() => changeMonth(1)} className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'>
                            Berikutnya
                        </button>
                    </div>
                </div>

                <div className='mt-5 grid grid-cols-7 border-l border-t border-slate-200 text-sm'>
                    {visibleDays.slice(0, 7).map((date) => (
                        <div key={dayFormatter.format(date)} className='border-b border-r border-slate-200 bg-slate-50 px-2 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-slate-500'>
                            {dayFormatter.format(date)}
                        </div>
                    ))}
                    {visibleDays.map((date) => {
                        const key = toDateInputValue(date);
                        const events = notulenByDate.get(key) ?? [];
                        const isOutsideMonth = date.getMonth() !== monthDate.getMonth();
                        const isToday = key === getTodayDateInput();

                        return (
                            <div key={key} className={`min-h-28 border-b border-r border-slate-200 p-2 ${isOutsideMonth ? 'bg-slate-50/60 text-slate-400' : 'bg-white text-slate-700'}`}>
                                <div className='flex items-center justify-between gap-1'>
                                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${isToday ? 'bg-cyan-700 text-white' : ''}`}>
                                        {date.getDate()}
                                    </span>
                                    {events.length > 0 && <span className='text-[11px] font-bold text-cyan-700'>{events.length}</span>}
                                </div>
                                <div className='mt-2 space-y-1'>
                                    {events.map((item) => (
                                        <button
                                            key={item.id}
                                            type='button'
                                            onClick={() => openDetailModal(item)}
                                            className='block w-full rounded-lg border border-cyan-100 bg-cyan-50 px-2 py-1.5 text-left text-xs font-bold text-cyan-800 transition hover:border-cyan-200 hover:bg-cyan-100'
                                        >
                                            <span className='block truncate'>{item.place || item.note_taker}</span>
                                            <span className='block truncate font-semibold text-cyan-700'>{item.start_time ?? '-'} · {item.note_taker}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </article>

            {(modalMode === 'create' || modalMode === 'edit') && (
                <Modal title={formTitle} onClose={closeModal}>
                    <form className='space-y-4' onSubmit={handleSave}>
                        <div className='grid gap-3 sm:grid-cols-2'>
                            <Field label='Tanggal Rapat' id='notulen-date'>
                                <input id='notulen-date' type='date' value={form.meetingDate} onChange={(event) => setForm((prev) => ({ ...prev, meetingDate: event.target.value }))} className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2' required />
                            </Field>
                            <Field label='Waktu' id='notulen-start'>
                                <div className='grid grid-cols-2 gap-2'>
                                    <input id='notulen-start' type='time' value={form.startTime} onChange={(event) => setForm((prev) => ({ ...prev, startTime: event.target.value }))} className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2' />
                                    <input aria-label='Waktu selesai' type='time' value={form.endTime} onChange={(event) => setForm((prev) => ({ ...prev, endTime: event.target.value }))} className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2' />
                                </div>
                            </Field>
                            <Field label='Tempat' id='notulen-place'>
                                <input id='notulen-place' type='text' value={form.place} onChange={(event) => setForm((prev) => ({ ...prev, place: event.target.value }))} className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2' />
                            </Field>
                            <Field label='Notulis' id='notulen-note-taker'>
                                <input id='notulen-note-taker' type='text' value={form.noteTaker} onChange={(event) => setForm((prev) => ({ ...prev, noteTaker: event.target.value }))} className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2' required />
                            </Field>
                        </div>

                        <div className='grid gap-3 sm:grid-cols-2'>
                            <Field label='Daftar Hadir' id='notulen-attendees'>
                                <textarea id='notulen-attendees' value={form.attendees} onChange={(event) => setForm((prev) => ({ ...prev, attendees: event.target.value }))} rows={5} className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2' />
                            </Field>
                            <Field label='Hasil Rapat' id='notulen-decisions'>
                                <textarea id='notulen-decisions' value={form.decisions} onChange={(event) => setForm((prev) => ({ ...prev, decisions: event.target.value }))} rows={5} className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2' />
                            </Field>
                        </div>

                        <div className='grid gap-3 sm:grid-cols-2'>
                            <Field label='Status' id='notulen-status'>
                                <select id='notulen-status' value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as NotulenStatus }))} className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'>
                                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </Field>
                        </div>

                        <div>
                            <label htmlFor='notulen-photo-url' className='mb-1 block text-sm font-semibold text-slate-700'>
                                Foto Dokumentasi
                            </label>
                            <div className='mb-2 grid gap-2 sm:grid-cols-[1fr_auto]'>
                                <input
                                    id='notulen-photo-file'
                                    type='file'
                                    accept='image/png,image/jpeg,image/webp,image/gif,image/svg+xml'
                                    onChange={(event) => {
                                        setSelectedImageFile(event.target.files?.[0] ?? null);
                                        setImageUploadFeedback(null);
                                    }}
                                    className='w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-slate-700 hover:file:bg-slate-200'
                                />
                                <button
                                    type='button'
                                    onClick={() => void handleUploadDocumentationPhoto()}
                                    disabled={isUploadingImage || !selectedImageFile}
                                    className='rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60'
                                >
                                    {isUploadingImage ? 'Upload...' : 'Upload Gambar'}
                                </button>
                            </div>
                            {imageUploadFeedback && (
                                <p className={`mb-2 rounded-lg border px-3 py-2 text-xs font-semibold ${imageUploadFeedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                                    {imageUploadFeedback.message}
                                </p>
                            )}
                            <input
                                id='notulen-photo-url'
                                type='text'
                                value={form.documentationPhotoUrl}
                                onChange={(event) => setForm((prev) => ({ ...prev, documentationPhotoUrl: event.target.value }))}
                                placeholder='https://cdn.bangunwebsite.id/bangunwebsite/assets/2026/nama-file.png'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                            />
                            <p className='mt-1 text-xs font-medium text-slate-500'>
                                URL CDN/MinIO terisi otomatis setelah upload. Kamu juga tetap bisa isi manual jika perlu.
                            </p>
                        </div>

                        {form.documentationPhotoUrl && (
                            <div className='rounded-xl border border-slate-200 bg-slate-50 p-3'>
                                <p className='mb-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>Preview Foto</p>
                                <img src={form.documentationPhotoUrl} alt='Preview foto dokumentasi' className='max-h-64 w-full rounded-lg object-contain' />
                            </div>
                        )}

                        <div className='flex justify-end gap-3 border-t border-slate-200 pt-4'>
                            <button type='button' onClick={closeModal} className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'>Batal</button>
                            <button type='submit' disabled={isSubmitting} className='rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:opacity-70'>
                                {isSubmitting ? 'Menyimpan...' : modalMode === 'edit' ? 'Update Notulen' : 'Simpan Notulen'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modalMode === 'detail' && selectedNotulen && (
                <Modal title='Detail Notulen' onClose={closeModal}>
                    <div className='space-y-5'>
                        <div className='flex flex-wrap items-start justify-between gap-3'>
                            <div>
                                <p className='text-sm font-bold uppercase tracking-[0.16em] text-slate-500'>NOTULEN RAPAT</p>
                                <p className='mt-2 text-lg font-bold text-slate-900'>{formatDateShort(selectedNotulen.meeting_date)}</p>
                            </div>
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(selectedNotulen.status)}`}>{selectedNotulen.status}</span>
                        </div>

                        <div className='grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2'>
                            <p><span className='font-bold text-slate-900'>Tanggal Rapat:</span> {formatDateShort(selectedNotulen.meeting_date)}</p>
                            <p><span className='font-bold text-slate-900'>Waktu:</span> {selectedNotulen.start_time ?? '-'} - {selectedNotulen.end_time ?? '-'}</p>
                            <p><span className='font-bold text-slate-900'>Tempat:</span> {selectedNotulen.place ?? '-'}</p>
                            <p><span className='font-bold text-slate-900'>Notulis:</span> {selectedNotulen.note_taker}</p>
                            <p className='break-all sm:col-span-2'><span className='font-bold text-slate-900'>Foto Dokumentasi:</span> {selectedNotulen.documentation_photo_url ?? '-'}</p>
                        </div>

                        <DetailSection title='DAFTAR HADIR'>{renderMultiline(selectedNotulen.attendees)}</DetailSection>
                        <DetailSection title='HASIL RAPAT'>{renderMultiline(selectedNotulen.decisions)}</DetailSection>
                        <DetailSection title='FOTO DOKUMENTASI'>
                            {photoGallery(selectedNotulen).length > 0 ? (
                                <div className='grid gap-3 sm:grid-cols-2'>
                                    {photoGallery(selectedNotulen).map((url) => (
                                        <img key={url} src={url} alt='Foto dokumentasi notulen' className='max-h-72 w-full rounded-xl border border-slate-200 bg-slate-50 object-contain' />
                                    ))}
                                </div>
                            ) : (
                                <p className='text-sm font-medium text-slate-400'>-</p>
                            )}
                        </DetailSection>

                        <div className='flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4'>
                            <button type='button' onClick={() => handleExportPdf(selectedNotulen)} className='rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100'>Export PDF</button>
                            <button type='button' onClick={() => openEditModal(selectedNotulen)} className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'>Edit</button>
                            <button type='button' onClick={() => void handleDelete(selectedNotulen.id)} disabled={deletingId === selectedNotulen.id} className='rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60'>
                                {deletingId === selectedNotulen.id ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    </div>
                </Modal>
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

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h5 className='border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>{title}</h5>
            <div className='mt-3'>{children}</div>
        </section>
    );
}
