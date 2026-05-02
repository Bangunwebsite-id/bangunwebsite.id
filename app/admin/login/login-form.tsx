'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export function LoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const result = (await response.json()) as { message?: string };
                setError(result.message ?? 'Login gagal. Silakan coba lagi.');
                return;
            }

            router.push('/admin/dashboard');
            router.refresh();
        } catch {
            setError('Tidak bisa terhubung ke server. Coba beberapa saat lagi.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className='flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10'>
            <div className='w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_65px_-35px_rgba(15,23,42,0.45)]'>
                <p className='mb-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-700'>
                    Admin Panel
                </p>
                <h1 className='text-3xl font-bold text-slate-900'>
                    Login Admin
                </h1>
                <p className='mt-2 text-sm font-medium text-slate-600'>
                    Masuk untuk mengakses dashboard admin.
                </p>

                <form className='mt-7 space-y-4' onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor='username'
                            className='mb-1.5 block text-sm font-semibold text-slate-700'
                        >
                            Username
                        </label>
                        <input
                            id='username'
                            name='username'
                            type='text'
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete='username'
                            className='w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                            placeholder='Masukkan username'
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='password'
                            className='mb-1.5 block text-sm font-semibold text-slate-700'
                        >
                            Password
                        </label>
                        <input
                            id='password'
                            name='password'
                            type='password'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete='current-password'
                            className='w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                            placeholder='Masukkan password'
                            required
                        />
                    </div>

                    {error && (
                        <p className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700'>
                            {error}
                        </p>
                    )}

                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full rounded-xl bg-cyan-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70'
                    >
                        {isSubmitting ? 'Memproses...' : 'Login'}
                    </button>
                </form>

                <div className='mt-5 text-center'>
                    <Link
                        href='/'
                        className='text-sm font-semibold text-cyan-700 underline underline-offset-2'
                    >
                        Kembali ke beranda
                    </Link>
                </div>
            </div>
        </main>
    );
}
