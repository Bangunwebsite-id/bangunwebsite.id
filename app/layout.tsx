import type { Metadata } from 'next';
import { Suspense } from 'react';

import { TrafficTracker } from './components/traffic-tracker';
import './globals.css';

export const metadata: Metadata = {
    title: {
        default:
            'BangunWebsite.id | Jasa Website, Maintenance, dan Konsultasi IT',
        template: '%s | BangunWebsite.id',
    },
    description:
        'BangunWebsite.id membantu UMKM dan bisnis lokal melalui pembuatan website, maintenance website, dan konsultasi IT yang terarah.',
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
        <html lang='id' className='h-full antialiased'>
            <body className='min-h-full'>
                {children}
                <Suspense fallback={null}>
                    <TrafficTracker />
                </Suspense>
            </body>
        </html>
    );
}
