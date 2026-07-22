'use client';

import { FormEvent, useState } from 'react';

import { formatDate, showErrorAlert, showSuccessAlert } from '../dashboard-utils';

type DashboardUser = {
    id: number;
    username: string;
    created_at: string;
    updated_at: string;
};

type UsersPanelProps = {
    initialUsers: DashboardUser[];
};

export function UsersPanel({ initialUsers }: UsersPanelProps) {
    const [users, setUsers] = useState<DashboardUser[]>(initialUsers);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSubmittingUser, setIsSubmittingUser] = useState(false);

    async function refreshUsers() {
        setIsLoadingUsers(true);

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
        } catch (error) {
            await showErrorAlert(
                error instanceof Error
                    ? error.message
                    : 'Terjadi kesalahan saat memuat user dashboard.'
            );
        } finally {
            setIsLoadingUsers(false);
        }
    }

    async function handleAddUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmittingUser(true);

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
                await showErrorAlert(result.message ?? 'Gagal menambahkan user admin baru.');
                return;
            }

            setNewUsername('');
            setNewPassword('');
            await refreshUsers();
            await showSuccessAlert('User admin berhasil ditambahkan.');
        } catch {
            await showErrorAlert('Terjadi masalah koneksi. Coba lagi beberapa saat.');
        } finally {
            setIsSubmittingUser(false);
        }
    }

    return (
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
                        {isLoadingUsers ? 'Memuat...' : 'Refresh Users'}
                    </button>
                </div>
                <p className='mt-2 text-sm font-medium text-slate-600'>
                    Menambahkan akun admin baru yang bisa login ke dashboard.
                </p>
            </div>

            <div className='grid gap-4 xl:grid-cols-2'>
                <article className='rounded-2xl border border-slate-200 bg-white p-5'>
                    <h4 className='text-lg font-bold text-slate-900'>
                        Tambah User Admin
                    </h4>

                    <form className='mt-4 space-y-4' onSubmit={handleAddUser}>
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
                                    setNewUsername(event.target.value)
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
                                    setNewPassword(event.target.value)
                                }
                                placeholder='Minimal 8 karakter'
                                className='w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none ring-cyan-400 transition focus:border-cyan-500 focus:ring-2'
                                required
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={isSubmittingUser}
                            className='w-full rounded-xl bg-cyan-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70'
                        >
                            {isSubmittingUser ? 'Menyimpan...' : 'Tambah User'}
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
                                    <th className='px-2 py-2'>Username</th>
                                    <th className='px-2 py-2'>Dibuat</th>
                                    <th className='px-2 py-2'>Update</th>
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
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className='px-2 py-3'>
                                                {formatDate(user.updated_at)}
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
