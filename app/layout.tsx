import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Poppins } from 'next/font/google';
import { Suspense } from 'react';

import { FloatingWhatsapp } from './components/floating-whatsapp';
import { TrafficTracker } from './components/traffic-tracker';
import './globals.css';
import {
    DEFAULT_SITE_DESCRIPTION,
    SITE_NAME,
    getDefaultSocialImageUrl,
    getPublicSiteConfig,
} from './lib/site-config';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-poppins',
    display: 'swap',
});

const jakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
    display: 'swap',
});

const { siteUrl, whatsappDefaultUrl } = getPublicSiteConfig();
const defaultSocialImageUrl = getDefaultSocialImageUrl(siteUrl);

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default:
            'BangunWebsite.id | Langganan Developer, Maintenance Website, dan Konsultan IT',
        template: '%s | BangunWebsite.id',
    },
    description: DEFAULT_SITE_DESCRIPTION,
    alternates: {
        canonical: siteUrl,
    },
    openGraph: {
        title: 'BangunWebsite.id | Langganan Developer, Maintenance Website, dan Konsultan IT',
        description: DEFAULT_SITE_DESCRIPTION,
        url: siteUrl,
        siteName: SITE_NAME,
        images: [
            {
                url: defaultSocialImageUrl,
                width: 1200,
                height: 630,
                alt: SITE_NAME,
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BangunWebsite.id | Langganan Developer, Maintenance Website, dan Konsultan IT',
        description: DEFAULT_SITE_DESCRIPTION,
        images: [defaultSocialImageUrl],
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
        ],
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='id'
            data-scroll-behavior='smooth'
            className={`h-full antialiased ${poppins.variable} ${jakartaSans.variable}`}
        >
            <body className='min-h-full font-sans'>
                {children}
                <FloatingWhatsapp whatsappUrl={whatsappDefaultUrl} />
                <Suspense fallback={null}>
                    <TrafficTracker />
                </Suspense>
                <Analytics />
            </body>
        </html>
    );
}
