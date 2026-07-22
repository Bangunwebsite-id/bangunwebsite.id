'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

import {
    confirmDeleteData,
    confirmSaveChanges,
    copyTextToClipboard,
    formatDateShort,
    getTodayDateInput,
    publicSiteUrl,
    showCopySuccessToast,
    showErrorAlert,
    showSuccessAlert,
    slugify,
    toDateInputValue,
} from '../dashboard-utils';

type DashboardBlogPost = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    author: string;
    image: string;
    categories: string[];
    published_at: string;
    created_at: string;
    updated_at: string;
};

type BlogFormState = {
    title: string;
    slug: string;
    summary: string;
    content: string;
    author: string;
    image: string;
    categories: string;
    publishedAt: string;
};

type BlogSaveResponse = {
    message?: string;
    id?: number;
    post?: DashboardBlogPost;
};

type BlogPanelProps = {
    initialBlogPosts: DashboardBlogPost[];
};

function getDefaultBlogFormState(): BlogFormState {
    return {
        title: '',
        slug: '',
        summary: '',
        content: '',
        author: 'Tim Bangunwebsite.id',
        image: '',
        categories: 'Website, SEO',
        publishedAt: getTodayDateInput(),
    };
}

function SkeletonBlock({ className }: { className: string }) {
    return (
        <span
            className={`block animate-pulse rounded bg-slate-200 ${className}`}
            aria-hidden='true'
        />
    );
}

