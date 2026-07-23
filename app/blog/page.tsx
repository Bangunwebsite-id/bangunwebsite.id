import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { LoadingLink } from '@/app/components/loading-link';
import { PublicFooter } from '@/app/components/public-footer';
import { countPublishedBlogPosts, listPublishedBlogPosts } from '@/app/lib/blogs';
import {
    SITE_NAME,
    getDefaultSocialImageUrl,
    getPublicSiteConfig,
} from '@/app/lib/site-config';

import { BlogCard } from './blog-card';

export const revalidate = 3600; // Cache for 1 hour

const blogDescription =
    'Kumpulan artikel BangunWebsite.id tentang website, SEO, AI, dan strategi digital untuk UMKM dan bisnis lokal.';
const { siteUrl } = getPublicSiteConfig();
const blogUrl = `${siteUrl}/blog`;
const blogSocialImageUrl = getDefaultSocialImageUrl(siteUrl);

export const metadata: Metadata = {
    title: 'Blog',
    description: blogDescription,
    alternates: {
        canonical: blogUrl,
    },
    openGraph: {
        title: 'Blog BangunWebsite.id',
        description: blogDescription,
        url: blogUrl,
        siteName: SITE_NAME,
        images: [
            {
                url: blogSocialImageUrl,
                width: 1200,
                height: 630,
                alt: 'Blog BangunWebsite.id',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog BangunWebsite.id',
        description: blogDescription,
        images: [blogSocialImageUrl],
    },
};

type BlogPageProps = {
    searchParams: Promise<{ page?: string }>;
};

export default function BlogPage({ searchParams }: BlogPageProps) {
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
                        <LoadingLink
                            href='/'
                            className='rounded-full border-2 border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                        >
                            Kembali ke Home
                        </LoadingLink>
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

                <Suspense fallback={<BlogCardGridSkeleton />}>
                    <BlogPostGrid searchParams={searchParams} />
                </Suspense>
            </section>
            <PublicFooter />
        </main>
    );
}

async function BlogPostGrid({ searchParams }: BlogPageProps) {
    const { page } = await searchParams;
    const currentPage = Math.max(1, parseInt(page || '1', 10));
    const limit = 12;
    const offset = (currentPage - 1) * limit;

    const [blogPosts, totalPosts] = await Promise.all([
        listPublishedBlogPosts(limit, offset),
        countPublishedBlogPosts(),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    return (
        <>
                <div className='mt-10 grid gap-4 md:grid-cols-3'>
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
                            <LoadingLink
                                href={`/blog?page=${currentPage - 1}`}
                                className='rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                            >
                                Sebelumnya
                            </LoadingLink>
                        )}
                        
                        <div className='flex items-center gap-1'>
                            {[...Array(totalPages)].map((_, i) => {
                                const p = i + 1;
                                const isCurrent = p === currentPage;
                                return (
                                    <LoadingLink
                                        key={p}
                                        href={`/blog?page=${p}`}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
                                            isCurrent
                                                ? 'bg-cyan-700 text-white'
                                                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        {p}
                                    </LoadingLink>
                                );
                            })}
                        </div>

                        {currentPage < totalPages && (
                            <LoadingLink
                                href={`/blog?page=${currentPage + 1}`}
                                className='rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                            >
                                Berikutnya
                            </LoadingLink>
                        )}
                    </div>
                )}
        </>
    );
}

function BlogCardGridSkeleton() {
    return (
        <div className='mt-10 grid gap-4 md:grid-cols-3'>
            {Array.from({ length: 12 }).map((_, index) => (
                <article
                    key={index}
                    className='relative flex min-h-56 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_35px_-28px_rgba(2,132,199,0.45)]'
                    aria-hidden='true'
                >
                    <div className='h-5 w-20 rounded-full bg-slate-200' />
                    <div className='mt-4 h-6 w-11/12 rounded bg-slate-200' />
                    <div className='mt-3 h-4 w-full rounded bg-slate-200' />
                    <div className='mt-2 h-4 w-4/5 rounded bg-slate-200' />
                    <div className='mt-2 h-4 w-10/12 rounded bg-slate-200' />
                    <div className='mt-auto h-4 w-28 rounded bg-slate-200' />
                    <div className='mt-3 h-8 w-28 rounded-full border border-slate-200 bg-slate-100' />
                </article>
            ))}
        </div>
    );
}
