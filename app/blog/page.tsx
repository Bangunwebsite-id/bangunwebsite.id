import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { countPublishedBlogPosts, listPublishedBlogPosts } from '@/app/lib/blogs';
import { getPublicSiteConfig } from '@/app/lib/site-config';

import { BlogCard } from './blog-card';

export const metadata: Metadata = {
    title: 'Blog',
    description:
        'Kumpulan artikel BangunWebsite.id tentang website, SEO, AI, dan strategi digital untuk UMKM dan bisnis lokal.',
};

type BlogPageProps = {
    searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const { page } = await searchParams;
    const currentPage = Math.max(1, parseInt(page || '1', 10));
    const limit = 12;
    const offset = (currentPage - 1) * limit;

    const [blogPosts, totalPosts] = await Promise.all([
        listPublishedBlogPosts(limit, offset),
        countPublishedBlogPosts(),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);
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
                            <BlogCard key={post.slug} post={post} />
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <div className='mt-12 flex justify-center gap-2'>
                        {currentPage > 1 && (
                            <Link
                                href={`/blog?page=${currentPage - 1}`}
                                className='rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                            >
                                Sebelumnya
                            </Link>
                        )}
                        
                        <div className='flex items-center gap-1'>
                            {[...Array(totalPages)].map((_, i) => {
                                const p = i + 1;
                                const isCurrent = p === currentPage;
                                return (
                                    <Link
                                        key={p}
                                        href={`/blog?page=${p}`}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
                                            isCurrent
                                                ? 'bg-cyan-700 text-white'
                                                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        {p}
                                    </Link>
                                );
                            })}
                        </div>

                        {currentPage < totalPages && (
                            <Link
                                href={`/blog?page=${currentPage + 1}`}
                                className='rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                            >
                                Berikutnya
                            </Link>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}
