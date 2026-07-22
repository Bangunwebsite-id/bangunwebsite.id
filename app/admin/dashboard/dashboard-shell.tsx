'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { dashboardTabs, type DashboardTabId } from './dashboard-utils';

type DashboardShellProps = {
    username: string;
    children: ReactNode;
};

function getActiveTabId(pathname: string): DashboardTabId {
    const segment = pathname.replace(/^\/admin\/dashboard\/?/, '').split('/')[0];
    const match = dashboardTabs.find((tab) => tab.id === segment);
    return match?.id ?? 'overview';
}

export function DashboardShell({ username, children }: DashboardShellProps) {
    const pathname = usePathname();
    const activeTabId = getActiveTabId(pathname);
    const activeTab =
        dashboardTabs.find((tab) => tab.id === activeTabId) ?? dashboardTabs[0];

    return (
        <main className='min-h-screen bg-slate-50 text-slate-900'>
            <aside
                data-admin-shell-aside
                className='fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col'
            >
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
                        const isActive = activeTabId === tab.id;

                        return (
                            <Link
                                key={tab.id}
                                href={`/admin/dashboard/${tab.id}`}
                                className={`block w-full rounded-xl border px-3 py-2.5 text-left transition ${
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
                            </Link>
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

            <div data-admin-shell-content className='lg:pl-72'>
                <div className='mx-auto w-full max-w-[1240px] px-4 py-6 md:px-6 lg:px-8'>
                    <header
                        data-admin-shell-header
                        className='rounded-2xl border border-slate-200 bg-white p-5'
                    >
                        <div className='flex flex-wrap items-start justify-between gap-4'>
                            <div>
                                <p className='text-xs font-bold uppercase tracking-[0.18em] text-cyan-700'>
                                    Control Panel
                                </p>
                                <h2 className='mt-2 text-2xl font-bold text-slate-900 md:text-3xl'>
                                    {activeTab.label}
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
                                const isActive = activeTabId === tab.id;

                                return (
                                    <Link
                                        key={tab.id}
                                        href={`/admin/dashboard/${tab.id}`}
                                        className={`rounded-xl border px-3 py-2 text-center text-sm font-bold transition ${
                                            isActive
                                                ? 'border-cyan-200 bg-cyan-50 text-cyan-700'
                                                : 'border-slate-200 bg-white text-slate-700'
                                        }`}
                                    >
                                        {tab.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </header>

                    <div className='mt-6'>{children}</div>
                </div>
            </div>
        </main>
    );
}
