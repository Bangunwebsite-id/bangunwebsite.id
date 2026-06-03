'use client';

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

type SecretVariableCategory = 'Akses Server' | 'Akses Lain';
type ModalMode = 'create' | 'edit';

type DashboardSecretVariable = {
    id: number;
    category: SecretVariableCategory;
    name: string;
    value: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};

type SecretVariableFormState = {
    category: SecretVariableCategory;
    name: string;
    value: string;
    description: string;
};

const categories: SecretVariableCategory[] = ['Akses Server', 'Akses Lain'];

function getDefaultFormState(category: SecretVariableCategory = 'Akses Server'): SecretVariableFormState {
    return {
        category,
        name: '',
        value: '',
        description: '',
    };
}

function maskValue(value: string) {
    if (!value) {
        return '---';
    }

    return '•'.repeat(Math.min(Math.max(value.length, 8), 18));
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
            <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl'>
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

export function SecretVariablePanel() {
    const [secretVariables, setSecretVariables] = useState<DashboardSecretVariable[]>([]);
    const [activeCategory, setActiveCategory] = useState<SecretVariableCategory>('Akses Server');
    const [form, setForm] = useState<SecretVariableFormState>(getDefaultFormState());
    const [modalMode, setModalMode] = useState<ModalMode | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [visibleIds, setVisibleIds] = useState<Set<number>>(() => new Set());
    const [search, setSearch] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const categoryCounts = useMemo(() => {
        return categories.reduce<Record<SecretVariableCategory, number>>(
            (acc, category) => {
                acc[category] = secretVariables.filter((item) => item.category === category).length;
                return acc;
            },
            { 'Akses Server': 0, 'Akses Lain': 0 },
        );
    }, [secretVariables]);

    const filteredVariables = useMemo(() => {
        const query = search.trim().toLowerCase();

        return secretVariables.filter((item) => {
            if (item.category !== activeCategory) {
                return false;
            }

            if (!query) {
                return true;
            }

            return [item.name, item.description ?? '']
                .join(' ')
                .toLowerCase()
                .includes(query);
        });
    }, [activeCategory, search, secretVariables]);

    const fetchSecretVariables = useCallback(async () => {
        const response = await fetch('/api/admin/secret-variables', {
            method: 'GET',
            cache: 'no-store',
        });
        const result = (await response.json()) as {
            message?: string;
            secretVariables?: DashboardSecretVariable[];
        };

        if (!response.ok || !result.secretVariables) {
            throw new Error(result.message ?? 'Gagal memuat secret variable.');
        }

        return result.secretVariables;
    }, []);

    const refreshSecretVariables = useCallback(async () => {
        setIsLoading(true);
        setFeedback(null);

        try {
            const nextSecretVariables = await fetchSecretVariables();
            setSecretVariables(nextSecretVariables);
            setIsLoaded(true);
        } catch (error) {
            setFeedback({
                type: 'error',
                message: error instanceof Error ? error.message : 'Terjadi masalah koneksi saat memuat secret variable.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [fetchSecretVariables]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshSecretVariables();
    }, [refreshSecretVariables]);

    function closeModal() {
        setModalMode(null);
        setEditingId(null);
        setForm(getDefaultFormState(activeCategory));
    }

    function openCreateModal(category: SecretVariableCategory) {
        setActiveCategory(category);
        setForm(getDefaultFormState(category));
        setEditingId(null);
        setFeedback(null);
        setModalMode('create');
    }

    function openEditModal(item: DashboardSecretVariable) {
        setActiveCategory(item.category);
        setEditingId(item.id);
        setForm({
            category: item.category,
            name: item.name,
            value: item.value,
            description: item.description ?? '',
        });
        setFeedback(null);
        setModalMode('edit');
    }

    function toggleValueVisibility(id: number) {
        setVisibleIds((current) => {
            const next = new Set(current);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    async function copyValue(value: string) {
        try {
            await navigator.clipboard.writeText(value);
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Secret variable berhasil disalin.',
                timer: 1600,
                showConfirmButton: false,
            });
        } catch {
            await Swal.fire('Gagal', 'Clipboard tidak tersedia. Salin manual dari tombol Lihat.', 'error');
        }
    }

    async function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);

        const endpoint = editingId
            ? `/api/admin/secret-variables/${editingId}`
            : '/api/admin/secret-variables';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                setFeedback({
                    type: 'error',
                    message: result.message ?? 'Gagal menyimpan secret variable.',
                });
                return;
            }

            await refreshSecretVariables();
            setActiveCategory(form.category);
            closeModal();
            setFeedback({
                type: 'success',
                message: result.message ?? (editingId ? 'Secret variable berhasil diperbarui.' : 'Secret variable berhasil dibuat.'),
            });
        } catch {
            setFeedback({
                type: 'error',
                message: 'Terjadi masalah koneksi saat menyimpan secret variable.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmation = await Swal.fire({
            title: 'Hapus Secret Variable?',
            text: 'Data yang dihapus tidak dapat dikembalikan.',
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
            const response = await fetch(`/api/admin/secret-variables/${id}`, {
                method: 'DELETE',
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await Swal.fire('Gagal', result.message ?? 'Gagal menghapus secret variable.', 'error');
                return;
            }

            setVisibleIds((current) => {
                const next = new Set(current);
                next.delete(id);
                return next;
            });
            await refreshSecretVariables();
            await Swal.fire('Berhasil', result.message ?? 'Secret variable berhasil dihapus.', 'success');
        } catch {
            await Swal.fire('Gagal', 'Terjadi masalah koneksi saat menghapus secret variable.', 'error');
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <section className='space-y-4'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>
                            Secret Variable
                        </h3>
                        <p className='mt-2 text-sm font-medium text-slate-600'>
                            Simpan credential, API key, token, dan konfigurasi sensitif dashboard.
                        </p>
                    </div>
                    <button
                        type='button'
                        onClick={() => void refreshSecretVariables()}
                        disabled={isLoading}
                        className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {isLoading ? 'Memuat...' : 'Refresh Data'}
                    </button>
                </div>

                {feedback && (
                    <p className={`mt-3 rounded-xl border px-3 py-2 text-sm font-semibold ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {feedback.message}
                    </p>
                )}
            </div>

            <div className='grid gap-4 lg:grid-cols-2'>
                {categories.map((category) => (
                    <article key={category} className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                        <div className='flex items-start justify-between gap-4'>
                            <div>
                                <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                    Kategori
                                </p>
                                <h4 className='mt-2 text-xl font-bold text-slate-900'>
                                    {category}
                                </h4>
                                <p className='mt-2 text-3xl font-bold text-slate-900'>
                                    {isLoaded ? categoryCounts[category] : isLoading ? '...' : '-'} <span className='text-base font-bold text-slate-500'>Variable</span>
                                </p>
                            </div>
                            <div className='rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700'>
                                Secret
                            </div>
                        </div>
                        <div className='mt-6 flex flex-wrap gap-2'>
                            <button
                                type='button'
                                onClick={() => setActiveCategory(category)}
                                className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                            >
                                Kelola
                            </button>
                            <button
                                type='button'
                                onClick={() => openCreateModal(category)}
                                className='rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                            >
                                Tambah
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h4 className='text-lg font-bold text-slate-900'>
                            Kelola {activeCategory}
                        </h4>
                        <p className='mt-1 text-sm text-slate-600'>
                            Value disembunyikan secara default. Gunakan Lihat hanya saat diperlukan.
                        </p>
                    </div>
                    <div className='flex w-full flex-wrap gap-2 sm:w-auto'>
                        <input
                            type='search'
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder='Cari nama/keterangan...'
                            className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2 sm:w-64'
                        />
                        <button
                            type='button'
                            onClick={() => openCreateModal(activeCategory)}
                            className='rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                        >
                            Tambah
                        </button>
                    </div>
                </div>

                <div className='mt-4 overflow-x-auto'>
                    <table className='min-w-full text-left'>
                        <thead>
                            <tr className='border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500'>
                                <th className='px-2 py-2'>Nama Variable</th>
                                <th className='px-2 py-2'>Value</th>
                                <th className='px-2 py-2'>Keterangan</th>
                                <th className='px-2 py-2 text-right'>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVariables.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className='px-2 py-8 text-center'>
                                        <p className='text-sm font-bold text-slate-700'>
                                            {isLoading ? 'Memuat secret variable...' : 'Belum ada secret variable.'}
                                        </p>
                                        <p className='mt-1 text-sm text-slate-500'>
                                            Tambahkan variable pertama atau ubah kata kunci pencarian.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredVariables.map((item) => {
                                    const isVisible = visibleIds.has(item.id);

                                    return (
                                        <tr key={item.id} className='border-b border-slate-100 text-sm text-slate-700'>
                                            <td className='px-2 py-3'>
                                                <p className='font-mono text-xs font-bold text-slate-900'>{item.name}</p>
                                            </td>
                                            <td className='px-2 py-3'>
                                                <p className='max-w-[260px] break-all rounded-lg bg-slate-50 px-2 py-1.5 font-mono text-xs text-slate-700'>
                                                    {isVisible ? item.value : maskValue(item.value)}
                                                </p>
                                            </td>
                                            <td className='px-2 py-3'>
                                                <p className='max-w-sm text-sm text-slate-600'>
                                                    {item.description ?? '-'}
                                                </p>
                                            </td>
                                            <td className='px-2 py-3'>
                                                <div className='flex flex-wrap justify-end gap-2'>
                                                    <button type='button' onClick={() => toggleValueVisibility(item.id)} className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100'>
                                                        {isVisible ? 'Sembunyikan' : 'Lihat'}
                                                    </button>
                                                    <button type='button' onClick={() => void copyValue(item.value)} className='rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100'>
                                                        Copy
                                                    </button>
                                                    <button type='button' onClick={() => openEditModal(item)} className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100'>
                                                        Edit
                                                    </button>
                                                    <button type='button' onClick={() => void handleDelete(item.id)} disabled={deletingId === item.id} className='rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50'>
                                                        {deletingId === item.id ? 'Hapus...' : 'Hapus'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </article>

            {modalMode && (
                <Modal title={modalMode === 'edit' ? 'Edit Secret Variable' : 'Tambah Secret Variable'} onClose={closeModal}>
                    <form className='space-y-4' onSubmit={handleSave}>
                        <Field label='Kategori' id='secret-category'>
                            <select
                                id='secret-category'
                                value={form.category}
                                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as SecretVariableCategory }))}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label='Nama Variable' id='secret-name'>
                            <input
                                id='secret-name'
                                type='text'
                                value={form.name}
                                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                placeholder='DB_HOST'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </Field>
                        <Field label='Value' id='secret-value'>
                            <textarea
                                id='secret-value'
                                value={form.value}
                                onChange={(event) => setForm((prev) => ({ ...prev, value: event.target.value }))}
                                placeholder='127.0.0.1'
                                rows={4}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </Field>
                        <Field label='Keterangan' id='secret-description'>
                            <textarea
                                id='secret-description'
                                value={form.description}
                                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                                placeholder='Database utama production'
                                rows={3}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                            />
                        </Field>

                        {feedback && (
                            <p className={`rounded-xl border px-3 py-2 text-sm font-semibold ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                                {feedback.message}
                            </p>
                        )}

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
