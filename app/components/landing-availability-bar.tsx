type LandingAvailabilityBarProps = {
    whatsappUrl: string;
};

export function LandingAvailabilityBar({
    whatsappUrl,
}: LandingAvailabilityBarProps) {
    return (
        <div className='border-b border-amber-500/40 bg-amber-300 text-slate-950 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.8)]'>
            <div className='mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-2 px-4 py-2 text-center text-sm font-bold md:flex-row md:text-base'>
                <p>Kami hanya menerima 5 klien per bulan.</p>
                <a
                    href={whatsappUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='rounded-full bg-slate-950 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 md:text-sm'
                >
                    Konsultasikan sekarang
                </a>
            </div>
        </div>
    );
}
