import Link from 'next/link';

import { PublicBlogPost } from '@/app/lib/blogs';

export function BlogCard({ post }: { post: PublicBlogPost }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className='group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-30px_rgba(2,132,199,0.45)] transition hover:shadow-[0_22px_55px_-25px_rgba(2,132,199,0.55)]'
        >
            <p className='inline-flex self-start rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-cyan-800'>
                {post.categories[0] ?? 'Blog'}
            </p>
            <h2 className='mt-3 text-2xl font-bold leading-tight group-hover:text-cyan-700 transition-colors'>
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
            <span className='mt-4 inline-flex items-center justify-center rounded-full border border-cyan-700 px-4 py-2 text-sm font-bold text-cyan-700 transition group-hover:bg-cyan-50'>
                Baca Artikel
            </span>
        </Link>
    );
}
