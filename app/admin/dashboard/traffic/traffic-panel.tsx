'use client';

import { useMemo, useState } from 'react';

import {
    formatDayLabel,
    getSourceBadgeClass,
    showErrorAlert,
} from '../dashboard-utils';
import type { TrafficSummary } from '@/app/lib/admin-metrics';

type TrafficPanelProps = {
    initialTrafficSummary: TrafficSummary;
};

export function TrafficPanel({ initialTrafficSummary }: TrafficPanelProps) {
    const [trafficSummary, setTrafficSummary] = useState<TrafficSummary>(
        initialTrafficSummary
    );
    const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);

    const maxDailyUnique = useMemo(
        () =>
            Math.max(
                1,
                ...trafficSummary.last7DaysDaily.map((item) => item.uniques)
            ),
        [trafficSummary]
    );

    const trafficDaily = trafficSummary.last7DaysDaily;
    const trafficTodaySources = trafficSummary.todayTopSources;
    const trafficLast7DaysSources = trafficSummary.last7DaysTopSources;
    const trafficTopPages = trafficSummary.last7DaysTopPages;

    async function refreshTrafficSummary() {
        setIsLoadingTraffic(true);

        try {
            const response = await fetch('/api/admin/traffic/summary', {
                method: 'GET',
                cache: 'no-store',
            });

            const result = (await response.json()) as {
                message?: string;
                trafficSummary?: TrafficSummary;
            };

            if (!response.ok || !result.trafficSummary) {
                throw new Error(
                    result.message ?? 'Gagal memuat data traffic terbaru.'
                );
            }

            setTrafficSummary(result.trafficSummary);
        } catch (error) {
            await showErrorAlert(
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat memuat data traffic.'
            );
        } finally {
            setIsLoadingTraffic(false);
        }
    }

    return (
        <section className='space-y-4'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 md:p-6'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <h3 className='text-xl font-bold text-slate-900 md:text-2xl'>
                        Traffic
                    </h3>
                    <button
                        type='button'
                        onClick={() => void refreshTrafficSummary()}
                        disabled={isLoadingTraffic}
                        className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {isLoadingTraffic ? 'Memuat...' : 'Refresh Traffic'}
                    </button>
                </div>
                <p className='mt-2 text-sm font-medium text-slate-600'>
                    Data traffic dedupe harian berdasarkan visitor/IP.
                </p>
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
                                        {formatDayLabel(item.visit_date)}
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
                                    <th className='px-2 py-2'>Source</th>
                                    <th className='px-2 py-2'>Host</th>
                                    <th className='px-2 py-2 text-right'>
                                        Unique
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {trafficTodaySources.length === 0 ? (
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
                                    trafficTodaySources.map((item) => (
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
                                                {item.source_host ?? '-'}
                                            </td>
                                            <td className='px-2 py-3 text-right font-bold text-slate-900'>
                                                {item.uniques}
                                            </td>
                                        </tr>
                                    ))
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
                                    <th className='px-2 py-2'>Source</th>
                                    <th className='px-2 py-2'>Host</th>
                                    <th className='px-2 py-2 text-right'>
                                        Unique
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {trafficLast7DaysSources.length === 0 ? (
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
                                    trafficLast7DaysSources.map((item) => (
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
                                                {item.source_host ?? '-'}
                                            </td>
                                            <td className='px-2 py-3 text-right font-bold text-slate-900'>
                                                {item.uniques}
                                            </td>
                                        </tr>
                                    ))
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
    );
}
