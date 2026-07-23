import { LoadingLink } from '@/app/components/loading-link';

export function PublicFooter() {
    const landingPageLinks = [
        {
            href: '/maintenance-website',
            label: 'Maintenance Website',
        },
        {
            href: '/jasa-pembuatan-website',
            label: 'Jasa Pembuatan Website',
        },
        {
            href: '/maintenance-website-makassar',
            label: 'Maintenance Website Makassar',
        },
        {
            href: '/jasa-pembuatan-website-makassar',
            label: 'Jasa Pembuatan Website Makassar',
        },
    ];

    return (
        <footer className='border-t border-slate-200 bg-white py-8'>
            <div className='mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm font-medium text-slate-600 md:flex-row md:text-base'>
                <p>© {new Date().getFullYear()} BangunWebsite.id</p>
                <nav className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2'>
                    {landingPageLinks.map((link) => (
                        <LoadingLink
                            key={link.href}
                            href={link.href}
                            className='font-bold text-cyan-800 transition hover:text-cyan-700'
                        >
                            {link.label}
                        </LoadingLink>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