export function BlogPanel({ initialBlogPosts }: BlogPanelProps) {
    const [blogPosts, setBlogPosts] = useState<DashboardBlogPost[]>(initialBlogPosts);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);

    const [blogForm, setBlogForm] = useState<BlogFormState>(
        getDefaultBlogFormState()
    );
    const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
    const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);
    const [isBlogFormModalOpen, setIsBlogFormModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [copyingBlogId, setCopyingBlogId] = useState<number | null>(null);
    const [copiedBlogId, setCopiedBlogId] = useState<number | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const latestBlog = blogPosts[0] ?? null;
    const totalBlogCategories = useMemo(
        () =>
            new Set(
                blogPosts.flatMap((post) => post.categories.map((item) => item.trim()))
            ).size,
        [blogPosts]
    );
    const shouldShowBlogSkeleton = isLoadingBlogs && blogPosts.length === 0;

    async function refreshBlogPosts() {
        setIsLoadingBlogs(true);

        try {
            const response = await fetch('/api/admin/blogs', {
                method: 'GET',
                cache: 'no-store',
            });

            const result = (await response.json()) as {
                message?: string;
                posts?: DashboardBlogPost[];
            };

            if (!response.ok || !Array.isArray(result.posts)) {
                throw new Error(
                    result.message ?? 'Gagal memuat daftar artikel terbaru.'
                );
            }

            setBlogPosts(result.posts);
        } catch (error) {
            await showErrorAlert(
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat memuat data artikel.'
            );
        } finally {
            setIsLoadingBlogs(false);
        }
    }

    function resetBlogForm() {
        setEditingBlogId(null);
        setBlogForm(getDefaultBlogFormState());
        setSelectedImageFile(null);
        setIsBlogFormModalOpen(false);
    }

    function handleAddBlog() {
        setEditingBlogId(null);
        setBlogForm(getDefaultBlogFormState());
        setSelectedImageFile(null);
        setIsBlogFormModalOpen(true);
    }

    function upsertBlogPostInState(updatedPost: DashboardBlogPost) {
        setBlogPosts((currentPosts) => {
            const existingIndex = currentPosts.findIndex(
                (post) => Number(post.id) === Number(updatedPost.id)
            );

            if (existingIndex === -1) {
                return [updatedPost, ...currentPosts];
            }

            return currentPosts.map((post) =>
                Number(post.id) === Number(updatedPost.id) ? updatedPost : post
            );
        });
    }

    function handleEditBlog(post: DashboardBlogPost) {
        setEditingBlogId(post.id);
        setSelectedImageFile(null);
        setBlogForm({
            title: post.title,
            slug: post.slug,
            summary: post.summary,
            content: post.content ?? '',
            author: post.author || 'Tim Bangunwebsite.id',
            image: post.image || '/blog/',
            categories: post.categories.join(', '),
            publishedAt: toDateInputValue(post.published_at),
        });
        setIsBlogFormModalOpen(true);
    }

    async function copyLink(post: DashboardBlogPost) {
        const articleUrl = `${publicSiteUrl}/blog/${post.slug}`;
        setCopyingBlogId(post.id);
        setCopiedBlogId(null);

        try {
            await copyTextToClipboard(articleUrl);
            setCopiedBlogId(post.id);
            void showCopySuccessToast(articleUrl);

            window.setTimeout(() => {
                setCopiedBlogId((currentId) =>
                    currentId === post.id ? null : currentId
                );
                setOpenMenuId((currentId) =>
                    currentId === post.id ? null : currentId
                );
            }, 2000);
        } catch (error) {
            await showErrorAlert(
                error instanceof Error
                    ? error.message
                    : 'Tautan gagal disalin. Silakan coba lagi.'
            );
        } finally {
            setCopyingBlogId(null);
        }
    }

    async function handleUploadBlogImage() {
        if (!selectedImageFile) {
            await showErrorAlert('Pilih file gambar terlebih dulu.', 'Gagal!');
            return;
        }

        setIsUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedImageFile);

            const response = await fetch('/api/admin/blogs/upload', {
                method: 'POST',
                body: formData,
            });

            const result = (await response.json()) as {
                message?: string;
                imageUrl?: string;
            };

            if (!response.ok || !result.imageUrl) {
                await showErrorAlert(result.message ?? 'Upload gambar gagal.');
                return;
            }

            setBlogForm((prev) => ({
                ...prev,
                image: result.imageUrl ?? prev.image,
            }));
            setSelectedImageFile(null);
            await showSuccessAlert('Gambar berhasil diupload.', 'Upload Berhasil!');
        } catch {
            await showErrorAlert('Upload gambar gagal.');
        } finally {
            setIsUploadingImage(false);
        }
    }

    async function handleSaveBlog(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const isEditing = editingBlogId !== null;

        if (isEditing) {
            const confirmation = await confirmSaveChanges();

            if (!confirmation.isConfirmed) {
                return;
            }
        }

        setIsSubmittingBlog(true);

        const payload = {
            id: editingBlogId,
            title: blogForm.title,
            slug: blogForm.slug,
            excerpt: blogForm.summary,
            summary: blogForm.summary,
            content: blogForm.content,
            author: blogForm.author,
            image: blogForm.image,
            imagePath: blogForm.image,
            category: blogForm.categories,
            categories: blogForm.categories,
            publishedAt: blogForm.publishedAt,
        };

        const endpoint = isEditing
            ? `/api/admin/blogs/${editingBlogId}`
            : '/api/admin/blogs';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = (await response.json()) as BlogSaveResponse;

            if (!response.ok) {
                await showErrorAlert(
                    result.message ??
                        (isEditing
                            ? 'Artikel gagal diperbarui.'
                            : 'Artikel gagal dibuat.')
                );
                return;
            }

            if (isEditing && !result.post) {
                await showErrorAlert(
                    result.message ??
                        'Artikel diperbarui, tetapi data terbaru tidak dikembalikan API.'
                );
                return;
            }

            if (result.post) {
                upsertBlogPostInState(result.post);
            }

            await refreshBlogPosts();
            resetBlogForm();
            await showSuccessAlert(
                result.message ??
                    (isEditing
                        ? 'Artikel berhasil diperbarui.'
                        : 'Artikel berhasil dibuat.')
            );
        } catch (error) {
            await showErrorAlert(
                error instanceof Error
                    ? error.message
                    : isEditing
                      ? 'Artikel gagal diperbarui.'
                      : 'Artikel gagal dibuat.'
            );
        } finally {
            setIsSubmittingBlog(false);
        }
    }

    async function handleDeleteBlog(postId: number) {
        const confirmation = await confirmDeleteData();

        if (!confirmation.isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/blogs/${postId}`, {
                method: 'DELETE',
            });

            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                await showErrorAlert(result.message ?? 'Data gagal dihapus.');
                return;
            }

            if (editingBlogId === postId) {
                resetBlogForm();
            }

            await refreshBlogPosts();
            await showSuccessAlert('Data berhasil dihapus.');
        } catch {
            await showErrorAlert('Data gagal dihapus.');
        }
    }

    return (
        <section className='space-y-4'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>
                            Blog Management
                        </h3>
                        <p className='mt-2 text-sm font-medium text-slate-600'>
                            Dashboard profesional untuk tim konten: tambah, edit,
                            hapus artikel langsung dari admin panel.
                        </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <button
                            type='button'
                            onClick={handleAddBlog}
                            className='rounded-xl bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                        >
                            + Tambah Artikel
                        </button>
                        <button
                            type='button'
                            onClick={() => {
                                void refreshBlogPosts()
                                    .then(() => showSuccessAlert('Daftar artikel diperbarui.'))
                                    .catch(() => showErrorAlert('Gagal memuat daftar artikel terbaru.'));
                            }}
                            disabled={isLoadingBlogs}
                            className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                        >
                            {isLoadingBlogs ? 'Memuat...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                <div className='mt-5 grid gap-3 md:grid-cols-3'>
                    <article className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                        <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                            Total Artikel
                        </p>
                        <p className='mt-1 text-2xl font-bold text-slate-900'>
                            {shouldShowBlogSkeleton ? (
                                <SkeletonBlock className='h-8 w-24' />
                            ) : (
                                blogPosts.length
                            )}
                        </p>
                    </article>

                    <article className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                        <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                            Total Kategori
                        </p>
                        <p className='mt-1 text-2xl font-bold text-slate-900'>
                            {shouldShowBlogSkeleton ? (
                                <SkeletonBlock className='h-8 w-24' />
                            ) : (
                                totalBlogCategories
                            )}
                        </p>
                    </article>

                    <article className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                        <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                            Artikel Terbaru
                        </p>
                        {shouldShowBlogSkeleton ? (
                            <div className='mt-2 space-y-2'>
                                <SkeletonBlock className='h-5 w-28' />
                                <SkeletonBlock className='h-4 w-44 max-w-full' />
                            </div>
                        ) : (
                            <>
                                <p className='mt-1 text-base font-bold text-slate-900'>
                                    {latestBlog
                                        ? formatDateShort(latestBlog.published_at)
                                        : '-'}
                                </p>
                                <p className='mt-1 truncate text-sm text-slate-600'>
                                    {latestBlog?.title ?? 'Belum ada'}
                                </p>
                            </>
                        )}
                    </article>
                </div>
            </div>

            <div className='grid gap-4'>
                {isBlogFormModalOpen && (
                    <div className='fixed inset-0 z-[99] bg-slate-900/45 p-4 backdrop-blur-sm' />
                )}

                <article className={isBlogFormModalOpen ? 'fixed left-1/2 top-1/2 z-[100] max-h-[90vh] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl' : 'hidden'}>
                    <div className='flex items-center justify-between gap-2'>
                        <h4 className='text-lg font-bold text-slate-900'>
                            {editingBlogId ? 'Edit Artikel' : 'Buat Artikel Baru'}
                        </h4>
                        <button
                            type='button'
                            onClick={() => resetBlogForm()}
                            className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100'
                        >
                            Batal
                        </button>
                    </div>

                    <form className='mt-4 space-y-3' onSubmit={handleSaveBlog}>
                        <div>
                            <label
                                htmlFor='blog-title'
                                className='mb-1 block text-sm font-semibold text-slate-700'
                            >
                                Judul
                            </label>
                            <input
                                id='blog-title'
                                type='text'
                                value={blogForm.title}
                                onChange={(event) =>
                                    setBlogForm((prev) => ({
                                        ...prev,
                                        title: event.target.value,
                                    }))
                                }
                                placeholder='Judul artikel'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </div>

                        <div>
                            <div className='mb-1 flex items-center justify-between gap-2'>
                                <label
                                    htmlFor='blog-slug'
                                    className='text-sm font-semibold text-slate-700'
                                >
                                    Slug
                                </label>
                                <button
                                    type='button'
                                    onClick={() =>
                                        setBlogForm((prev) => ({
                                            ...prev,
                                            slug: slugify(prev.title),
                                        }))
                                    }
                                    className='text-xs font-bold text-cyan-700 underline underline-offset-2'
                                >
                                    Generate dari judul
                                </button>
                            </div>
                            <input
                                id='blog-slug'
                                type='text'
                                value={blogForm.slug}
                                onChange={(event) =>
                                    setBlogForm((prev) => ({
                                        ...prev,
                                        slug: event.target.value,
                                    }))
                                }
                                placeholder='judul-artikel'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </div>

                        <div className='grid gap-3 sm:grid-cols-2'>
                            <div>
                                <label
                                    htmlFor='blog-author'
                                    className='mb-1 block text-sm font-semibold text-slate-700'
                                >
                                    Author
                                </label>
                                <input
                                    id='blog-author'
                                    type='text'
                                    value={blogForm.author}
                                    onChange={(event) =>
                                        setBlogForm((prev) => ({
                                            ...prev,
                                            author: event.target.value,
                                        }))
                                    }
                                    className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='blog-published-at'
                                    className='mb-1 block text-sm font-semibold text-slate-700'
                                >
                                    Tanggal Publish
                                </label>
                                <input
                                    id='blog-published-at'
                                    type='date'
                                    value={blogForm.publishedAt}
                                    onChange={(event) =>
                                        setBlogForm((prev) => ({
                                            ...prev,
                                            publishedAt: event.target.value,
                                        }))
                                    }
                                    className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor='blog-image'
                                className='mb-1 block text-sm font-semibold text-slate-700'
                            >
                                Path Gambar
                            </label>
                            <div className='mb-2 grid gap-2 sm:grid-cols-[1fr_auto]'>
                                <input
                                    id='blog-image-file'
                                    type='file'
                                    accept='image/png,image/jpeg,image/webp,image/gif,image/svg+xml'
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] ?? null;
                                        setSelectedImageFile(file);
                                    }}
                                    className='w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-slate-700 hover:file:bg-slate-200'
                                />
                                <button
                                    type='button'
                                    onClick={handleUploadBlogImage}
                                    disabled={isUploadingImage || !selectedImageFile}
                                    className='rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60'
                                >
                                    {isUploadingImage ? 'Upload...' : 'Upload Gambar'}
                                </button>
                            </div>
                            <input
                                id='blog-image'
                                type='text'
                                value={blogForm.image}
                                onChange={(event) =>
                                    setBlogForm((prev) => ({
                                        ...prev,
                                        image: event.target.value,
                                    }))
                                }
                                placeholder='/blog/nama-gambar.jpeg'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                            />
                            <p className='mt-1 text-xs font-medium text-slate-500'>
                                URL terisi otomatis setelah upload. Kamu juga tetap
                                bisa isi manual jika perlu.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor='blog-categories'
                                className='mb-1 block text-sm font-semibold text-slate-700'
                            >
                                Kategori (pisahkan koma)
                            </label>
                            <input
                                id='blog-categories'
                                type='text'
                                value={blogForm.categories}
                                onChange={(event) =>
                                    setBlogForm((prev) => ({
                                        ...prev,
                                        categories: event.target.value,
                                    }))
                                }
                                placeholder='Website, SEO, AI'
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='blog-summary'
                                className='mb-1 block text-sm font-semibold text-slate-700'
                            >
                                Ringkasan
                            </label>
                            <textarea
                                id='blog-summary'
                                value={blogForm.summary}
                                onChange={(event) =>
                                    setBlogForm((prev) => ({
                                        ...prev,
                                        summary: event.target.value,
                                    }))
                                }
                                rows={4}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='blog-content'
                                className='mb-1 block text-sm font-semibold text-slate-700'
                            >
                                Konten (Markdown)
                            </label>
                            <textarea
                                id='blog-content'
                                value={blogForm.content}
                                onChange={(event) =>
                                    setBlogForm((prev) => ({
                                        ...prev,
                                        content: event.target.value,
                                    }))
                                }
                                rows={14}
                                className='w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </div>

                        <div className='flex justify-end gap-3 border-t border-slate-200 pt-4'>
                            <button
                                type='button'
                                onClick={() => resetBlogForm()}
                                className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                            >
                                Batal
                            </button>
                            <button
                                type='submit'
                                disabled={isSubmittingBlog}
                                className='rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70'
                            >
                                {isSubmittingBlog
                                    ? 'Menyimpan...'
                                    : editingBlogId
                                      ? 'Update Artikel'
                                      : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </article>

                <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                    <h4 className='text-lg font-bold text-slate-900'>
                        Daftar Artikel
                    </h4>
                    <p className='mt-1 text-sm text-slate-600'>
                        Klik edit untuk memperbarui artikel, atau hapus jika tidak
                        dipakai lagi.
                    </p>

                    <div className='mt-4 overflow-x-auto'>
                        <table className='min-w-full text-left'>
                            <thead>
                                <tr className='border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500'>
                                    <th className='px-2 py-2'>Judul</th>
                                    <th className='px-2 py-2'>Slug</th>
                                    <th className='px-2 py-2'>Publish</th>
                                    <th className='px-2 py-2'>Kategori</th>
                                    <th className='px-2 py-2 text-right'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shouldShowBlogSkeleton ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr
                                            key={index}
                                            className='border-b border-slate-100'
                                            aria-hidden='true'
                                        >
                                            <td className='px-2 py-3'>
                                                <SkeletonBlock className='h-5 w-64 max-w-full' />
                                                <SkeletonBlock className='mt-2 h-4 w-48 max-w-full' />
                                            </td>
                                            <td className='px-2 py-3'>
                                                <SkeletonBlock className='h-4 w-36' />
                                            </td>
                                            <td className='px-2 py-3'>
                                                <SkeletonBlock className='h-4 w-24' />
                                            </td>
                                            <td className='px-2 py-3'>
                                                <SkeletonBlock className='h-4 w-40' />
                                            </td>
                                            <td className='px-2 py-3'>
                                                <div className='flex justify-end gap-2'>
                                                    <SkeletonBlock className='h-8 w-14' />
                                                    <SkeletonBlock className='h-8 w-8' />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : blogPosts.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className='px-2 py-4 text-sm font-medium text-slate-500'
                                        >
                                            Belum ada artikel blog di database.
                                        </td>
                                    </tr>
                                ) : (
                                    blogPosts.map((post) => (
                                        <tr
                                            key={post.id}
                                            className='border-b border-slate-100 text-sm text-slate-700'
                                        >
                                            <td className='px-2 py-3'>
                                                <p className='max-w-xs truncate font-semibold text-slate-900'>
                                                    {post.title}
                                                </p>
                                                <p className='mt-1 max-w-xs truncate text-xs text-slate-500'>
                                                    {post.summary}
                                                </p>
                                            </td>
                                            <td className='px-2 py-3 font-mono text-xs text-slate-600'>
                                                {post.slug}
                                            </td>
                                            <td className='px-2 py-3 text-slate-600'>
                                                {formatDateShort(post.published_at)}
                                            </td>
                                            <td className='px-2 py-3'>
                                                <p className='max-w-[220px] truncate text-xs text-slate-600'>
                                                    {post.categories.join(', ')}
                                                </p>
                                            </td>
                                            <td className='px-2 py-3'>
                                                <div className='flex items-center justify-end gap-2'>
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        target='_blank'
                                                        className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100'
                                                    >
                                                        Lihat
                                                    </Link>
                                                    <div className='relative'>
                                                        <button
                                                            type='button'
                                                            onClick={() =>
                                                                setOpenMenuId(
                                                                    openMenuId === post.id
                                                                        ? null
                                                                        : post.id
                                                                )
                                                            }
                                                            className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700'
                                                        >
                                                            <svg
                                                                xmlns='http://www.w3.org/2000/svg'
                                                                width='16'
                                                                height='16'
                                                                viewBox='0 0 24 24'
                                                                fill='none'
                                                                stroke='currentColor'
                                                                strokeWidth='2'
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                            >
                                                                <circle cx='12' cy='12' r='1' />
                                                                <circle cx='12' cy='5' r='1' />
                                                                <circle cx='12' cy='19' r='1' />
                                                            </svg>
                                                        </button>

                                                        {openMenuId === post.id && (
                                                            <div className='absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg'>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        handleEditBlog(post);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className='flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50'
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        void copyLink(post);
                                                                    }}
                                                                    disabled={
                                                                        copyingBlogId === post.id
                                                                    }
                                                                    className='flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70'
                                                                >
                                                                    {copiedBlogId === post.id ? (
                                                                        <span
                                                                            aria-hidden='true'
                                                                            className='text-emerald-600'
                                                                        >
                                                                            &#10003;
                                                                        </span>
                                                                    ) : (
                                                                        <svg
                                                                            xmlns='http://www.w3.org/2000/svg'
                                                                            width='16'
                                                                            height='16'
                                                                            viewBox='0 0 24 24'
                                                                            fill='none'
                                                                            stroke='currentColor'
                                                                            strokeWidth='2'
                                                                            strokeLinecap='round'
                                                                            strokeLinejoin='round'
                                                                            aria-hidden='true'
                                                                        >
                                                                            <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
                                                                            <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
                                                                        </svg>
                                                                    )}
                                                                    {copyingBlogId === post.id
                                                                        ? 'Menyalin...'
                                                                        : copiedBlogId === post.id
                                                                          ? 'Tautan Disalin'
                                                                          : 'Salin Tautan'}
                                                                </button>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        setOpenMenuId(null);
                                                                        void handleDeleteBlog(post.id);
                                                                    }}
                                                                    className='flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-slate-50'
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>
        </section>
    );
}
