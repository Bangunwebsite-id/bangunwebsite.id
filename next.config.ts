import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
