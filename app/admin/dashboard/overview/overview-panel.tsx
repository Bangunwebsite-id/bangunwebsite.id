'use client';

import { useMemo, useState } from 'react';

import {
    getGrowthLabel,
    getSourceBadgeClass,
    showErrorAlert,
} from '../dashboard-utils';

type DashboardOverviewMetrics = {
    totalUsers: number;
    totalBlogs: number;
    todayUniqueVisitors: number;
    yesterdayUniqueVisitors: number;
    last7DaysUniqueVisitors: number;
    todayMainSource: string;
    last7DaysMainSource: string;
};

type OverviewPanelProps = {
    initialOverviewMetrics: DashboardOverviewMetrics;
    timezone: string;
};

export function OverviewPanel({
    initialOverviewMetrics,
    timezone,
}: OverviewPanelProps) {
    const [overviewMetrics, setOverviewMetrics] =
        useState<DashboardOverviewMetrics | null>(initialOverviewMetrics);
    const [isLoadingOverview, setIsLoadingOverview] = useState(false);

    const growthLabel = useMemo(() => {
        if (!overviewMetrics) {
            return '-';
        }

        return getGrowthLabel(
            overviewMetrics.todayUniqueVisitors,
            overviewMetrics.yesterdayUniqueVisitors
        );
    }, [overviewMetrics]);

    const totalUsersValue = overviewMetrics
        ? String(overviewMetrics.totalUsers)
        : isLoadingOverview
          ? '...'
          : '-';
    const totalBlogsValue = overviewMetrics
        ? String(overviewMetrics.totalBlogs)
        : isLoadingOverview
          ? '...'
          : '-';
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
    const todayMainSource = overviewMetrics?.todayMainSource ?? '-';
    const last7DaysMainSource = overviewMetrics?.last7DaysMainSource ?? '-';

    async function refreshOverview() {
        setIsLoadingOverview(true);

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
            await showErrorAlert(
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat memuat ringkasan dashboard.'
            );
        } finally {
            setIsLoadingOverview(false);
        }
    }

    return (
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
                            {isLoadingOverview ? 'Memuat...' : 'Refresh'}
                        </button>
                    </div>
                </div>

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
    );
}
