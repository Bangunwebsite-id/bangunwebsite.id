import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { listPublishedBlogPosts } from '@/app/lib/blogs';
import { getPublicSiteConfig } from '@/app/lib/site-config';

export const metadata: Metadata = {
    title: 'Blog',
    description:
        'Kumpulan artikel BangunWebsite.id tentang website, SEO, AI, dan strategi digital untuk UMKM dan bisnis lokal.',
};

export default async function BlogPage() {
    const blogPosts = await listPublishedBlogPosts();
    const { whatsappDefaultUrl } = getPublicSiteConfig();

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

                    <div className='flex items-center gap-3'>
                        <Link
                            href='/'
                            className='rounded-full border-2 border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                        >
                            Kembali ke Home
                        </Link>
                        <a
                            href={whatsappDefaultUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='rounded-full bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                        >
                            Konsultasi Gratis
                        </a>
                    </div>
                </div>
            </header>

            <section className='mx-auto w-full max-w-6xl px-4 py-16 md:py-20'>
                <h1 className='text-4xl font-bold leading-tight md:text-6xl'>
                    Blog BangunWebsite.id
                </h1>
                <p className='mt-4 max-w-3xl text-lg font-medium text-slate-700 md:text-xl'>
                    Semua artikel seputar website, maintenance, SEO, AI, dan
                    strategi digital untuk UMKM dan bisnis lokal.
                </p>

                <div className='mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {blogPosts.length === 0 ? (
                        <article className='rounded-[24px] border border-slate-200 bg-white p-6 text-slate-700'>
                            Belum ada artikel blog.
                        </article>
                    ) : (
                        blogPosts.map((post) => (
                            <article
                                key={post.slug}
                                className='relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-30px_rgba(2,132,199,0.45)]'
                            >
                                <p className='inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-cyan-800'>
                                    {post.categories[0] ?? 'Blog'}
                                </p>
                                <h2 className='mt-3 text-2xl font-bold leading-tight'>
                                    {post.title}
                                </h2>
                                <p className='mt-3 text-base font-medium text-slate-700'>
                                    {post.summary}
                                </p>
                                <p className='mt-4 text-sm font-semibold text-slate-500'>
                                    {new Date(post.published_at).toLocaleDateString(
                                        'id-ID',
                                        {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        }
                                    )}
                                </p>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className='mt-4 inline-flex rounded-full border border-cyan-700 px-4 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-50'
                                >
                                    Baca Artikel
                                </Link>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}
