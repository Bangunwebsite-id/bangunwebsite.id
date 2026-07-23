import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        qualities: [60, 75],
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
