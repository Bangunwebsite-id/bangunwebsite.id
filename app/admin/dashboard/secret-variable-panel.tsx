'use client';

import { DragEvent, FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

type ModalMode = 'create' | 'edit' | 'detail';

type DashboardNotesSecret = {
    id: number;
    category: string;
    name: string;
    value: string;
    description: string | null;
    pinned: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
};

type NotesSecretFormState = {
    name: string;
    value: string;
};

function getDefaultFormState(): NotesSecretFormState {
    return {
        name: '',
        value: '',
    };
}

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

function confirmDeleteNotesSecret() {
    return Swal.fire({
        icon: 'warning',
        title: 'Hapus Data?',
        text: 'Hapus Notes Secret ini?',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: swalDeleteButtonColor,
        cancelButtonColor: swalCancelButtonColor,
    });
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}

function maskText(value: string, minLength = 20) {
    const length = Math.min(Math.max(value.length, minLength), 34);
    return '•'.repeat(length);
}

function previewValue(value: string) {
    return maskText(value.replace(/\s+/g, ''), 22);
}

function renderMaskedLine(line: string) {
    const separatorIndex = line.indexOf('=');

    if (separatorIndex < 0) {
        return maskText(line);
    }

    const key = line.slice(0, separatorIndex).trim();

    if (!key) {
        return maskText(line);
    }

    return `${key}=${maskText(line.slice(separatorIndex + 1).trim())}`;
}

function getValueLines(value: string) {
    return value.split(/\r?\n/).filter((line) => line.trim());
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

export function SecretVariablePanel() {
    const [notesSecrets, setNotesSecrets] = useState<DashboardNotesSecret[]>([]);
    const [form, setForm] = useState<NotesSecretFormState>(getDefaultFormState());
    const [modalMode, setModalMode] = useState<ModalMode | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showAllValues, setShowAllValues] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    const selectedNotesSecret = notesSecrets.find((item) => item.id === selectedId) ?? null;
    const sortedNotesSecrets = useMemo(
        () =>
            [...notesSecrets].sort((left, right) => {
                if (left.pinned !== right.pinned) {
                    return left.pinned ? -1 : 1;
                }

                return left.display_order - right.display_order || left.id - right.id;
            }),
        [notesSecrets],
    );

    const fetchNotesSecrets = useCallback(async () => {
        const response = await fetch('/api/admin/secret-variables', {
            method: 'GET',
            cache: 'no-store',
        });
        const result = (await response.json()) as {
            message?: string;
            secretVariables?: DashboardNotesSecret[];
        };

        if (!response.ok || !result.secretVariables) {
            throw new Error(result.message ?? 'Gagal memuat Notes Secret.');
        }

        return result.secretVariables;
    }, []);

    const refreshNotesSecrets = useCallback(async () => {
        setIsLoading(true);

        try {
            const nextNotesSecrets = await fetchNotesSecrets();
            setNotesSecrets(nextNotesSecrets);
        } catch (error) {
            await showErrorAlert(error instanceof Error ? error.message : 'Terjadi masalah koneksi saat memuat Notes Secret.');
        } finally {
            setIsLoading(false);
        }
    }, [fetchNotesSecrets]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshNotesSecrets();
    }, [refreshNotesSecrets]);

    function closeModal() {
        setModalMode(null);
        setSelectedId(null);
        setEditingId(null);
        setShowAllValues(false);
        setForm(getDefaultFormState());
    }

    function openCreateModal() {
        setForm(getDefaultFormState());
        setEditingId(null);
        setModalMode('create');
    }

    function openDetailModal(item: DashboardNotesSecret) {
        setSelectedId(item.id);
        setShowAllValues(false);
        setModalMode('detail');
    }

    function openEditModal(item: DashboardNotesSecret) {
        setSelectedId(item.id);
        setEditingId(item.id);
        setShowAllValues(false);
        setForm({
            name: item.name,
            value: item.value,
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

        const endpoint = isEditing ? `/api/admin/secret-variables/${editingId}` : '/api/admin/secret-variables';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    value: form.value,
                }),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? (isEditing ? 'Notes Secret gagal diperbarui.' : 'Notes Secret gagal dibuat.'));
                return;
            }

            await refreshNotesSecrets();
            closeModal();
            await showSuccessAlert(isEditing ? 'Notes Secret berhasil diperbarui.' : 'Notes Secret berhasil dibuat.');
        } catch {
            await showErrorAlert(isEditing ? 'Notes Secret gagal diperbarui.' : 'Notes Secret gagal dibuat.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleCopyValue(item: DashboardNotesSecret) {
        try {
            await navigator.clipboard.writeText(item.value);
            await showSuccessAlert('Value berhasil disalin.');
        } catch {
            await showErrorAlert('Clipboard tidak tersedia. Salin manual dari modal detail.');
        }
    }

    async function handleDelete(item: DashboardNotesSecret) {
        const confirmation = await confirmDeleteNotesSecret();

        if (!confirmation.isConfirmed) {
            return;
        }

        setDeletingId(item.id);

        try {
            const response = await fetch(`/api/admin/secret-variables/${item.id}`, {
                method: 'DELETE',
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Data gagal dihapus.');
                return;
            }

            await refreshNotesSecrets();
            closeModal();
            await showSuccessAlert('Data berhasil dihapus.');
        } catch {
            await showErrorAlert('Data gagal dihapus.');
        } finally {
            setDeletingId(null);
        }
    }

    async function handleTogglePin(item: DashboardNotesSecret) {
        const nextPinned = !item.pinned;

        try {
            const response = await fetch(`/api/admin/secret-variables/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinned: nextPinned }),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Gagal mengubah pin Notes Secret.');
                return;
            }

            await refreshNotesSecrets();
            await showSuccessAlert(nextPinned ? 'Notes Secret berhasil disematkan.' : 'Notes Secret berhasil dilepas.');
        } catch {
            await showErrorAlert('Gagal mengubah pin Notes Secret.');
        }
    }

    async function persistOrder(items: DashboardNotesSecret[]) {
        const response = await fetch('/api/admin/secret-variables', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order: items.map((item, index) => ({
                    id: item.id,
                    displayOrder: index + 1,
                })),
            }),
        });
        const result = (await response.json()) as { message?: string };

        if (!response.ok) {
            throw new Error(result.message ?? 'Gagal menyimpan urutan Notes Secret.');
        }
    }

    function handleDragStart(item: DashboardNotesSecret) {
        setDraggedId(item.id);
    }

    function handleDragOver(event: DragEvent<HTMLElement>) {
        event.preventDefault();
    }

    async function handleDrop(target: DashboardNotesSecret) {
        if (!draggedId || draggedId === target.id) {
            setDraggedId(null);
            return;
        }

        const dragged = sortedNotesSecrets.find((item) => item.id === draggedId);

        if (!dragged) {
            setDraggedId(null);
            return;
        }

        const nextItems = sortedNotesSecrets.filter((item) => item.id !== draggedId);
        const targetIndex = nextItems.findIndex((item) => item.id === target.id);
        nextItems.splice(targetIndex, 0, dragged);

        setNotesSecrets(nextItems.map((item, index) => ({ ...item, display_order: index + 1 })));
        setDraggedId(null);

        try {
            await persistOrder(nextItems);
            await showSuccessAlert('Urutan Notes Secret berhasil disimpan.');
        } catch (error) {
            await refreshNotesSecrets();
            await showErrorAlert(error instanceof Error ? error.message : 'Gagal menyimpan urutan Notes Secret.');
        }
    }

    const modalTitle = modalMode === 'edit' ? 'Edit Notes Secret' : 'Tambah Notes Secret';

    return (
        <section className='space-y-4'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>
                            Notes Secret
                        </h3>
                        <p className='mt-2 max-w-3xl text-sm font-medium text-slate-600'>
                            Catatan rahasia, credential, token, konfigurasi server, API key, atau informasi penting lainnya.
                        </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <button
                            type='button'
                            onClick={openCreateModal}
                            className='rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                        >
                            Tambah Notes Secret
                        </button>
                        <button
                            type='button'
                            onClick={() => void refreshNotesSecrets()}
                            disabled={isLoading}
                            className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            {isLoading ? 'Memuat...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {sortedNotesSecrets.length === 0 ? (
                    <article className='rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center md:col-span-2 xl:col-span-3'>
                        <p className='text-sm font-bold text-slate-700'>
                            {isLoading ? 'Memuat Notes Secret...' : 'Belum ada Notes Secret.'}
                        </p>
                        <p className='mt-1 text-sm text-slate-500'>
                            Simpan .env.local, API key, token, credential server, atau informasi penting lainnya.
                        </p>
                        <button
                            type='button'
                            onClick={openCreateModal}
                            className='mt-4 rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                        >
                            Tambah Notes Secret
                        </button>
                    </article>
                ) : (
                    sortedNotesSecrets.map((item) => (
                        <article
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart(item)}
                            onDragOver={handleDragOver}
                            onDrop={() => void handleDrop(item)}
                            onClick={() => openDetailModal(item)}
                            className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:border-cyan-200 hover:shadow-md ${draggedId === item.id ? 'border-cyan-300 opacity-60' : 'border-slate-200'}`}
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <div className='min-w-0'>
                                    <h4 className='truncate text-lg font-bold text-slate-900'>{item.name}</h4>
                                    <p className='mt-3 break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm font-bold text-slate-500'>
                                        {previewValue(item.value)}
                                    </p>
                                </div>
                                <button
                                    type='button'
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        void handleTogglePin(item);
                                    }}
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition ${item.pinned ? 'border-cyan-200 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    aria-label={item.pinned ? 'Lepas sematan' : 'Sematkan'}
                                    title={item.pinned ? 'Lepas sematan' : 'Sematkan'}
                                >
                                    📌
                                </button>
                            </div>
                            <div className='mt-5 grid gap-3 text-sm text-slate-600'>
                                <p>
                                    <span className='block text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>Dibuat</span>
                                    <span className='font-semibold text-slate-800'>{formatDate(item.created_at)}</span>
                                </p>
                                <p>
                                    <span className='block text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>Diperbarui</span>
                                    <span className='font-semibold text-slate-800'>{formatDate(item.updated_at)}</span>
                                </p>
                            </div>
                        </article>
                    ))
                )}
            </div>

            {(modalMode === 'create' || modalMode === 'edit') && (
                <Modal title={modalTitle} onClose={closeModal}>
                    <form className='space-y-4' onSubmit={handleSave}>
                        <Field label='Judul' id='notes-secret-title'>
                            <input
                                id='notes-secret-title'
                                type='text'
                                value={form.name}
                                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                placeholder='.env.local bangunwebsite'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </Field>
                        <Field label='Value' id='notes-secret-value'>
                            <textarea
                                id='notes-secret-value'
                                value={form.value}
                                onChange={(event) => setForm((prev) => ({ ...prev, value: event.target.value }))}
                                placeholder={'DB_URL=postgresql://...\nADMIN_SESSION_SECRET=...\nAPP_TIMEZONE=Asia/Makassar'}
                                rows={12}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </Field>

                        <div className='flex justify-end gap-3 border-t border-slate-200 pt-4'>
                            <button type='button' onClick={closeModal} className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'>
                                Batal
                            </button>
                            <button type='submit' disabled={isSubmitting} className='rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70'>
                                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modalMode === 'detail' && selectedNotesSecret && (
                <Modal title='Detail Notes Secret' onClose={closeModal}>
                    <div className='space-y-5'>
                        <div className='flex flex-wrap items-start justify-between gap-3'>
                            <div>
                                <h4 className='text-xl font-bold text-slate-900'>{selectedNotesSecret.name}</h4>
                                <div className='mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-2'>
                                    <p><span className='font-bold text-slate-900'>Dibuat:</span> {formatDate(selectedNotesSecret.created_at)}</p>
                                    <p><span className='font-bold text-slate-900'>Diperbarui:</span> {formatDate(selectedNotesSecret.updated_at)}</p>
                                </div>
                            </div>
                            <button
                                type='button'
                                onClick={() => void handleTogglePin(selectedNotesSecret)}
                                className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${selectedNotesSecret.pinned ? 'border-cyan-200 bg-cyan-50 text-cyan-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                            >
                                📌 {selectedNotesSecret.pinned ? 'Unpin' : 'Pin'}
                            </button>
                        </div>

                        <section>
                            <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2'>
                                <h5 className='text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>Value</h5>
                                <button
                                    type='button'
                                    onClick={() => setShowAllValues((current) => !current)}
                                    className='rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100'
                                >
                                    {showAllValues ? 'Sembunyikan Semua Value' : 'Tampilkan Semua Value'}
                                </button>
                            </div>
                            <div className='mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-6 text-slate-800'>
                                {getValueLines(selectedNotesSecret.value).map((line, index) => (
                                    <p key={`${line}-${index}`} className='break-all'>
                                        {showAllValues ? line : renderMaskedLine(line)}
                                    </p>
                                ))}
                            </div>
                        </section>

                        <div className='flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4'>
                            <button type='button' onClick={() => void handleCopyValue(selectedNotesSecret)} className='rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100'>
                                Copy
                            </button>
                            <button type='button' onClick={() => openEditModal(selectedNotesSecret)} className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'>
                                Edit
                            </button>
                            <button type='button' onClick={() => void handleDelete(selectedNotesSecret)} disabled={deletingId === selectedNotesSecret.id} className='rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60'>
                                {deletingId === selectedNotesSecret.id ? 'Menghapus...' : 'Hapus'}
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

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
    return (
        <div>
            <label htmlFor={id} className='mb-1 block text-sm font-semibold text-slate-700'>
                {label}
            </label>
            {children}
        </div>
    );
}
