'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { PublicBlogPost } from '@/app/lib/blogs';

export function BlogCard({ post }: { post: PublicBlogPost }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleNavigate = () => {
        startTransition(() => {
            router.push(`/blog/${post.slug}`);
        });
    };

    return (
        <article className='relative flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-30px_rgba(2,132,199,0.45)]'>
            <p className='inline-flex self-start rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-cyan-800'>
                {post.categories[0] ?? 'Blog'}
            </p>
            <h2 className='mt-3 text-2xl font-bold leading-tight'>
                {post.title}
            </h2>
            <p className='mt-3 flex-1 text-base font-medium text-slate-700'>
                {post.summary}
            </p>
            <p className='mt-4 text-sm font-semibold text-slate-500'>
                {new Date(post.published_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}
            </p>
            <button
                onClick={handleNavigate}
                disabled={isPending}
                className={`mt-4 inline-flex items-center justify-center rounded-full border border-cyan-700 px-4 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-50 ${
                    isPending ? 'cursor-wait opacity-70' : ''
                }`}
            >
                {isPending ? (
                    <span className='flex items-center gap-2'>
                        <svg
                            className='h-4 w-4 animate-spin text-cyan-700'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            ></circle>
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                        </svg>
                        Loading...
                    </span>
                ) : (
                    'Baca Artikel'
                )}
            </button>
        </article>
    );
}
