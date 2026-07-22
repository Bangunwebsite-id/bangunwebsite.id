'use client';

import type { FormEvent } from 'react';

const PAGESPEED_ANALYSIS_URL = 'https://pagespeed.web.dev/analysis';

function normalizeWebsiteUrl(value: string) {
    const websiteUrl = value.trim();

    if (/^[a-z][a-z\d+\-.]*:\/\//i.test(websiteUrl)) {
        return websiteUrl;
    }

    return `https://${websiteUrl}`;
}

export function PageSpeedChecker() {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const website = formData.get('website');

        if (typeof website !== 'string' || !website.trim()) return;

        const targetUrl = new URL(PAGESPEED_ANALYSIS_URL);
        targetUrl.searchParams.set('url', normalizeWebsiteUrl(website));
        targetUrl.searchParams.set('form_factor', 'mobile');

        window.open(targetUrl.toString(), '_blank', 'noopener,noreferrer');
    };

    return (
        <form className='mt-7 space-y-3' onSubmit={handleSubmit}>
            <label
                htmlFor='pagespeed-website'
                className='block text-xs font-bold uppercase tracking-[0.2em] text-cyan-100'
            >
                Cek performa website
            </label>
            <div className='space-y-3'>
                <input
                    id='pagespeed-website'
                    name='website'
                    type='text'
                    inputMode='url'
                    autoCapitalize='none'
                    autoCorrect='off'
                    required
                    placeholder='domainanda.com'
                    className='min-h-12 w-full rounded-full border border-white/20 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/35'
                />
                <button
                    type='submit'
                    className='min-h-12 w-full rounded-full bg-amber-400 px-5 text-sm font-bold text-slate-900 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-slate-900'
                >
                    Cek Performa Web Anda
                </button>
            </div>
        </form>
    );
}
