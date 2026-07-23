import Image from 'next/image';
import Link from 'next/link';

import { LandingAvailabilityBar } from '@/app/components/landing-availability-bar';

type LandingStickyHeaderProps = {
    whatsappUrl: string;
    navItems: Array<{
        label: string;
        href: string;
    }>;
};

export function LandingStickyHeader({
    whatsappUrl,
    navItems,
}: LandingStickyHeaderProps) {
    return (
        <div className='sticky top-0 z-40'>
            <header className='border-b border-slate-200/70 bg-white/90 shadow-[0_1px_16px_rgba(15,23,42,0.06)] backdrop-blur-xl'>
                <div className='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3'>
                    <Link href='/' className='flex items-center gap-3'>
                        <Image
                            src='/bangunwebsite-logo.png'
                            alt='BangunWebsite.id'
                            width={180}
                            height={54}
                            sizes='180px'
                            className='h-11 w-auto'
                            priority
                        />
                    </Link>
                    <nav className='hidden items-center gap-6 text-sm font-semibold md:flex'>
                        {navItems.map((item) =>
                            item.href.startsWith('/') ? (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className='text-slate-700 hover:text-cyan-700'
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className='text-slate-700 hover:text-cyan-700'
                                >
                                    {item.label}
                                </a>
                            )
                        )}
                    </nav>
                    <a
                        href={whatsappUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='rounded-full bg-cyan-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-800'
                    >
                        Konsultasi
                    </a>
                </div>
            </header>

            <LandingAvailabilityBar whatsappUrl={whatsappUrl} />
        </div>
    );
}
