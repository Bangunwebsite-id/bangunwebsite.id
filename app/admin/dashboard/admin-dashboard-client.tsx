'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

import { NotulenPanel } from './notulen-panel';

type DashboardUser = {
    id: number;
    username: string;
    created_at: string;
    updated_at: string;
};

type SourceStat = {
    source_label: string;
    source_host: string | null;
    uniques: number;
};

type PathStat = {
    landing_path: string;
    uniques: number;
};

type DailyStat = {
    visit_date: string;
    uniques: number;
};

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

type DashboardTrafficSummary = {
    todayUniqueVisitors: number;
    yesterdayUniqueVisitors: number;
    last7DaysUniqueVisitors: number;
    last7DaysDaily: DailyStat[];
    todayTopSources: SourceStat[];
    last7DaysTopSources: SourceStat[];
    last7DaysTopPages: PathStat[];
};

type AdminDashboardClientProps = {
    username: string;
    initialOverviewMetrics: DashboardOverviewMetrics;
    timezone: string;
};

type DashboardOverviewMetrics = {
    totalUsers: number;
    totalBlogs: number;
    todayUniqueVisitors: number;
    yesterdayUniqueVisitors: number;
    last7DaysUniqueVisitors: number;
    todayMainSource: string;
    last7DaysMainSource: string;
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

const dashboardTabs = [
    {
        id: 'overview',
        label: 'Overview',
        description: 'Ringkasan performa',
    },
    {
        id: 'traffic',
        label: 'Traffic',
        description: 'Sumber dan tren',
    },
    {
        id: 'users',
        label: 'Users',
        description: 'Manajemen akun',
    },
    {
        id: 'blog',
        label: 'Blog',
        description: 'CRUD artikel',
    },
    {
        id: 'notulen',
        label: 'Notulen',
        description: 'CRUD rapat',
    },
] as const;

type DashboardTabId = (typeof dashboardTabs)[number]['id'];

function formatDate(value: string) {
    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDateShort(value: string) {
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatDayLabel(value: string) {
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
    });
}

function toDateInputValue(value: string) {
    return new Date(value).toISOString().slice(0, 10);
}

function getTodayDateInput() {
    return new Date().toISOString().slice(0, 10);
}

function getGrowthLabel(today: number, yesterday: number) {
    if (yesterday === 0 && today > 0) {
        return '+100%';
    }

    if (yesterday === 0) {
        return '0%';
    }

    const pct = ((today - yesterday) / yesterday) * 100;
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
}

function slugify(raw: string) {
    return raw
        .toLowerCase()
        .trim()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function getSourceBadgeClass(sourceLabel: string) {
    if (sourceLabel.startsWith('utm:')) {
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }

    const label = sourceLabel.toLowerCase();

    if (label === 'direct') {
        return 'border-slate-200 bg-slate-100 text-slate-700';
    }
    if (label === 'google' || label === 'bing' || label === 'duckduckgo') {
        return 'border-sky-200 bg-sky-50 text-sky-700';
    }
    if (
        label === 'instagram' ||
        label === 'facebook' ||
        label === 'tiktok' ||
        label === 'x-twitter' ||
        label === 'youtube' ||
        label === 'linkedin' ||
        label === 'whatsapp'
    ) {
        return 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700';
    }

    return 'border-amber-200 bg-amber-50 text-amber-700';
}

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

export function AdminDashboardClient({
    username,
    initialOverviewMetrics,
    timezone,
}: AdminDashboardClientProps) {
    const [activeTab, setActiveTab] = useState<DashboardTabId>('overview');
    const [users, setUsers] = useState<DashboardUser[]>([]);
    const [blogPosts, setBlogPosts] = useState<DashboardBlogPost[]>([]);
    const [overviewMetrics, setOverviewMetrics] =
        useState<DashboardOverviewMetrics | null>(initialOverviewMetrics);
    const [trafficSummary, setTrafficSummary] =
        useState<DashboardTrafficSummary | null>(null);
    const [isLoadingOverview, setIsLoadingOverview] = useState(false);
    const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
    const [overviewError, setOverviewError] = useState<string | null>(null);
    const [trafficError, setTrafficError] = useState<string | null>(null);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [blogsError, setBlogsError] = useState<string | null>(null);
    const [isUsersLoaded, setIsUsersLoaded] = useState(false);
    const [isBlogsLoaded, setIsBlogsLoaded] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSubmittingUser, setIsSubmittingUser] = useState(false);
    const [userFeedback, setUserFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [blogForm, setBlogForm] = useState<BlogFormState>(
        getDefaultBlogFormState()
    );
    const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
    const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);
    const [blogFeedback, setBlogFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);
    const [isDeletingBlogId, setIsDeletingBlogId] = useState<number | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageUploadFeedback, setImageUploadFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const growthLabel = useMemo(() => {
        if (!overviewMetrics) {
            return '-';
        }

        return getGrowthLabel(
            overviewMetrics.todayUniqueVisitors,
            overviewMetrics.yesterdayUniqueVisitors
        );
    }, [overviewMetrics]);

    const maxDailyUnique = useMemo(
        () =>
            Math.max(
                1,
                ...(trafficSummary?.last7DaysDaily ?? []).map(
                    (item) => item.uniques
                )
            ),
        [trafficSummary]
    );

    const totalUsers = overviewMetrics?.totalUsers ?? users.length;
    const totalBlogs = overviewMetrics?.totalBlogs ?? blogPosts.length;
    const todayMainSource = overviewMetrics?.todayMainSource ?? '-';
    const last7DaysMainSource = overviewMetrics?.last7DaysMainSource ?? '-';
    const latestBlog = blogPosts[0] ?? null;
    const todayVisitorValue = overviewMetrics
        ? String(overviewMetrics.todayUniqueVisitors)
        : isLoadingOverview
          ? '...'
          : '-';
    const yesterdayVisitorValue = overviewMetrics
        ? String(overviewMetrics.yesterdayUniqueVisitors)
        : isLoadingOverview
          ? '...'
          : '-';
    const last7DaysVisitorValue = overviewMetrics
        ? String(overviewMetrics.last7DaysUniqueVisitors)
        : isLoadingOverview
          ? '...'
          : '-';
    const totalUsersValue = overviewMetrics
        ? String(totalUsers)
        : isLoadingOverview
          ? '...'
          : '-';
    const totalBlogsValue = overviewMetrics
        ? String(totalBlogs)
        : isLoadingOverview
          ? '...'
          : '-';
    const totalBlogCategories = useMemo(
        () =>
            new Set(
                blogPosts.flatMap((post) => post.categories.map((item) => item.trim()))
            ).size,
        [blogPosts]
    );
    const blogTotalValue = isBlogsLoaded
        ? String(totalBlogs)
        : isLoadingBlogs
          ? '...'
          : '-';
    const trafficDaily = trafficSummary?.last7DaysDaily ?? [];
    const trafficTodaySources = trafficSummary?.todayTopSources ?? [];
    const trafficLast7DaysSources = trafficSummary?.last7DaysTopSources ?? [];
    const trafficTopPages = trafficSummary?.last7DaysTopPages ?? [];

    async function refreshOverview() {
        setIsLoadingOverview(true);
        setOverviewError(null);

        try {
            const response = await fetch('/api/admin/dashboard/overview', {
                method: 'GET',
                cache: 'no-store',
            });

            const result = (await response.json()) as {
                message?: string;
                overview?: DashboardOverviewMetrics;
            };

            if (!response.ok || !result.overview) {
                throw new Error(
                    result.message ?? 'Gagal memuat ringkasan dashboard.'
                );
            }

            setOverviewMetrics(result.overview);
        } catch (error) {
            setOverviewError(
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat memuat ringkasan dashboard.'
            );
            throw error;
        } finally {
            setIsLoadingOverview(false);
        }
    }

    async function refreshTrafficSummary() {
        setIsLoadingTraffic(true);
        setTrafficError(null);

        try {
            const response = await fetch('/api/admin/traffic/summary', {
                method: 'GET',
                cache: 'no-store',
            });

            const result = (await response.json()) as {
                message?: string;
                trafficSummary?: DashboardTrafficSummary;
            };

            if (!response.ok || !result.trafficSummary) {
                throw new Error(
                    result.message ?? 'Gagal memuat data traffic terbaru.'
                );
            }

            setTrafficSummary(result.trafficSummary);
        } catch (error) {
            setTrafficError(
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat memuat data traffic.'
            );
            throw error;
        } finally {
            setIsLoadingTraffic(false);
        }
    }

    async function refreshUsers() {
        setIsLoadingUsers(true);
        setUsersError(null);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'GET',
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error('Gagal memuat daftar user terbaru.');
            }

            const result = (await response.json()) as { users: DashboardUser[] };
            setUsers(result.users);
            setIsUsersLoaded(true);
        } catch (error) {
            setUsersError(
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat memuat user dashboard.'
            );
            throw error;
        } finally {
            setIsLoadingUsers(false);
        }
    }

    async function refreshBlogPosts() {
        setIsLoadingBlogs(true);
        setBlogsError(null);

        try {
            const response = await fetch('/api/admin/blogs', {
                method: 'GET',
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error('Gagal memuat daftar artikel terbaru.');
            }

            const result = (await response.json()) as { posts: DashboardBlogPost[] };
            setBlogPosts(result.posts);
            setIsBlogsLoaded(true);
        } catch (error) {
            setBlogsError(
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat memuatt data artikel.'
            );
            throw error;
        } finally {
            setIsLoadingBlogs(false);
        }
    }

    function handleSelectTab(tabId: DashboardTabId) {
        setActiveTab(tabId);

        if (tabId === 'overview' && !overviewMetrics && !isLoadingOverview) {
            void refreshOverview();
        }

        if (tabId === 'traffic' && !trafficSummary && !isLoadingTraffic) {
            void refreshTrafficSummary();
        }

        if (tabId === 'users' && !isUsersLoaded && !isLoadingUsers) {
            void refreshUsers();
        }

        if (tabId === 'blog' && !isBlogsLoaded && !isLoadingBlogs) {
            void refreshBlogPosts();
        }
    }

    async function handleAddUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmittingUser(true);
        setUserFeedback(null);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: newUsername,
                    password: newPassword,
                }),
            });

            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                setUserFeedback({
                    type: 'error',
                    message:
                        result.message ?? 'Gagal menambahkan user admin baru.',
                });
                return;
            }

            setUserFeedback({
                type: 'success',
                message: result.message ?? 'User admin berhasil ditambahkan.',
            });
            setNewUsername('');
            setNewPassword('');
            await refreshUsers();
            void refreshOverview();
        } catch {
            setUserFeedback({
                type: 'error',
                message: 'Terjadi masalah koneksi. Coba lagi beberapa saat.',
            });
        } finally {
            setIsSubmittingUser(false);
        }
    }

    function resetBlogForm(clearFeedback = true) {
        setEditingBlogId(null);
        setBlogForm(getDefaultBlogFormState());
        setSelectedImageFile(null);
        setImageUploadFeedback(null);
        if (clearFeedback) {
            setBlogFeedback(null);
        }
    }

    function handleEditBlog(post: DashboardBlogPost) {
        setActiveTab('blog');
        setEditingBlogId(post.id);
        setBlogFeedback(null);
        setImageUploadFeedback(null);
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
    }

    async function handleUploadBlogImage() {
        if (!selectedImageFile) {
            setImageUploadFeedback({
                type: 'error',
                message: 'Pilih file gambar terlebih dulu.',
            });
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

            const result = (await response.json()) as {
                message?: string;
                imageUrl?: string;
            };

            if (!response.ok || !result.imageUrl) {
                setImageUploadFeedback({
                    type: 'error',
                    message:
                        result.message ?? 'Upload gambar gagal. Silakan coba lagi.',
                });
                return;
            }

            setBlogForm((prev) => ({
                ...prev,
                image: result.imageUrl ?? prev.image,
            }));
            setImageUploadFeedback({
                type: 'success',
                message:
                    result.message ??
                    'Gambar berhasil diupload dan URL sudah terisi otomatis.',
            });
            setSelectedImageFile(null);
        } catch {
            setImageUploadFeedback({
                type: 'error',
                message: 'Terjadi masalah koneksi saat upload gambar.',
            });
        } finally {
            setIsUploadingImage(false);
        }
    }

    async function handleSaveBlog(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmittingBlog(true);
        setBlogFeedback(null);

        const payload = {
            title: blogForm.title,
            slug: blogForm.slug,
            summary: blogForm.summary,
            content: blogForm.content,
            author: blogForm.author,
            image: blogForm.image,
            categories: blogForm.categories,
            publishedAt: blogForm.publishedAt,
        };

        const endpoint = editingBlogId
            ? `/api/admin/blogs/${editingBlogId}`
            : '/api/admin/blogs';
        const method = editingBlogId ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                setBlogFeedback({
                    type: 'error',
                    message: result.message ?? 'Gagal menyimpan artikel.',
                });
                return;
            }

            setBlogFeedback({
                type: 'success',
                message:
                    result.message ??
                    (editingBlogId
                        ? 'Artikel berhasil diperbarui.'
                        : 'Artikel berhasil dibuat.'),
            });
            await refreshBlogPosts();
            void refreshOverview();
            resetBlogForm(false);
        } catch {
            setBlogFeedback({
                type: 'error',
                message: 'Terjadi masalah koneksi. Coba lagi beberapa saat.',
            });
        } finally {
            setIsSubmittingBlog(false);
        }
    }

    async function handleDeleteBlog(postId: number) {
        setIsDeletingBlogId(postId);
        setBlogFeedback(null);

        try {
            const response = await fetch(`/api/admin/blogs/${postId}`, {
                method: 'DELETE',
            });

            const result = (await response.json()) as { message?: string };

            if (!response.ok) {
                setBlogFeedback({
                    type: 'error',
                    message: result.message ?? 'Gagal menghapus artikel.',
                });
                return;
            }

            if (editingBlogId === postId) {
                resetBlogForm();
            }

            setBlogFeedback({
                type: 'success',
                message: result.message ?? 'Artikel berhasil dihapus.',
            });
            await refreshBlogPosts();
            void refreshOverview();
        } catch {
            setBlogFeedback({
                type: 'error',
                message: 'Terjadi masalah koneksi. Coba lagi beberapa saat.',
            });
        } finally {
            setIsDeletingBlogId(null);
        }
    }

    return (
        <main className='min-h-screen bg-slate-50 text-slate-900'>
            <aside className='fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col'>
                <div className='border-b border-slate-200 p-6'>
                    <p className='text-xs font-bold uppercase tracking-[0.18em] text-cyan-700'>
                        BangunWebsite Admin
                    </p>
                    <h1 className='mt-2 text-2xl font-bold text-slate-900'>
                        Dashboard
                    </h1>
                    <p className='mt-1 text-xs font-semibold text-slate-500'>
                        Login: {username}
                    </p>
                </div>

                <nav className='flex-1 space-y-1 p-4'>
                    {dashboardTabs.map((tab) => {
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type='button'
                                onClick={() => handleSelectTab(tab.id)}
                                className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                                    isActive
                                        ? 'border-cyan-200 bg-cyan-50'
                                        : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <p
                                    className={`text-sm font-bold ${
                                        isActive
                                            ? 'text-cyan-700'
                                            : 'text-slate-700'
                                    }`}
                                >
                                    {tab.label}
                                </p>
                                <p className='mt-0.5 text-xs font-medium text-slate-500'>
                                    {tab.description}
                                </p>
                            </button>
                        );
                    })}
                </nav>

                <div className='space-y-2 border-t border-slate-200 p-4'>
                    <Link
                        href='/'
                        className='block rounded-xl border border-slate-300 px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                    >
                        Lihat Website
                    </Link>
                    <form action='/api/admin/logout' method='POST'>
                        <button
                            type='submit'
                            className='w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-700'
                        >
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            <div className='lg:pl-72'>
                <div className='mx-auto w-full max-w-[1240px] px-4 py-6 md:px-6 lg:px-8'>
                    <header className='rounded-2xl border border-slate-200 bg-white p-5'>
                        <div className='flex flex-wrap items-start justify-between gap-4'>
                            <div>
                                <p className='text-xs font-bold uppercase tracking-[0.18em] text-cyan-700'>
                                    Control Panel
                                </p>
                                <h2 className='mt-2 text-2xl font-bold text-slate-900 md:text-3xl'>
                                    {dashboardTabs.find((tab) => tab.id === activeTab)
                                        ?.label ?? 'Dashboard'}
                                </h2>
                                <p className='mt-2 text-sm font-medium text-slate-600'>
                                    Dashboard app dengan sidebar fixed dan panel
                                    konten terpisah per fitur.
                                </p>
                            </div>

                            <div className='grid grid-cols-2 gap-2 lg:hidden'>
                                <Link
                                    href='/'
                                    className='rounded-xl border border-slate-300 px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                                >
                                    Website
                                </Link>
                                <form action='/api/admin/logout' method='POST'>
                                    <button
                                        type='submit'
                                        className='w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-700'
                                    >
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className='mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-4 lg:hidden'>
                            {dashboardTabs.map((tab) => {
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type='button'
                                        onClick={() => handleSelectTab(tab.id)}
                                        className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                                            isActive
                                                ? 'border-cyan-200 bg-cyan-50 text-cyan-700'
                                                : 'border-slate-200 bg-white text-slate-700'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </header>

                    <div className='mt-6'>
                        {activeTab === 'overview' && (
                            <section className='space-y-4'>
                                <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                                    <div className='flex flex-wrap items-center justify-between gap-3'>
                                        <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>
                                            Overview
                                        </h3>
                                        <div className='flex items-center gap-2'>
                                            <span className='rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-cyan-700'>
                                                Unique Daily Tracking
                                            </span>
                                            <button
                                                type='button'
                                                onClick={() => void refreshOverview()}
                                                disabled={isLoadingOverview}
                                                className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
                                            >
                                                {isLoadingOverview
                                                    ? 'Memuat...'
                                                    : 'Refresh'}
                                            </button>
                                        </div>
                                    </div>

                                    {overviewError && (
                                        <p className='mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700'>
                                            {overviewError}
                                        </p>
                                    )}

                                    <div className='mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                                        <article className='rounded-xl border border-slate-200 bg-white p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                Visitor Hari Ini
                                            </p>
                                            <p className='mt-2 text-3xl font-bold text-slate-900'>
                                                {todayVisitorValue}
                                            </p>
                                            <p className='mt-2 text-xs font-semibold text-slate-500'>
                                                Timezone {timezone}
                                            </p>
                                        </article>

                                        <article className='rounded-xl border border-slate-200 bg-white p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                Visitor Kemarin
                                            </p>
                                            <p className='mt-2 text-3xl font-bold text-slate-900'>
                                                {yesterdayVisitorValue}
                                            </p>
                                            <p className='mt-2 text-xs font-semibold text-slate-500'>
                                                Baseline harian
                                            </p>
                                        </article>

                                        <article className='rounded-xl border border-slate-200 bg-white p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                Unique 7 Hari
                                            </p>
                                            <p className='mt-2 text-3xl font-bold text-slate-900'>
                                                {last7DaysVisitorValue}
                                            </p>
                                            <p className='mt-2 text-xs font-semibold text-slate-500'>
                                                Rolling 7 hari
                                            </p>
                                        </article>

                                        <article className='rounded-xl border border-slate-200 bg-white p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                Growth Harian
                                            </p>
                                            <p className='mt-2 text-3xl font-bold text-cyan-700'>
                                                {growthLabel}
                                            </p>
                                            <p className='mt-2 text-xs font-semibold text-slate-500'>
                                                Hari ini vs kemarin
                                            </p>
                                        </article>
                                    </div>

                                    <div className='mt-4 grid gap-3 md:grid-cols-4'>
                                        <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                User Dashboard
                                            </p>
                                            <p className='mt-1 text-2xl font-bold text-slate-900'>
                                                {totalUsersValue}
                                            </p>
                                        </div>

                                        <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                Total Artikel
                                            </p>
                                            <p className='mt-1 text-2xl font-bold text-slate-900'>
                                                {totalBlogsValue}
                                            </p>
                                        </div>

                                        <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                Source Utama Hari Ini
                                            </p>
                                            <p className='mt-2'>
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getSourceBadgeClass(todayMainSource)}`}
                                                >
                                                    {todayMainSource}
                                                </span>
                                            </p>
                                        </div>

                                        <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                Source Utama 7 Hari
                                            </p>
                                            <p className='mt-2'>
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getSourceBadgeClass(last7DaysMainSource)}`}
                                                >
                                                    {last7DaysMainSource}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'traffic' && (
                            <section className='space-y-4'>
                                <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                                    <div className='flex flex-wrap items-center justify-between gap-3'>
                                        <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>
                                            Traffic
                                        </h3>
                                        <button
                                            type='button'
                                            onClick={() =>
                                                void refreshTrafficSummary()
                                            }
                                            disabled={isLoadingTraffic}
                                            className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
                                        >
                                            {isLoadingTraffic
                                                ? 'Memuat...'
                                                : 'Refresh Traffic'}
                                        </button>
                                    </div>
                                    <p className='mt-2 text-sm font-medium text-slate-600'>
                                        Data traffic dedupe harian berdasarkan
                                        visitor/IP.
                                    </p>
                                    {trafficError && (
                                        <p className='mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700'>
                                            {trafficError}
                                        </p>
                                    )}

                                    <div className='mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                        <div className='mb-4 flex items-center justify-between gap-3'>
                                            <p className='text-sm font-bold text-slate-700'>
                                                Tren Visitor Unik 7 Hari
                                            </p>
                                            <span className='rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600'>
                                                Daily unique
                                            </span>
                                        </div>

                                        <div className='space-y-3'>
                                            {trafficDaily.length === 0 ? (
                                                <p className='text-sm font-medium text-slate-500'>
                                                    {isLoadingTraffic
                                                        ? 'Memuat data tren harian...'
                                                        : 'Belum ada data tren harian.'}
                                                </p>
                                            ) : (
                                                trafficDaily.map((item) => (
                                                    <div
                                                        key={item.visit_date}
                                                        className='grid grid-cols-[76px_1fr_auto] items-center gap-3'
                                                    >
                                                        <span className='text-xs font-bold text-slate-500'>
                                                            {formatDayLabel(
                                                                item.visit_date
                                                            )}
                                                        </span>
                                                        <div className='h-2 rounded-full bg-slate-200'>
                                                            <div
                                                                className='h-2 rounded-full bg-cyan-500'
                                                                style={{
                                                                    width: `${Math.max(
                                                                        6,
                                                                        (item.uniques /
                                                                            maxDailyUnique) *
                                                                            100
                                                                    )}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className='min-w-10 text-right text-sm font-bold text-slate-900'>
                                                            {item.uniques}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className='grid gap-4 xl:grid-cols-2'>
                                    <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                                        <h4 className='text-lg font-bold text-slate-900'>
                                            Sumber Traffic Hari Ini
                                        </h4>
                                        <div className='mt-4 overflow-x-auto'>
                                            <table className='min-w-full text-left'>
                                                <thead>
                                                    <tr className='border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500'>
                                                        <th className='px-2 py-2'>
                                                            Source
                                                        </th>
                                                        <th className='px-2 py-2'>
                                                            Host
                                                        </th>
                                                        <th className='px-2 py-2 text-right'>
                                                            Unique
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {trafficTodaySources.length ===
                                                    0 ? (
                                                        <tr>
                                                            <td
                                                                colSpan={3}
                                                                className='px-2 py-4 text-sm font-medium text-slate-500'
                                                            >
                                                                {isLoadingTraffic
                                                                    ? 'Memuat data traffic hari ini...'
                                                                    : 'Belum ada data traffic hari ini.'}
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        trafficTodaySources.map(
                                                            (item) => (
                                                                <tr
                                                                    key={`${item.source_label}-${item.source_host ?? 'none'}`}
                                                                    className='border-b border-slate-100 text-sm'
                                                                >
                                                                    <td className='px-2 py-3'>
                                                                        <span
                                                                            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${getSourceBadgeClass(item.source_label)}`}
                                                                        >
                                                                            {item.source_label}
                                                                        </span>
                                                                    </td>
                                                                    <td className='px-2 py-3 text-slate-700'>
                                                                        {item.source_host ??
                                                                            '-'}
                                                                    </td>
                                                                    <td className='px-2 py-3 text-right font-bold text-slate-900'>
                                                                        {item.uniques}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </article>

                                    <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                                        <h4 className='text-lg font-bold text-slate-900'>
                                            Sumber Traffic 7 Hari
                                        </h4>
                                        <div className='mt-4 overflow-x-auto'>
                                            <table className='min-w-full text-left'>
                                                <thead>
                                                    <tr className='border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500'>
                                                        <th className='px-2 py-2'>
                                                            Source
                                                        </th>
                                                        <th className='px-2 py-2'>
                                                            Host
                                                        </th>
                                                        <th className='px-2 py-2 text-right'>
                                                            Unique
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {trafficLast7DaysSources.length ===
                                                    0 ? (
                                                        <tr>
                                                            <td
                                                                colSpan={3}
                                                                className='px-2 py-4 text-sm font-medium text-slate-500'
                                                            >
                                                                {isLoadingTraffic
                                                                    ? 'Memuat data traffic 7 hari...'
                                                                    : 'Belum ada data traffic 7 hari.'}
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        trafficLast7DaysSources.map(
                                                            (item) => (
                                                                <tr
                                                                    key={`${item.source_label}-${item.source_host ?? 'none'}-7d`}
                                                                    className='border-b border-slate-100 text-sm'
                                                                >
                                                                    <td className='px-2 py-3'>
                                                                        <span
                                                                            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${getSourceBadgeClass(item.source_label)}`}
                                                                        >
                                                                            {item.source_label}
                                                                        </span>
                                                                    </td>
                                                                    <td className='px-2 py-3 text-slate-700'>
                                                                        {item.source_host ??
                                                                            '-'}
                                                                    </td>
                                                                    <td className='px-2 py-3 text-right font-bold text-slate-900'>
                                                                        {item.uniques}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </article>
                                </div>

                                <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                                    <h4 className='text-lg font-bold text-slate-900'>
                                        Top Landing Page (7 Hari)
                                    </h4>
                                    <div className='mt-4 space-y-3'>
                                        {trafficTopPages.length === 0 ? (
                                            <p className='text-sm font-medium text-slate-500'>
                                                {isLoadingTraffic
                                                    ? 'Memuat data landing page...'
                                                    : 'Belum ada data landing page.'}
                                            </p>
                                        ) : (
                                            trafficTopPages.map((item) => (
                                                <div
                                                    key={item.landing_path}
                                                    className='flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5'
                                                >
                                                    <p className='truncate text-sm font-semibold text-slate-800'>
                                                        {item.landing_path}
                                                    </p>
                                                    <span className='rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-bold text-cyan-700'>
                                                        {item.uniques} unik
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </article>
                            </section>
                        )}

                        {activeTab === 'users' && (
                            <section className='space-y-4'>
                                <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                                    <div className='flex flex-wrap items-center justify-between gap-3'>
                                        <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>
                                            Users
                                        </h3>
                                        <button
                                            type='button'
                                            onClick={() => void refreshUsers()}
                                            disabled={isLoadingUsers}
                                            className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
                                        >
                                            {isLoadingUsers
                                                ? 'Memuat...'
                                                : 'Refresh Users'}
                                        </button>
                                    </div>
                                    <p className='mt-2 text-sm font-medium text-slate-600'>
                                        Menambahkan akun admin baru yang bisa login
                                        ke dashboard.
                                    </p>
                                    {usersError && (
                                        <p className='mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700'>
                                            {usersError}
                                        </p>
                                    )}
                                </div>

                                <div className='grid gap-4 xl:grid-cols-2'>
                                    <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                                        <h4 className='text-lg font-bold text-slate-900'>
                                            Tambah User Admin
                                        </h4>

                                        <form
                                            className='mt-4 space-y-4'
                                            onSubmit={handleAddUser}
                                        >
                                            <div>
                                                <label
                                                    htmlFor='new-username'
                                                    className='mb-1.5 block text-sm font-semibold text-slate-700'
                                                >
                                                    Username
                                                </label>
                                                <input
                                                    id='new-username'
                                                    type='text'
                                                    value={newUsername}
                                                    onChange={(event) =>
                                                        setNewUsername(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder='contoh: editor1'
                                                    className='w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor='new-password'
                                                    className='mb-1.5 block text-sm font-semibold text-slate-700'
                                                >
                                                    Password
                                                </label>
                                                <input
                                                    id='new-password'
                                                    type='password'
                                                    value={newPassword}
                                                    onChange={(event) =>
                                                        setNewPassword(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder='Minimal 8 karakter'
                                                    className='w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                                    required
                                                />
                                            </div>

                                            {userFeedback && (
                                                <p
                                                    className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                                                        userFeedback.type ===
                                                        'success'
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                            : 'border-red-200 bg-red-50 text-red-700'
                                                    }`}
                                                >
                                                    {userFeedback.message}
                                                </p>
                                            )}

                                            <button
                                                type='submit'
                                                disabled={isSubmittingUser}
                                                className='w-full rounded-xl bg-cyan-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70'
                                            >
                                                {isSubmittingUser
                                                    ? 'Menyimpan...'
                                                    : 'Tambah User'}
                                            </button>
                                        </form>
                                    </article>

                                    <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                                        <h4 className='text-lg font-bold text-slate-900'>
                                            Daftar User Admin
                                        </h4>

                                        <div className='mt-4 overflow-x-auto'>
                                            <table className='min-w-full text-left'>
                                                <thead>
                                                    <tr className='border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500'>
                                                        <th className='px-2 py-2'>
                                                            Username
                                                        </th>
                                                        <th className='px-2 py-2'>
                                                            Dibuat
                                                        </th>
                                                        <th className='px-2 py-2'>
                                                            Update
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.length === 0 ? (
                                                        <tr>
                                                            <td
                                                                colSpan={3}
                                                                className='px-2 py-4 text-sm font-medium text-slate-500'
                                                            >
                                                                {isLoadingUsers
                                                                    ? 'Memuat daftar user admin...'
                                                                    : 'Belum ada user admin.'}
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        users.map((user) => (
                                                            <tr
                                                                key={user.id}
                                                                className='border-b border-slate-100 text-sm text-slate-700'
                                                            >
                                                                <td className='px-2 py-3 font-semibold text-slate-900'>
                                                                    {user.username}
                                                                </td>
                                                                <td className='px-2 py-3'>
                                                                    {formatDate(
                                                                        user.created_at
                                                                    )}
                                                                </td>
                                                                <td className='px-2 py-3'>
                                                                    {formatDate(
                                                                        user.updated_at
                                                                    )}
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
                        )}

                        {activeTab === 'blog' && (
                            <section className='space-y-4'>
                                <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                                    <div className='flex flex-wrap items-center justify-between gap-3'>
                                        <div>
                                            <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>
                                                Blog Management
                                            </h3>
                                            <p className='mt-2 text-sm font-medium text-slate-600'>
                                                Dashboard profesional untuk tim
                                                konten: tambah, edit, hapus artikel
                                                langsung dari admin panel.
                                            </p>
                                        </div>
                                        <button
                                            type='button'
                                            onClick={() => {
                                                void refreshBlogPosts()
                                                    .then(() => {
                                                        setBlogFeedback({
                                                            type: 'success',
                                                            message:
                                                                'Daftar artikel diperbarui.',
                                                        });
                                                    })
                                                    .catch(() => null);
                                            }}
                                            disabled={isLoadingBlogs}
                                            className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                                        >
                                            {isLoadingBlogs
                                                ? 'Memuat...'
                                                : 'Refresh Data'}
                                        </button>
                                    </div>
                                    {blogsError && (
                                        <p className='mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700'>
                                            {blogsError}
                                        </p>
                                    )}

                                    <div className='mt-5 grid gap-3 md:grid-cols-3'>
                                        <article className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                Total Artikel
                                            </p>
                                            <p className='mt-1 text-2xl font-bold text-slate-900'>
                                                {blogTotalValue}
                                            </p>
                                        </article>

                                        <article className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                Total Kategori
                                            </p>
                                            <p className='mt-1 text-2xl font-bold text-slate-900'>
                                                {totalBlogCategories}
                                            </p>
                                        </article>

                                        <article className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                            <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-500'>
                                                Artikel Terbaru
                                            </p>
                                            <p className='mt-1 text-base font-bold text-slate-900'>
                                                {latestBlog
                                                    ? formatDateShort(
                                                          latestBlog.published_at
                                                      )
                                                    : '-'}
                                            </p>
                                            <p className='mt-1 truncate text-sm text-slate-600'>
                                                {latestBlog?.title ?? 'Belum ada'}
                                            </p>
                                        </article>
                                    </div>
                                </div>

                                <div className='grid gap-4 xl:grid-cols-5'>
                                    <article className='rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2'>
                                        <div className='flex items-center justify-between gap-2'>
                                            <h4 className='text-lg font-bold text-slate-900'>
                                                {editingBlogId
                                                    ? 'Edit Artikel'
                                                    : 'Buat Artikel Baru'}
                                            </h4>
                                            {editingBlogId && (
                                                <button
                                                    type='button'
                                                    onClick={() => resetBlogForm()}
                                                    className='rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100'
                                                >
                                                    Batal Edit
                                                </button>
                                            )}
                                        </div>

                                        <form
                                            className='mt-4 space-y-3'
                                            onSubmit={handleSaveBlog}
                                        >
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
                                                                slug: slugify(
                                                                    prev.title
                                                                ),
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
                                                                publishedAt:
                                                                    event.target.value,
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
                                                            const file =
                                                                event.target.files?.[0] ??
                                                                null;
                                                            setSelectedImageFile(file);
                                                            setImageUploadFeedback(null);
                                                        }}
                                                        className='w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-slate-700 hover:file:bg-slate-200'
                                                    />
                                                    <button
                                                        type='button'
                                                        onClick={handleUploadBlogImage}
                                                        disabled={
                                                            isUploadingImage ||
                                                            !selectedImageFile
                                                        }
                                                        className='rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60'
                                                    >
                                                        {isUploadingImage
                                                            ? 'Upload...'
                                                            : 'Upload Gambar'}
                                                    </button>
                                                </div>
                                                {imageUploadFeedback && (
                                                    <p
                                                        className={`mb-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
                                                            imageUploadFeedback.type ===
                                                            'success'
                                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                : 'border-red-200 bg-red-50 text-red-700'
                                                        }`}
                                                    >
                                                        {imageUploadFeedback.message}
                                                    </p>
                                                )}
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
                                                    URL terisi otomatis setelah upload.
                                                    Kamu juga tetap bisa isi manual jika
                                                    perlu.
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
                                                            categories:
                                                                event.target.value,
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
                                                            summary:
                                                                event.target.value,
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
                                                            content:
                                                                event.target.value,
                                                        }))
                                                    }
                                                    rows={14}
                                                    className='w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                                    required
                                                />
                                            </div>

                                            {blogFeedback && (
                                                <p
                                                    className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                                                        blogFeedback.type ===
                                                        'success'
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                            : 'border-red-200 bg-red-50 text-red-700'
                                                    }`}
                                                >
                                                    {blogFeedback.message}
                                                </p>
                                            )}

                                            <button
                                                type='submit'
                                                disabled={isSubmittingBlog}
                                                className='w-full rounded-xl bg-cyan-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70'
                                            >
                                                {isSubmittingBlog
                                                    ? 'Menyimpan...'
                                                    : editingBlogId
                                                      ? 'Update Artikel'
                                                      : 'Publikasikan Artikel'}
                                            </button>
                                        </form>
                                    </article>

                                    <article className='rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-3'>
                                        <h4 className='text-lg font-bold text-slate-900'>
                                            Daftar Artikel
                                        </h4>
                                        <p className='mt-1 text-sm text-slate-600'>
                                            Klik edit untuk memperbarui artikel,
                                            atau hapus jika tidak dipakai lagi.
                                        </p>

                                        <div className='mt-4 overflow-x-auto'>
                                            <table className='min-w-full text-left'>
                                                <thead>
                                                    <tr className='border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500'>
                                                        <th className='px-2 py-2'>
                                                            Judul
                                                        </th>
                                                        <th className='px-2 py-2'>
                                                            Slug
                                                        </th>
                                                        <th className='px-2 py-2'>
                                                            Publish
                                                        </th>
                                                        <th className='px-2 py-2'>
                                                            Kategori
                                                        </th>
                                                        <th className='px-2 py-2 text-right'>
                                                            Aksi
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {blogPosts.length === 0 ? (
                                                        <tr>
                                                            <td
                                                                colSpan={5}
                                                                className='px-2 py-4 text-sm font-medium text-slate-500'
                                                            >
                                                                {isLoadingBlogs
                                                                    ? 'Memuat daftar artikel blog...'
                                                                    : 'Belum ada artikel blog di database.'}
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
                                                                    {formatDateShort(
                                                                        post.published_at
                                                                    )}
                                                                </td>
                                                                <td className='px-2 py-3'>
                                                                    <p className='max-w-[220px] truncate text-xs text-slate-600'>
                                                                        {post.categories.join(
                                                                            ', '
                                                                        )}
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
                                                                                        openMenuId ===
                                                                                            post.id
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
                                                                                    <circle
                                                                                        cx='12'
                                                                                        cy='12'
                                                                                        r='1'
                                                                                    />
                                                                                    <circle
                                                                                        cx='12'
                                                                                        cy='5'
                                                                                        r='1'
                                                                                    />
                                                                                    <circle
                                                                                        cx='12'
                                                                                        cy='19'
                                                                                        r='1'
                                                                                    />
                                                                                </svg>
                                                                            </button>

                                                                            {openMenuId ===
                                                                                post.id && (
                                                                                <div className='absolute right-0 top-full z-50 mt-1 w-32 rounded-xl border border-slate-200 bg-white py-1 shadow-lg'>
                                                                                    <button
                                                                                        type='button'
                                                                                        onClick={() => {
                                                                                            handleEditBlog(
                                                                                                post
                                                                                            );
                                                                                            setOpenMenuId(
                                                                                                null
                                                                                            );
                                                                                        }}
                                                                                        className='flex w-full px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50'
                                                                                    >
                                                                                        Edit
                                                                                    </button>
                                                                                    <button
                                                                                        type='button'
                                                                                        onClick={() => {
                                                                                            setDeleteConfirmId(
                                                                                                post.id
                                                                                            );
                                                                                            setOpenMenuId(
                                                                                                null
                                                                                            );
                                                                                        }}
                                                                                        className='flex w-full px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-slate-50'
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
                        )}

                        {activeTab === 'notulen' && <NotulenPanel />}
                    </div>
                </div>
            </div>

            {deleteConfirmId && (
                <div className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm'>
                    <div className='w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl'>
                        <h3 className='text-lg font-bold text-slate-900'>Konfirmasi Hapus</h3>
                        <p className='mt-2 text-sm font-medium text-slate-600'>
                            Yakin ingin menghapus artikel ini? Tindakan ini tidak bisa dibatalkan.
                        </p>
                        <div className='mt-6 flex justify-end gap-3'>
                            <button
                                type='button'
                                onClick={() => setDeleteConfirmId(null)}
                                className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                            >
                                Batal
                            </button>
                            <button
                                type='button'
                                onClick={() => {
                                    const id = deleteConfirmId;
                                    setDeleteConfirmId(null);
                                    void handleDeleteBlog(id);
                                }}
                                disabled={isDeletingBlogId !== null}
                                className='rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50'
                            >
                                {isDeletingBlogId !== null ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
