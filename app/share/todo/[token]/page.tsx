import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getSharedTodoDataByToken } from '@/app/lib/todos';

import { SharedTodoView } from './shared-todo-view';

type ShareTodoPageProps = {
    params: Promise<{ token: string }>;
    searchParams: Promise<{ date?: string }>;
};

export const metadata: Metadata = {
    title: 'Share To Do List',
    description: 'Halaman publik read-only untuk melihat progress To Do List.',
};

function serializeDate(value: Date) {
    return value.toISOString();
}

function isValidDateInput(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

function getTodayDateInput() {
    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}

export default async function ShareTodoPage({
    params,
    searchParams,
}: ShareTodoPageProps) {
    const [{ token }, { date }] = await Promise.all([params, searchParams]);
    const data = await getSharedTodoDataByToken(token);

    if (!data) {
        notFound();
    }

    const initialDate = date && isValidDateInput(date) ? date : getTodayDateInput();
    const isDateLocked = Boolean(date && isValidDateInput(date));

    return (
        <main className='min-h-screen bg-slate-50 text-slate-900'>
            <header className='sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur'>
                <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3'>
                    <Link href='/' className='flex items-center gap-3'>
                        <Image
                            src='/bangun-website.png'
                            alt='BangunWebsite.id'
                            width={170}
                            height={44}
                            className='h-11 w-auto'
                            priority
                        />
                    </Link>
                    <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-500'>
                        Read Only
                    </span>
                </div>
            </header>

            <SharedTodoView
                initialDate={initialDate}
                isDateLocked={isDateLocked}
                todos={data.todos.map((item) => ({
                    ...item,
                    created_at: serializeDate(item.created_at),
                    updated_at: serializeDate(item.updated_at),
                }))}
            />
        </main>
    );
}
