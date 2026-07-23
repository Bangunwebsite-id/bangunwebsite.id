import Image from 'next/image';

const clientLogos = [
    { name: 'Harsyahputra', src: '/perusahaan/logo-hp.jpg', size: 'h-16', width: 56, height: 64 },
    { name: 'Lion Magazine', src: '/perusahaan/lionmag_logo.webp', size: 'h-10', width: 125, height: 40 },
    { name: 'Maju Mandiri Rentcar', src: '/perusahaan/maju-mandiri-rentcar.webp', size: 'h-16', width: 64, height: 64 },
    { name: 'Prima Event', src: '/perusahaan/primaevent.webp', size: 'h-16', width: 64, height: 64 },
    { name: 'Polda Sulsel', src: '/perusahaan/polda-sulsel.webp', size: 'h-16', width: 48, height: 64 },
    { name: 'Ryuki Indo Sakato', src: '/perusahaan/ryuki-indo-sakato.webp', size: 'h-10', width: 163, height: 40 },
    { name: 'Sapa Foundation', src: '/perusahaan/sapa-foundation.webp', size: 'h-16', width: 64, height: 64 },
    { name: 'SentulTrip', src: '/perusahaan/sentultrip.webp', size: 'h-16', width: 64, height: 64 },
    { name: 'Sulawesi Pos', src: '/perusahaan/sulawesipos.webp', size: 'h-10', width: 233, height: 40 },
    { name: 'Teknik Academy', src: '/perusahaan/teknikacademy.webp', size: 'h-10', width: 107, height: 40 },
];

export function TrustedBySection() {
    return (
        <div className='border-b border-slate-200 bg-white py-10'>
            <p className='text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-600'>
                Dipercaya oleh bisnis dari berbagai industri
            </p>
            <div className='mx-auto mt-6 w-full max-w-6xl overflow-hidden px-4'>
                <div className='marquee-track flex w-max items-center gap-10 md:gap-16'>
                    {clientLogos.map((logo) => (
                        <Image
                            key={logo.name}
                            src={logo.src}
                            alt={logo.name}
                            width={logo.width}
                            height={logo.height}
                            sizes={`${logo.width}px`}
                            quality={60}
                            style={{ width: 'auto' }}
                            className={`${logo.size} object-contain opacity-50 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0`}
                        />
                    ))}
                    {clientLogos.map((logo) => (
                        <Image
                            key={`${logo.name}-2`}
                            src={logo.src}
                            alt=''
                            aria-hidden
                            width={logo.width}
                            height={logo.height}
                            sizes={`${logo.width}px`}
                            quality={60}
                            style={{ width: 'auto' }}
                            className={`${logo.size} object-contain opacity-50 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
