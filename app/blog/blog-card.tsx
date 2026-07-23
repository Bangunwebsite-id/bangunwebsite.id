import Link from 'next/link';

import { PublicBlogPost } from '@/app/lib/blogs';

export function BlogCard({ post }: { post: PublicBlogPost }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className='group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_35px_-28px_rgba(2,132,199,0.45)] transition hover:shadow-[0_18px_45px_-24px_rgba(2,132,199,0.55)]'
        >
            <p className='inline-flex self-start rounded-full bg-cyan-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-cyan-800'>
                {post.categories[0] ?? 'Blog'}
            </p>
            <h2 className='mt-3 text-lg font-bold leading-snug transition-colors group-hover:text-cyan-700 md:text-xl'>
                {post.title}
            </h2>
            <p className='mt-2 line-clamp-3 flex-1 text-sm font-medium leading-6 text-slate-700'>
                {post.summary}
            </p>
            <p className='mt-3 text-xs font-semibold text-slate-500'>
                {new Date(post.published_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}
            </p>
            <span role='presentation' className='mt-3 inline-flex items-center justify-center rounded-full border border-cyan-700 px-3 py-1.5 text-xs font-bold text-cyan-700 transition group-hover:bg-cyan-50'>
                Baca Artikel
            </span>
        </Link>
    );
}
