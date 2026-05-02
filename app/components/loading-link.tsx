'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function LoadingLink({
    href,
    children,
    className,
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const isInternal = href.startsWith('/') && !href.startsWith('//');

    const handleClick = (e: React.MouseEvent) => {
        // Only handle internal links that are not anchors
        if (!isInternal || href.includes('#')) return;

        e.preventDefault();
        startTransition(() => {
            router.push(href);
        });
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className={`${className} ${isPending ? 'opacity-70 cursor-wait' : ''} inline-flex items-center gap-2`}
        >
            {children}
            {isPending && (
                <svg
                    className='h-4 w-4 animate-spin'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                >
                    <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                    ></circle>
                    <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                </svg>
            )}
        </Link>
    );
}
