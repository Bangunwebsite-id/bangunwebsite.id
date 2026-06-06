/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { LoadingLink } from '@/app/components/loading-link';
import {
    getPublishedBlogPostBySlug,
    listAllBlogPostSlugs,
    listRelatedBlogPosts,
} from '@/app/lib/blogs';
import { getPublicSiteConfig } from '@/app/lib/site-config';

import { BlogCard } from '../blog-card';

export const revalidate = 3600; // Cache for 1 hour

type BlogDetailProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const slugs = await listAllBlogPostSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPublishedBlogPostBySlug(slug);
    const { siteUrl } = getPublicSiteConfig();

    if (!post) {
        return {
            title: 'Artikel Tidak Ditemukan',
        };
    }

    const fullUrl = `${siteUrl}/blog/${post.slug}`;

    return {
        title: post.title,
        description: post.summary,
        alternates: {
            canonical: fullUrl,
        },
        openGraph: {
            title: post.title,
            description: post.summary,
            url: fullUrl,
            siteName: 'BangunWebsite.id',
            locale: 'id_ID',
            type: 'article',
            publishedTime: post.published_at,
            authors: [post.author],
            images: post.image ? [{ url: post.image, alt: post.title }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.summary,
            images: post.image ? [post.image] : [],
        },
    };
}

export default function BlogDetailPage({ params }: BlogDetailProps) {
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
                            href='/blog'
                            className='rounded-full border-2 border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100'
                        >
                            Semua Blog
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

            <Suspense fallback={<BlogDetailSkeleton />}>
                {params.then(({ slug }) => (
                    <BlogDetailContent slug={slug} />
                ))}
            </Suspense>
        </main>
    );
}

