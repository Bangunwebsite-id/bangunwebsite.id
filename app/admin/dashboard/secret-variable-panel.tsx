'use client';

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

type ModalMode = 'variable-create' | 'variable-edit' | 'category-create' | 'category-edit';

type DashboardSecretCategory = {
    id: number;
    name: string;
    description: string | null;
    variable_count: number;
    created_at: string;
    updated_at: string;
};

type DashboardSecretVariable = {
    id: number;
    category: string;
    name: string;
    value: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};

type SecretVariableFormState = {
    category: string;
    name: string;
    value: string;
    description: string;
};

type SecretCategoryFormState = {
    name: string;
    description: string;
};

function getDefaultVariableFormState(category = ''): SecretVariableFormState {
    return {
        category,
        name: '',
        value: '',
        description: '',
    };
}

function getDefaultCategoryFormState(): SecretCategoryFormState {
    return {
        name: '',
        description: '',
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

function confirmDeleteData() {
    return Swal.fire({
        icon: 'warning',
        title: 'Hapus Data?',
        text: 'Data yang dihapus tidak dapat dikembalikan.',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: swalDeleteButtonColor,
        cancelButtonColor: swalCancelButtonColor,
    });
}

function maskValue(value: string) {
    if (!value) {
        return '---';
    }

    return '*'.repeat(Math.min(Math.max(value.length, 8), 18));
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
                        x
                    </button>
                </div>
                <div className='p-5'>{children}</div>
            </div>
        </div>
    );
}

export function SecretVariablePanel() {
    const [categories, setCategories] = useState<DashboardSecretCategory[]>([]);
    const [secretVariables, setSecretVariables] = useState<DashboardSecretVariable[]>([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [variableForm, setVariableForm] = useState<SecretVariableFormState>(getDefaultVariableFormState());
    const [categoryForm, setCategoryForm] = useState<SecretCategoryFormState>(getDefaultCategoryFormState());
    const [modalMode, setModalMode] = useState<ModalMode | null>(null);
    const [editingVariableId, setEditingVariableId] = useState<number | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [visibleIds, setVisibleIds] = useState<Set<number>>(() => new Set());
    const [search, setSearch] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingVariableId, setDeletingVariableId] = useState<number | null>(null);
    const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

    const activeCategoryData = categories.find((item) => item.name === activeCategory) ?? categories[0] ?? null;

    const filteredVariables = useMemo(() => {
        const categoryName = activeCategoryData?.name ?? '';
        const query = search.trim().toLowerCase();

        return secretVariables.filter((item) => {
            if (item.category !== categoryName) {
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
    }, [activeCategoryData?.name, search, secretVariables]);

    const fetchSecretData = useCallback(async () => {
        const response = await fetch('/api/admin/secret-variables', {
            method: 'GET',
            cache: 'no-store',
        });
        const result = (await response.json()) as {
            message?: string;
            categories?: DashboardSecretCategory[];
            secretVariables?: DashboardSecretVariable[];
        };

        if (!response.ok || !result.secretVariables || !result.categories) {
            throw new Error(result.message ?? 'Gagal memuat secret variable.');
        }

        return {
            categories: result.categories,
            secretVariables: result.secretVariables,
        };
    }, []);

    const refreshSecretData = useCallback(async () => {
        setIsLoading(true);

        try {
            const nextData = await fetchSecretData();
            setCategories(nextData.categories);
            setSecretVariables(nextData.secretVariables);
            setActiveCategory((current) => {
                if (nextData.categories.some((item) => item.name === current)) {
                    return current;
                }

                return nextData.categories[0]?.name ?? '';
            });
            setIsLoaded(true);
        } catch (error) {
            await showErrorAlert(error instanceof Error ? error.message : 'Terjadi masalah koneksi saat memuat secret variable.');
        } finally {
            setIsLoading(false);
        }
    }, [fetchSecretData]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshSecretData();
    }, [refreshSecretData]);

    function closeModal() {
        setModalMode(null);
        setEditingVariableId(null);
        setEditingCategoryId(null);
        setVariableForm(getDefaultVariableFormState(activeCategoryData?.name ?? ''));
        setCategoryForm(getDefaultCategoryFormState());
    }

    function openCreateVariableModal(categoryName: string) {
        if (!categoryName) {
            void showErrorAlert('Tambahkan kategori terlebih dahulu.');
            return;
        }

        setActiveCategory(categoryName);
        setVariableForm(getDefaultVariableFormState(categoryName));
        setEditingVariableId(null);
        setModalMode('variable-create');
    }

    function openEditVariableModal(item: DashboardSecretVariable) {
        setActiveCategory(item.category);
        setEditingVariableId(item.id);
        setVariableForm({
            category: item.category,
            name: item.name,
            value: item.value,
            description: item.description ?? '',
        });
        setModalMode('variable-edit');
    }

    function openCreateCategoryModal() {
        setCategoryForm(getDefaultCategoryFormState());
        setEditingCategoryId(null);
        setModalMode('category-create');
    }

    function openEditCategoryModal(item: DashboardSecretCategory) {
        setEditingCategoryId(item.id);
        setCategoryForm({
            name: item.name,
            description: item.description ?? '',
        });
        setModalMode('category-edit');
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
                title: 'Berhasil!',
                text: 'Secret variable berhasil disalin.',
                confirmButtonColor: swalConfirmButtonColor,
                timer: 1600,
                showConfirmButton: false,
            });
        } catch {
            await showErrorAlert('Clipboard tidak tersedia. Salin manual dari tombol Lihat.');
        }
    }

    async function handleSaveVariable(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const isEditing = editingVariableId !== null;

        if (isEditing) {
            const confirmation = await confirmSaveChanges();

            if (!confirmation.isConfirmed) {
                return;
            }
        }

        setIsSubmitting(true);

        const endpoint = isEditing
            ? `/api/admin/secret-variables/${editingVariableId}`
            : '/api/admin/secret-variables';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(variableForm),
            });
            if (!response.ok) {
                await showErrorAlert(isEditing ? 'Secret Variable gagal diperbarui.' : 'Secret Variable gagal dibuat.');
                return;
            }

            await refreshSecretData();
            setActiveCategory(variableForm.category);
            closeModal();
            await showSuccessAlert(isEditing ? 'Secret Variable berhasil diperbarui.' : 'Secret Variable berhasil dibuat.');
        } catch {
            await showErrorAlert(isEditing ? 'Secret Variable gagal diperbarui.' : 'Secret Variable gagal dibuat.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSaveCategory(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const isEditing = editingCategoryId !== null;

        if (isEditing) {
            const confirmation = await confirmSaveChanges();

            if (!confirmation.isConfirmed) {
                return;
            }
        }

        setIsSubmitting(true);

        const endpoint = isEditing
            ? `/api/admin/secret-variable-categories/${editingCategoryId}`
            : '/api/admin/secret-variable-categories';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryForm),
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Data gagal disimpan. Silakan coba lagi.');
                return;
            }

            await refreshSecretData();
            setActiveCategory(categoryForm.name);
            closeModal();
            await showSuccessAlert(isEditing ? 'Kategori berhasil diperbarui.' : 'Kategori berhasil dibuat.');
        } catch {
            await showErrorAlert('Data gagal disimpan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteVariable(id: number) {
        const confirmation = await confirmDeleteData();

        if (!confirmation.isConfirmed) {
            return;
        }

        setDeletingVariableId(id);

        try {
            const response = await fetch(`/api/admin/secret-variables/${id}`, {
                method: 'DELETE',
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Data gagal dihapus.');
                return;
            }

            setVisibleIds((current) => {
                const next = new Set(current);
                next.delete(id);
                return next;
            });
            await refreshSecretData();
            await showSuccessAlert('Data berhasil dihapus.');
        } catch {
            await showErrorAlert('Data gagal dihapus.');
        } finally {
            setDeletingVariableId(null);
        }
    }

    async function handleDeleteCategory(item: DashboardSecretCategory) {
        const confirmation = await confirmDeleteData();

        if (!confirmation.isConfirmed) {
            return;
        }

        setDeletingCategoryId(item.id);

        try {
            const response = await fetch(`/api/admin/secret-variable-categories/${item.id}`, {
                method: 'DELETE',
            });
            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Data gagal dihapus.');
                return;
            }

            await refreshSecretData();
            await showSuccessAlert('Data berhasil dihapus.');
        } catch {
            await showErrorAlert('Data gagal dihapus.');
        } finally {
            setDeletingCategoryId(null);
        }
    }

    const isVariableModal = modalMode === 'variable-create' || modalMode === 'variable-edit';
    const isCategoryModal = modalMode === 'category-create' || modalMode === 'category-edit';

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
                    <div className='flex flex-wrap gap-2'>
                        <button
                            type='button'
                            onClick={openCreateCategoryModal}
                            className='rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                        >
                            Tambah Kategori
                        </button>
                        <button
                            type='button'
                            onClick={() => void refreshSecretData()}
                            disabled={isLoading}
                            className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            {isLoading ? 'Memuat...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {categories.length === 0 ? (
                    <article className='rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center md:col-span-2 xl:col-span-3'>
                        <p className='text-sm font-bold text-slate-700'>
                            Belum ada kategori secret variable.
                        </p>
                        <p className='mt-1 text-sm text-slate-500'>
                            Tambahkan kategori seperti Database, WhatsApp, AI, atau Payment Gateway.
                        </p>
                        <button
                            type='button'
                            onClick={openCreateCategoryModal}
                            className='mt-4 rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                        >
                            Tambah Kategori
                        </button>
                    </article>
                ) : (
                    categories.map((category) => (
                        <article key={category.id} className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                            <div className='flex items-start justify-between gap-4'>
                                <div>
                                    <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                        Kategori
                                    </p>
                                    <h4 className='mt-2 text-xl font-bold text-slate-900'>
                                        {category.name}
                                    </h4>
                                    <p className='mt-2 text-3xl font-bold text-slate-900'>
                                        {isLoaded ? category.variable_count : isLoading ? '...' : '-'} <span className='text-base font-bold text-slate-500'>Variable</span>
                                    </p>
                                    {category.description && (
                                        <p className='mt-2 line-clamp-2 text-sm text-slate-600'>
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                                <div className='rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700'>
                                    Secret
                                </div>
                            </div>
                            <div className='mt-6 flex flex-wrap gap-2'>
                                <button
                                    type='button'
                                    onClick={() => setActiveCategory(category.name)}
                                    className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                                >
                                    Kelola
                                </button>
                                <button
                                    type='button'
                                    onClick={() => openCreateVariableModal(category.name)}
                                    className='rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                                >
                                    Tambah
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>

            <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h4 className='text-lg font-bold text-slate-900'>
                            Kelola {activeCategoryData?.name ?? 'Secret Variable'}
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
                            onClick={() => openCreateVariableModal(activeCategoryData?.name ?? '')}
                            disabled={!activeCategoryData}
                            className='rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60'
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
                                                    <button type='button' onClick={() => openEditVariableModal(item)} className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100'>
                                                        Edit
                                                    </button>
                                                    <button type='button' onClick={() => void handleDeleteVariable(item.id)} disabled={deletingVariableId === item.id} className='rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50'>
                                                        {deletingVariableId === item.id ? 'Hapus...' : 'Hapus'}
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

            <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h4 className='text-lg font-bold text-slate-900'>Kelola Kategori</h4>
                        <p className='mt-1 text-sm text-slate-600'>
                            Tambah, edit, atau hapus kategori secret variable.
                        </p>
                    </div>
                    <button
                        type='button'
                        onClick={openCreateCategoryModal}
                        className='rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                    >
                        Tambah Kategori
                    </button>
                </div>

                <div className='mt-4 overflow-x-auto'>
                    <table className='min-w-full text-left'>
                        <thead>
                            <tr className='border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500'>
                                <th className='px-2 py-2'>Nama Kategori</th>
                                <th className='px-2 py-2'>Jumlah Variable</th>
                                <th className='px-2 py-2'>Deskripsi</th>
                                <th className='px-2 py-2 text-right'>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className='px-2 py-6 text-center text-sm font-medium text-slate-500'>
                                        Belum ada kategori.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className='border-b border-slate-100 text-sm text-slate-700'>
                                        <td className='px-2 py-3 font-bold text-slate-900'>{category.name}</td>
                                        <td className='px-2 py-3'>{category.variable_count} Variable</td>
                                        <td className='px-2 py-3'>{category.description ?? '-'}</td>
                                        <td className='px-2 py-3'>
                                            <div className='flex flex-wrap justify-end gap-2'>
                                                <button type='button' onClick={() => openEditCategoryModal(category)} className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100'>
                                                    Edit
                                                </button>
                                                <button type='button' onClick={() => void handleDeleteCategory(category)} disabled={deletingCategoryId === category.id} className='rounded-lg border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50'>
                                                    {deletingCategoryId === category.id ? 'Hapus...' : 'Hapus'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </article>

            {isVariableModal && (
                <Modal title={modalMode === 'variable-edit' ? 'Edit Secret Variable' : 'Tambah Secret Variable'} onClose={closeModal}>
                    <form className='space-y-4' onSubmit={handleSaveVariable}>
                        <Field label='Kategori' id='secret-category'>
                            <select
                                id='secret-category'
                                value={variableForm.category}
                                onChange={(event) => setVariableForm((prev) => ({ ...prev, category: event.target.value }))}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            >
                                <option value='' disabled>Pilih kategori</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label='Nama Variable' id='secret-name'>
                            <input
                                id='secret-name'
                                type='text'
                                value={variableForm.name}
                                onChange={(event) => setVariableForm((prev) => ({ ...prev, name: event.target.value }))}
                                placeholder='DB_HOST'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </Field>
                        <Field label='Value' id='secret-value'>
                            <textarea
                                id='secret-value'
                                value={variableForm.value}
                                onChange={(event) => setVariableForm((prev) => ({ ...prev, value: event.target.value }))}
                                placeholder='127.0.0.1'
                                rows={4}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </Field>
                        <Field label='Keterangan' id='secret-description'>
                            <textarea
                                id='secret-description'
                                value={variableForm.description}
                                onChange={(event) => setVariableForm((prev) => ({ ...prev, description: event.target.value }))}
                                placeholder='Database utama production'
                                rows={3}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
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

            {isCategoryModal && (
                <Modal title={modalMode === 'category-edit' ? 'Edit Kategori' : 'Tambah Kategori'} onClose={closeModal}>
                    <form className='space-y-4' onSubmit={handleSaveCategory}>
                        <Field label='Nama Kategori' id='secret-category-name'>
                            <input
                                id='secret-category-name'
                                type='text'
                                value={categoryForm.name}
                                onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
                                placeholder='WhatsApp'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </Field>
                        <Field label='Deskripsi' id='secret-category-description'>
                            <textarea
                                id='secret-category-description'
                                value={categoryForm.description}
                                onChange={(event) => setCategoryForm((prev) => ({ ...prev, description: event.target.value }))}
                                placeholder='Token dan konfigurasi WhatsApp Gateway'
                                rows={3}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
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
