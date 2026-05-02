/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

export default async function BlogDetailPage({ params }: BlogDetailProps) {
    const { slug } = await params;
    const post = await getPublishedBlogPostBySlug(slug);
    const { whatsappDefaultUrl, siteUrl } = getPublicSiteConfig();

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
        <main className='min-h-screen bg-slate-50 text-slate-900'>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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

            <section className='mx-auto w-full max-w-4xl px-4 py-12 md:py-16'>
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

                <p className='inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-cyan-800'>
                    {post.categories[0] ?? 'Blog'}
                </p>
                <h1 className='mt-3 text-3xl font-bold leading-tight md:text-5xl'>
                    {post.title}
                </h1>
                <p className='mt-4 text-base font-medium text-slate-700 md:text-lg'>
                    {post.summary}
                </p>

                <div className='mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500'>
                    <span>
                        {new Date(post.published_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </span>
                    <span>{post.author}</span>
                </div>

                {post.image && (
                    <div className='mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white'>
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

                <article className='mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
                    <div className='space-y-4 text-base text-slate-800 md:text-lg'>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ children }) => (
                                    <h1 className='mt-8 text-3xl font-bold leading-tight md:text-4xl'>
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className='mt-8 text-2xl font-bold leading-tight md:text-3xl'>
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className='mt-6 text-xl font-bold leading-tight md:text-2xl'>
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className='mt-4 leading-relaxed text-slate-700'>
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className='mt-4 list-disc space-y-2 pl-6 text-slate-700'>
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className='mt-4 list-decimal space-y-2 pl-6 text-slate-700'>
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => <li>{children}</li>,
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='font-semibold text-cyan-700 underline underline-offset-2'
                                    >
                                        {children}
                                    </a>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className='mt-4 border-l-4 border-cyan-400 bg-cyan-50 px-4 py-2 italic text-slate-700'>
                                        {children}
                                    </blockquote>
                                ),
                                code: ({ children }) => (
                                    <code className='rounded bg-slate-100 px-1.5 py-0.5 text-sm'>
                                        {children}
                                    </code>
                                ),
                                pre: ({ children }) => (
                                    <pre className='mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100'>
                                        {children}
                                    </pre>
                                ),
                                img: ({ src, alt }) => (
                                    <img
                                        src={src ?? ''}
                                        alt={alt ?? ''}
                                        className='mt-6 rounded-xl border border-slate-200'
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
        </main>
    );
}