async function BlogDetailContent({ slug }: { slug: string }) {
    const post = await getPublishedBlogPostBySlug(slug);
    const { siteUrl } = getPublicSiteConfig();

    if (!post) {
        notFound();
    }

    const related = await listRelatedBlogPosts(post.slug, post.categories, 3);

    // Schema.org Article JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.summary,
        image: post.image ? [post.image] : [],
        datePublished: post.published_at,
        dateModified: post.published_at, // Use published_at for modification as well for now
        author: [
            {
                '@type': 'Person',
                name: post.author,
            },
        ],
        publisher: {
            '@type': 'Organization',
            name: 'BangunWebsite.id',
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/bangun-website.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/blog/${post.slug}`,
        },
    };

    return (
        <>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <section className='mx-auto w-full max-w-5xl px-4 py-12 md:py-16'>
                <div className='mb-6'>
                    <LoadingLink
                        href='/blog'
                        className='inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-cyan-700'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={2.5}
                            stroke='currentColor'
                            className='h-4 w-4'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
                            />
                        </svg>
                        Kembali ke Daftar Blog
                    </LoadingLink>
                </div>

                <div className='mx-auto max-w-3xl'>
                    <p className='inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-extrabold uppercase text-cyan-800'>
                        {post.categories[0] ?? 'Blog'}
                    </p>
                    <h1 className='mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] text-slate-950 md:text-6xl md:leading-[1.03]'>
                        {post.title}
                    </h1>
                    <div className='mt-6 h-px w-28 bg-cyan-600' />
                    <p className='mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-700 md:text-xl md:leading-9'>
                        {post.summary}
                    </p>

                    <div className='mt-6 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500'>
                        <span>
                            {new Date(post.published_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </span>
                        <span className='h-1 w-1 rounded-full bg-slate-300' />
                        <span>{post.author}</span>
                    </div>
                </div>

                {post.image && (
                    <div className='mx-auto mt-10 max-w-4xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)]'>
                        <Image
                            src={post.image}
                            alt={post.title}
                            width={1200}
                            height={630}
                            className='h-auto w-full object-cover'
                            priority
                        />
                    </div>
                )}

                <article className='mx-auto mt-12 max-w-3xl rounded-[28px] border border-slate-200 bg-white px-5 py-8 shadow-[0_22px_80px_-60px_rgba(15,23,42,0.5)] md:px-10 md:py-12'>
                    <div className='blog-article-content text-[17px] leading-8 text-slate-800 md:text-[18px] md:leading-9'>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ children }) => (
                                    <h1 className='mb-8 mt-4 border-b border-slate-200 pb-6 text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl'>
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className='mb-5 mt-12 border-l-4 border-cyan-600 pl-4 text-2xl font-extrabold leading-tight text-slate-950 md:text-3xl'>
                                        <span className='block min-w-0'>{children}</span>
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className='mb-4 mt-10 text-xl font-extrabold leading-snug text-slate-950 md:text-2xl'>
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className='my-6 max-w-none text-slate-700'>
                                        {children}
                                    </p>
                                ),
                                ul: ({ node, className, children, ...props }) => {
                                    void node;
                                    void className;

                                    return (
                                        <ul {...props} className='my-7 space-y-3 text-slate-700'>
                                            {children}
                                        </ul>
                                    );
                                },
                                ol: ({ node, className, children, ...props }) => {
                                    void node;
                                    void className;

                                    return (
                                        <ol {...props} className='my-7 space-y-3 text-slate-700'>
                                            {children}
                                        </ol>
                                    );
                                },
                                li: ({ node, className, children, ...props }) => {
                                    void node;
                                    void className;

                                    return <li {...props} className='leading-8'>{children}</li>;
                                },
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='font-bold text-cyan-700 underline decoration-cyan-300 underline-offset-4 transition hover:text-cyan-900'
                                    >
                                        {children}
                                    </a>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className='my-10 rounded-3xl border border-cyan-100 bg-cyan-50 px-6 py-5 text-lg font-semibold italic leading-8 text-slate-800 shadow-sm md:px-7 md:py-6'>
                                        <div className='mb-3 h-1 w-12 rounded-full bg-cyan-600' />
                                        <div>{children}</div>
                                    </blockquote>
                                ),
                                code: ({ children }) => (
                                    <code className='rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] font-semibold text-slate-900'>
                                        {children}
                                    </code>
                                ),
                                pre: ({ children }) => (
                                    <pre className='my-7 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-100'>
                                        {children}
                                    </pre>
                                ),
                                table: ({ children }) => (
                                    <div className='my-9 overflow-x-auto rounded-2xl border border-slate-200'>
                                        <table className='min-w-full border-collapse bg-white text-left text-sm leading-6'>
                                            {children}
                                        </table>
                                    </div>
                                ),
                                thead: ({ children }) => (
                                    <thead className='bg-slate-50 text-xs font-extrabold uppercase text-slate-600'>
                                        {children}
                                    </thead>
                                ),
                                th: ({ children }) => (
                                    <th className='border-b border-slate-200 px-4 py-3 align-top'>
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className='border-b border-slate-100 px-4 py-3 align-top text-slate-700'>
                                        {children}
                                    </td>
                                ),
                                img: ({ src, alt }) => (
                                    <img
                                        src={src ?? ''}
                                        alt={alt ?? ''}
                                        className='my-10 h-auto w-full rounded-[22px] border border-slate-200 object-contain shadow-sm'
                                        loading='lazy'
                                    />
                                ),
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </article>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 pb-16'>
                <h2 className='text-2xl font-bold md:text-3xl'>Artikel Lainnya</h2>
                <div className='mt-6 grid gap-6 md:grid-cols-3'>
                    {related.map((item) => (
                        <BlogCard key={item.slug} post={item} />
                    ))}
                </div>
            </section>
        </>
    );
}

function BlogDetailSkeleton() {
    return (
        <>
            <section className='mx-auto w-full max-w-4xl px-4 py-12 md:py-16'>
                <div className='mb-6'>
                    <div className='h-5 w-44 rounded bg-slate-200' />
                </div>

                <div className='h-6 w-24 rounded-full bg-slate-200' />
                <div className='mt-4 h-10 w-full rounded bg-slate-200 md:h-14' />
                <div className='mt-3 h-10 w-4/5 rounded bg-slate-200 md:h-12' />
                <div className='mt-5 h-6 w-full max-w-3xl rounded bg-slate-200' />
                <div className='mt-2 h-6 w-2/3 rounded bg-slate-200' />

                <div className='mt-5 flex flex-wrap items-center gap-4'>
                    <div className='h-5 w-36 rounded bg-slate-200' />
                    <div className='h-5 w-28 rounded bg-slate-200' />
                </div>

                <div className='mt-8 aspect-[1200/630] overflow-hidden rounded-2xl border border-slate-200 bg-slate-200' />

                <article className='mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
                    <div className='space-y-4'>
                        <div className='h-6 w-full rounded bg-slate-200' />
                        <div className='h-6 w-11/12 rounded bg-slate-200' />
                        <div className='h-6 w-10/12 rounded bg-slate-200' />
                        <div className='h-6 w-full rounded bg-slate-200' />
                        <div className='h-6 w-9/12 rounded bg-slate-200' />
                        <div className='h-6 w-11/12 rounded bg-slate-200' />
                    </div>
                </article>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 pb-16'>
                <div className='h-8 w-48 rounded bg-slate-200' />
                <div className='mt-6 grid gap-6 md:grid-cols-3'>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <article
                            key={index}
                            className='relative flex min-h-[250px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-30px_rgba(2,132,199,0.45)]'
                            aria-hidden='true'
                        >
                            <div className='h-6 w-24 rounded-full bg-slate-200' />
                            <div className='mt-4 h-7 w-11/12 rounded bg-slate-200' />
                            <div className='mt-3 h-5 w-full rounded bg-slate-200' />
                            <div className='mt-2 h-5 w-4/5 rounded bg-slate-200' />
                            <div className='mt-auto h-5 w-32 rounded bg-slate-200' />
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
