import Image from 'next/image';

import { LoadingLink } from '@/app/components/loading-link';

export default function NotFound() {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-20 text-center text-slate-900'>
            <Image
                src='/bangun-website.png'
                alt='BangunWebsite.id'
                width={170}
                height={44}
                className='h-11 w-auto'
                priority
            />

            <p className='mt-10 text-sm font-bold uppercase tracking-[0.3em] text-cyan-700'>
                404
            </p>
            <h1 className='mt-3 text-3xl font-bold leading-tight sm:text-4xl'>
                Halaman Tidak Ditemukan
            </h1>
            <p className='mt-4 max-w-md text-base leading-7 text-slate-600'>
                Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
                Coba kembali ke halaman utama.
            </p>

            <LoadingLink
                href='/'
                className='mt-8 rounded-full bg-cyan-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-cyan-800 sm:text-base'
            >
                Kembali ke Halaman Utama
            </LoadingLink>
        </main>
    );
}
