import type { MetadataRoute } from 'next';
import { getPublicSiteConfig } from '@/app/lib/site-config';

export default function robots(): MetadataRoute.Robots {
    const { siteUrl: baseUrl } = getPublicSiteConfig();

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
