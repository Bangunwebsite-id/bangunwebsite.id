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
        <footer className='border-t border-slate-200 bg-white py-10'>
            <div className='mx-auto flex w-full max-w-6xl flex-col gap-5 px-4'>
                <nav
                    aria-label='Link layanan BangunWebsite.id'
                    className='grid gap-2 sm:grid-cols-2 lg:grid-cols-4'
                >
                    {landingPageLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className='rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800'
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <p className='text-center text-sm font-semibold text-slate-500'>
                    © {new Date().getFullYear()} BangunWebsite.id
                </p>
            </div>
        </footer>
    );
}
