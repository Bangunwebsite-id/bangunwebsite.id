import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: '/',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'private, no-cache, no-store, max-age=0, must-revalidate',
                    },
                    {
                        key: 'CDN-Cache-Control',
                        value: 'no-store',
                    },
                    {
                        key: 'Cloudflare-CDN-Cache-Control',
                        value: 'no-store',
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.bangunwebsite.id',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
