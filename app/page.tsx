import Image from 'next/image';

import { LoadingLink } from '@/app/components/loading-link';
import { ScrollReveal } from '@/app/components/scroll-reveal';
import { listHomepageBlogPosts } from '@/app/lib/blogs';
import { getPublicSiteConfig } from '@/app/lib/site-config';

export const revalidate = 3600;

const navItems = [
    { label: 'Masalah', href: '#masalah' },
    { label: 'Solusi', href: '#solusi' },
    { label: 'Paket', href: '#paket' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Kontak', href: '#kontak' },
];

const heroTrustBadges = [
    'Gratis konsultasi awal',
    'Bisa untuk website lama',
    'Support via WhatsApp',
    'Berbasis Makassar, melayani Indonesia',
];

const heroSummaryPoints = [
    'Maintenance, bug fixing, dan optimasi ringan bulanan',
    'Request kecil bulanan sesuai paket tanpa buka project besar',
    'Konsultasi teknis dan support via WhatsApp yang lebih praktis',
];

const painPoints = [
    'Website lambat dibuka',
    'Form WhatsApp atau contact tidak jalan',
    'Tampilan rusak di HP',
    'Tidak tahu performa website',
    'Tidak muncul di Google',
    'Mau tambah fitur tapi tidak punya developer',
    'Bingung mulai SEO atau iklan',
    'Website ada, tapi tidak pernah dioptimalkan',
];

const solutionCards = [
    {
        title: 'Rawat website yang sudah berjalan',
        description:
            'Website tidak cukup hanya online. Ia perlu dicek, dirapikan, dan dijaga supaya tetap aman, aktif, dan nyaman dipakai calon klien.',
    },
    {
        title: 'Perbaiki masalah yang ganggu konversi',
        description:
            'Bug minor, form yang tidak masuk, CTA yang kurang jelas, atau tampilan mobile yang berantakan kami tangani sebagai bagian dari ritme kerja bulanan.',
    },
    {
        title: 'Optimalkan dan kembangkan bertahap',
        description:
            'Mulai dari optimasi ringan, SEO dasar, Analytics, sampai request kecil sesuai paket tanpa harus buka project besar setiap saat.',
    },
];

const websiteCarePackages = [
    {
        id: 'basic',
        name: 'Website Care Basic',
        price: 'Rp500.000/bulan',
        subtitle:
            'Untuk website bisnis yang butuh dirawat rutin, tetap aman, rapi, dan aktif.',
        cta: 'Konsultasi Paket Basic',
        points: [
            'Audit awal website',
            'Backup berkala',
            'Cek error dasar',
            'Monitoring dasar website',
            'Update konten ringan',
            'Perbaikan bug minor',
            'Optimasi kecepatan ringan',
            'Cek tampilan mobile',
            'Cek tombol WhatsApp/form kontak',
            'SEO dasar on-page ringan',
            'Setup/cek Google Analytics',
            'Setup/cek Google Search Console',
            'Konsultasi via WhatsApp',
            'Maksimal 1 request ringan per bulan',
        ],
        examplesTitle: null,
        examples: [],
    },
    {
        id: 'growth',
        name: 'Website Care Growth',
        price: 'Rp1.000.000/bulan',
        subtitle:
            'Untuk bisnis yang butuh maintenance lebih aktif, prioritas normal, dan request fitur semi kompleks.',
        cta: 'Konsultasi Paket Growth',
        featured: true,
        badge: 'Paling Direkomendasikan',
        points: [
            'Semua fitur Basic',
            'Prioritas pengerjaan lebih cepat',
            'Evaluasi performa bulanan',
            'Optimasi CTA/form WhatsApp',
            'Optimasi landing page ringan',
            'SEO on-page lebih mendalam',
            'Bantuan kesiapan Google Ads',
            'Perbaikan bug lebih teknis',
            'Request fitur semi kompleks',
            'Maksimal 2-3 request per bulan',
        ],
        examplesTitle: 'Contoh request semi kompleks',
        examples: [
            'Tambah section landing page',
            'Buat halaman baru sederhana',
            'Form lead/contact lebih rapi',
            'Integrasi tracking/pixel ringan',
            'Perbaikan layout mobile',
            'Penyesuaian CTA untuk campaign',
        ],
    },
    {
        id: 'priority',
        name: 'Website Care Priority',
        price: 'Rp2.000.000/bulan',
        subtitle:
            'Untuk bisnis yang butuh prioritas tinggi, optimasi lebih serius, dan request fitur kompleks bertahap.',
        cta: 'Konsultasi Paket Priority',
        points: [
            'Semua fitur Growth',
            'Prioritas pengerjaan tertinggi',
            'Support lebih intensif via WhatsApp',
            'Review strategi website bulanan',
            'Optimasi funnel/landing page',
            'Support campaign/iklan digital',
            'Pengembangan fitur kompleks bertahap',
            'Integrasi tools bisnis ringan-menengah',
            'Maintenance teknis lebih mendalam',
            'Maksimal 4-5 request per bulan',
        ],
        examplesTitle: 'Contoh request kompleks',
        examples: [
            'Mini dashboard/admin sederhana',
            'Katalog produk/jasa sederhana',
            'Sistem form dengan database',
            'Integrasi WhatsApp/tracking lebih lanjut',
            'Booking sederhana',
            'Perbaikan flow order/lead',
            'Landing page campaign lebih lengkap',
        ],
    },
];

const firstMonthSteps = [
    'Audit kondisi website dan struktur halaman',
    'Cek error dasar, form, dan CTA utama',
    'Cek tampilan mobile dan kecepatan dasar',
    'Cek SEO dasar serta kesiapan tracking',
    'Rapikan prioritas kerja bulan pertama',
];

const recurringMonthSteps = [
    'Maintenance rutin dan monitoring website',
    'Perbaikan bug minor serta error kecil',
    'Update konten ringan bila dibutuhkan',
    'Optimasi ringan untuk performa dan CTA',
    'Request ringan sesuai paket bulanan',
];

const servicePillars = [
    {
        title: 'Developer',
        accent: 'from-cyan-500 to-sky-600',
        items: [
            'Perbaikan fitur kecil',
            'Tambah halaman',
            'Rapikan form, tombol, dan CTA',
            'Integrasi ringan',
        ],
    },
    {
        title: 'Maintenance',
        accent: 'from-amber-500 to-orange-500',
        items: [
            'Backup',
            'Update',
            'Monitoring',
            'Bug fixing',
            'Optimasi ringan',
        ],
    },
    {
        title: 'Konsultan IT',
        accent: 'from-slate-700 to-slate-900',
        items: [
            'Rekomendasi tools',
            'Strategi website',
            'SEO dasar',
            'Analytics',
            'Persiapan iklan digital',
        ],
    },
];

const projectPackages = [
    {
        name: 'Starter Website',
        price: 'Mulai Rp750.000',
        note: 'Untuk landing page atau company profile sederhana.',
    },
    {
        name: 'Business Website',
        price: 'Mulai Rp1.500.000',
        note: 'Untuk UMKM yang butuh halaman lebih lengkap, CTA jelas, dan fondasi SEO.',
    },
    {
        name: 'Custom Website/System',
        price: 'Mulai Rp3.500.000',
        note: 'Untuk dashboard, booking system, katalog, order management, payment gateway, atau sistem khusus.',
    },
];

const portfolioProjects = [
    {
        id: 1,
        title: 'Rental Mobil Makassar',
        description:
            'Website promosi rental mobil dengan fokus trust dan lead cepat.',
        image: '/lovable-uploads/77e2b1a3-1f70-45c9-b30b-0944cdbafab4.png',
        tech: ['Next.js', 'React.js', 'Responsive', 'SEO'],
        category: 'Corporate',
        url: 'https://www.rentalmobilmakassar.co.id',
    },
    {
        id: 2,
        title: 'Teknik Academy',
        description:
            'Platform e-course teknik untuk akuisisi siswa dan penjualan kelas.',
        image: '/lovable-uploads/6740e6ed-df81-4708-b579-9613605b29b3.png',
        tech: ['Next.js', 'React.js', 'Responsive', 'SEO'],
        category: 'Education',
        url: 'https://teknikacademy.id',
    },
    {
        id: 3,
        title: 'Lion Magazine',
        description:
            'Portal media berita dan e-magazine dengan struktur konten rapi.',
        image: '/lovable-uploads/lionmag.png',
        tech: ['CodeIgniter', 'MySQL', 'Responsive', 'SEO'],
        category: 'Media',
        url: 'https://lionmag.id/',
    },
    {
        id: 4,
        title: 'Zero Carbon Run',
        description:
            'Website event dengan alur registrasi, pembayaran, dan tiket digital.',
        image: '/lovable-uploads/zero-carbon.png',
        tech: ['Next.js', 'PostgreSQL', 'SEO', 'Server Opt'],
        category: 'Event',
        url: 'https://www.zerocarbonrun.com/',
    },
    {
        id: 5,
        title: 'Simulasi Tes Psikologi Polda Sulsel',
        description:
            'Sistem simulasi tes dengan dashboard admin dan manajemen soal.',
        image: '/lovable-uploads/psikologi-polda.png',
        tech: ['React.js', 'Express.js', 'AWS', 'Server Opt'],
        category: 'Government',
        url: 'https://psikologipoldasulsel.com/login',
    },
    {
        id: 6,
        title: 'MALLF Salon',
        description:
            'Company profile salon dengan konten harga yang mudah diupdate.',
        image: '/lovable-uploads/mallf.png',
        tech: ['CMS', 'Admin Dashboard', 'Responsive', 'SEO'],
        category: 'Beauty',
        url: 'https://mallf.vercel.app/',
    },
    {
        id: 7,
        title: 'Ryuki Indo Sakato',
        description:
            'Company profile brand otomotif dengan fondasi katalog produk.',
        image: '/lovable-uploads/ryuki.png',
        tech: ['Next.js', 'Vercel', 'SEO'],
        category: 'Automotive',
        url: 'https://ryuki-amber.vercel.app/',
    },
    {
        id: 8,
        title: 'Sapa Foundation',
        description:
            'Website yayasan sosial dengan struktur konten yang jelas untuk membangun kepercayaan donatur dan mitra.',
        image: '/lovable-uploads/sapa-foundation.webp',
        tech: ['Next.js', 'Responsive', 'SEO'],
        category: 'Social',
        url: 'https://www.sapafoundation.or.id/',
    },
    {
        id: 9,
        title: 'SentulTrip',
        description:
            'Landing page wisata trekking dan offroad Sentul dengan struktur paket yang jelas dan CTA booking cepat.',
        image: '/lovable-uploads/sentultrip.png',
        tech: ['Next.js', 'Landing Page', 'Responsive', 'SEO'],
        category: 'Travel',
        url: 'https://sentultrip.id/',
    },
];

const faqs = [
    {
        q: 'Apakah konsultasi awal berbayar?',
        a: 'Tidak. Konsultasi awal gratis via WhatsApp untuk memetakan kebutuhan website dan paket yang paling cocok.',
    },
    {
        q: 'Apakah Paket Website Care bisa untuk website yang bukan buatan BangunWebsite.id?',
        a: 'Bisa. Paket ini memang cocok untuk website lama yang sudah berjalan dan butuh dirawat, diperbaiki, atau dioptimalkan.',
    },
    {
        q: 'Apa yang dimaksud request ringan di paket bulanan?',
        a: 'Request ringan mencakup update konten, penambahan section sederhana, rapikan CTA, atau perbaikan minor. Jatah request mengikuti paket: Basic 1, Growth 2-3, dan Priority 4-5 request ringan per bulan.',
    },
    {
        q: 'Kapan kebutuhan masuk project terpisah?',
        a: 'Fitur besar seperti dashboard, sistem login, payment gateway, booking system, redesign total, atau sistem custom dihitung sebagai project terpisah di luar maintenance bulanan.',
    },
];

const clientLogos = [
    { name: 'Lion Magazine', src: '/perusahaan/lionmag_logo.webp', size: 'h-10' },
    { name: 'Maju Mandiri Rentcar', src: '/perusahaan/maju-mandiri-rentcar.webp', size: 'h-16' },
    { name: 'Polda Sulsel', src: '/perusahaan/polda-sulsel.webp', size: 'h-16' },
    { name: 'Ryuki Indo Sakato', src: '/perusahaan/ryuki-indo-sakato.webp', size: 'h-10' },
    { name: 'Sapa Foundation', src: '/perusahaan/sapa-foundation.webp', size: 'h-16' },
    { name: 'SentulTrip', src: '/perusahaan/sentultrip.webp', size: 'h-16' },
    { name: 'Sulawesi Pos', src: '/perusahaan/sulawesipos.webp', size: 'h-10' },
    { name: 'Teknik Academy', src: '/perusahaan/teknikacademy.webp', size: 'h-10' },
];

const panelBase =
    'relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_45px_-30px_rgba(2,132,199,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(2,132,199,0.5)]';

function createWhatsappLink(number: string, text: string) {
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export default async function Home() {
    const blogPosts = await listHomepageBlogPosts();
    const {
        whatsappNumber,
        whatsappDefaultUrl: whatsappUrl,
        whatsappPortfolioUrl,
        instagramUrl,
    } = getPublicSiteConfig();

    const packageInquiryLinks = {
        basic: createWhatsappLink(
            whatsappNumber,
            'Halo BangunWebsite.id, saya ingin konsultasi tentang paket Website Care Basic.'
        ),
        growth: createWhatsappLink(
            whatsappNumber,
            'Halo BangunWebsite.id, saya ingin konsultasi tentang paket Website Care Growth.'
        ),
        priority: createWhatsappLink(
            whatsappNumber,
            'Halo BangunWebsite.id, saya ingin konsultasi tentang paket Website Care Priority.'
        ),
    };

    const projectInquiryUrl = createWhatsappLink(
        whatsappNumber,
        'Halo BangunWebsite.id, saya ingin diskusi tentang project website baru atau fitur besar.'
    );

    return (
        <main className='min-h-screen bg-slate-50 text-slate-900'>
            <ScrollReveal />

            <header className='sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur'>
                <div className='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3'>
                    <a href='#top' className='flex items-center gap-3'>
                        <Image
                            src='/bangun-website.png'
                            alt='BangunWebsite.id'
                            width={170}
                            height={44}
                            className='h-11 w-auto'
                            priority
                        />
                    </a>

                    <nav className='hidden items-center gap-6 text-sm font-semibold md:flex lg:text-base'>
                        {navItems.map((item) => (
                            <LoadingLink
                                key={item.label}
                                href={item.href}
                                className='text-slate-700 transition hover:text-cyan-700'
                            >
                                {item.label}
                            </LoadingLink>
                        ))}
                    </nav>

                    <a
                        href={whatsappUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='rounded-full bg-cyan-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-800'
                    >
                        Konsultasi Gratis
                    </a>
                </div>
            </header>

            <section
                id='top'
                className='relative overflow-hidden bg-[linear-gradient(135deg,#082f49_0%,#0f172a_58%,#7c2d12_100%)] py-20 text-white md:py-28'
            >
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_82%_22%,rgba(251,191,36,0.16),transparent_30%),radial-gradient(circle_at_60%_82%,rgba(14,165,233,0.14),transparent_28%)]' />
                <div className='relative mx-auto grid w-full max-w-6xl gap-10 px-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-center'>
                    <div className='max-w-4xl'>
                        <p className='mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-cyan-100 sm:text-sm'>
                            Langganan website bulanan untuk bisnis yang butuh
                            partner teknis
                        </p>
                        <h1 className='text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl'>
                            Developer, Maintenance Website, dan Konsultan IT
                            dalam Satu Paket Bulanan
                        </h1>
                        <p className='mt-6 max-w-3xl text-base leading-7 text-slate-200 md:text-lg'>
                            Website bisnis Anda kami rawat, perbaiki,
                            optimalkan, dan kembangkan bertahap setiap bulan.
                            Cocok untuk UMKM, bisnis lokal, company profile,
                            landing page, dan website yang sudah berjalan.
                        </p>

                        <div className='mt-8 inline-flex max-w-2xl flex-col gap-4 rounded-[26px] border border-white/15 bg-white/10 px-5 py-4 shadow-[0_24px_70px_-45px_rgba(14,165,233,0.65)] backdrop-blur-sm sm:flex-row sm:items-end sm:justify-between sm:gap-6'>
                            <div>
                                <p className='text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100'>
                                    Mulai
                                </p>
                                <p className='mt-2 whitespace-nowrap text-2xl font-bold leading-none tracking-tight text-white sm:text-3xl'>
                                    Rp500.000
                                    <span className='text-[0.52em] font-semibold tracking-normal text-cyan-100'>
                                        /bulan
                                    </span>
                                </p>
                            </div>
                            <p className='max-w-sm text-sm leading-6 font-medium text-slate-200 md:text-base'>
                                Entry offer untuk website lama yang butuh
                                dirawat, diperbaiki, dan dioptimalkan secara
                                rutin.
                            </p>
                        </div>

                        <div className='mt-8 flex flex-wrap gap-3'>
                            <a
                                href={whatsappUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-full bg-amber-400 px-7 py-3 text-[15px] font-bold text-slate-900 transition hover:bg-amber-300 sm:text-base md:text-lg'
                            >
                                Konsultasi Gratis via WhatsApp
                            </a>
                            <a
                                href='#paket'
                                className='rounded-full border border-white/30 px-7 py-3 text-[15px] font-bold text-white transition hover:bg-white/10 sm:text-base md:text-lg'
                            >
                                Cek Paket Bulanan
                            </a>
                        </div>

                        <div className='mt-8 grid max-w-2xl gap-3 sm:grid-cols-2'>
                            {heroTrustBadges.map((badge) => (
                                <span
                                    key={badge}
                                    className='rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-semibold text-slate-100'
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <aside className='w-full max-w-[24rem] rounded-[30px] border border-white/15 bg-white/10 p-6 shadow-[0_28px_80px_-45px_rgba(14,165,233,0.7)] backdrop-blur md:p-7 lg:justify-self-end'>
                        <p className='text-sm font-bold uppercase tracking-[0.24em] text-cyan-100'>
                            Ringkasan manfaat
                        </p>
                        <h2 className='mt-3 text-xl font-bold leading-tight md:text-2xl'>
                            Website Care untuk bisnis yang butuh partner teknis
                            rutin
                        </h2>
                        <p className='mt-4 text-sm leading-6 font-medium text-slate-200 md:text-base'>
                            Bukan vendor sekali panggil. Satu ritme kerja untuk
                            menjaga website tetap sehat, rapi, dan terus
                            membaik.
                        </p>
                        <ul className='mt-6 space-y-3 text-sm font-medium text-white md:text-base'>
                            {heroSummaryPoints.map((point) => (
                                <li key={point} className='flex items-start gap-3'>
                                    <span className='mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900'>
                                        ✓
                                    </span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </section>

            <div className='border-b border-slate-200 bg-white py-10'>
                <p className='text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400'>
                    Dipercaya oleh bisnis dari berbagai industri
                </p>
                <div className='mx-auto mt-6 w-full max-w-6xl overflow-hidden px-4'>
                    <div className='marquee-track flex w-max items-center gap-10 md:gap-16'>
                        {clientLogos.map((logo) => (
                            <Image
                                key={logo.name}
                                src={logo.src}
                                alt={logo.name}
                                width={120}
                                height={48}
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
                                width={120}
                                height={48}
                                style={{ width: 'auto' }}
                                className={`${logo.size} object-contain opacity-50 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <section
                id='masalah'
                className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'
            >
                <div className='animate-on-scroll max-w-3xl'>
                    <span className='inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-bold text-cyan-800'>
                        Problem website bisnis
                    </span>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Website Sudah Ada, Tapi Tidak Terurus?
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                        Kalau masalahnya seperti ini, Anda tidak butuh
                        developer sekali panggil. Anda butuh partner teknis
                        bulanan yang bisa menjaga website tetap aktif dan terus
                        membaik.
                    </p>
                </div>

                <div className='mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                    {painPoints.map((issue, index) => (
                        <article
                            key={issue}
                            className='animate-on-scroll rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)]'
                            style={{ transitionDelay: `${index * 60}ms` }}
                        >
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white'>
                                {index + 1}
                            </span>
                            <p className='mt-4 text-base font-semibold text-slate-800 md:text-lg'>
                                {issue}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section id='solusi' className='bg-slate-100 py-20 md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='animate-on-scroll max-w-3xl'>
                        <span className='inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-bold text-white'>
                            Solusi bulanan
                        </span>
                        <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Ini yang Kami Bantu Setiap Bulan
                        </h2>
                        <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                            Bukan cuma maintenance pas error. Kami bantu
                            website bisnis tetap sehat, rapi, dan makin siap
                            dipakai untuk marketing dari bulan ke bulan.
                        </p>
                    </div>

                    <div className='mt-8 grid gap-6 md:grid-cols-3'>
                        {solutionCards.map((item, index) => (
                            <article
                                key={item.title}
                                className={`${panelBase} animate-on-scroll`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <h3 className='text-xl font-bold leading-tight md:text-2xl'>
                                    {item.title}
                                </h3>
                                <p className='mt-4 text-base leading-7 font-medium text-slate-700'>
                                    {item.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id='paket' className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <div className='animate-on-scroll max-w-4xl'>
                    <span className='inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-700'>
                        Maintenance bulanan
                    </span>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Paket Website Care Bulanan
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                        Pilih paket maintenance website sesuai kebutuhan
                        bisnis Anda. Cocok untuk website yang sudah berjalan dan
                        butuh dirawat, diperbaiki, dioptimalkan, serta
                        dikembangkan bertahap setiap bulan.
                    </p>
                </div>

                <div className='mt-8 grid gap-6 lg:grid-cols-3'>
                    {websiteCarePackages.map((item, index) => (
                        <article
                            key={item.id}
                            className={`animate-on-scroll relative overflow-hidden rounded-[28px] border p-6 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)] ${
                                item.featured
                                    ? 'border-cyan-300 bg-cyan-700 text-white'
                                    : 'border-slate-200 bg-white text-slate-900'
                            }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {item.featured && item.badge ? (
                                <span className='mb-4 inline-flex rounded-full bg-white/18 px-3 py-1 text-xs font-bold tracking-[0.14em] uppercase'>
                                    {item.badge}
                                </span>
                            ) : null}

                            <h3 className='text-xl font-bold md:text-2xl'>
                                {item.name}
                            </h3>
                            <p className='mt-3 text-2xl font-bold md:text-3xl'>
                                {item.price}
                            </p>
                            <p
                                className={`mt-4 text-base leading-7 font-medium ${
                                    item.featured ? 'text-cyan-50' : 'text-slate-700'
                                }`}
                            >
                                {item.subtitle}
                            </p>

                            <ul
                                className={`mt-6 space-y-3 text-sm font-medium md:text-base ${
                                    item.featured ? 'text-white' : 'text-slate-700'
                                }`}
                            >
                                {item.points.map((point) => (
                                    <li key={point} className='flex items-start gap-3'>
                                        <span
                                            className={`mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-bold ${
                                                item.featured
                                                    ? 'bg-white text-cyan-700'
                                                    : 'bg-cyan-100 text-cyan-800'
                                            }`}
                                        >
                                            ✓
                                        </span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>

                            {item.examples.length > 0 ? (
                                <div
                                    className={`mt-6 rounded-2xl border p-4 ${
                                        item.featured
                                            ? 'border-white/18 bg-white/10'
                                            : 'border-slate-200 bg-slate-50'
                                    }`}
                                >
                                    <p
                                        className={`text-sm font-bold ${
                                            item.featured
                                                ? 'text-white'
                                                : 'text-slate-900'
                                        }`}
                                    >
                                        {item.examplesTitle}
                                    </p>
                                    <ul
                                        className={`mt-3 space-y-2 text-sm font-medium ${
                                            item.featured
                                                ? 'text-cyan-50'
                                                : 'text-slate-700'
                                        }`}
                                    >
                                        {item.examples.map((example) => (
                                            <li key={example} className='flex items-start gap-2'>
                                                <span className='mt-0.5 text-xs'>-</span>
                                                <span>{example}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            <a
                                href={
                                    packageInquiryLinks[
                                        item.id as keyof typeof packageInquiryLinks
                                    ]
                                }
                                target='_blank'
                                rel='noopener noreferrer'
                                className={`mt-7 inline-flex rounded-full px-5 py-3 text-sm font-bold transition md:text-base ${
                                    item.featured
                                        ? 'bg-white text-cyan-700 hover:bg-cyan-50'
                                        : 'bg-slate-900 text-white hover:bg-slate-700'
                                }`}
                            >
                                {item.cta}
                            </a>
                        </article>
                    ))}
                </div>

                <div className='animate-on-scroll mt-8 rounded-[24px] border border-amber-200 bg-amber-50 p-5'>
                    <p className='text-sm leading-6 font-medium text-amber-900 md:text-base'>
                        Request fitur semi kompleks dan kompleks tetap
                        dikerjakan bertahap sesuai scope bulanan. Fitur besar
                        seperti sistem login penuh, payment gateway, aplikasi
                        mobile, dashboard kompleks, atau redesign total tetap
                        dihitung sebagai project terpisah.
                    </p>
                </div>
            </section>

            <section
                id='cara-kerja'
                className='bg-slate-100 py-20 md:py-24'
            >
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='animate-on-scroll max-w-3xl'>
                        <span className='inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-bold text-white'>
                            Cara kerja bulanan
                        </span>
                        <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Bulan Pertama Audit dan Perbaikan Dasar, Bulan
                            Berikutnya Maintenance dan Pengembangan Ringan
                        </h2>
                        <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                            Klien jadi paham bahwa bulan pertama fokus merapikan
                            fondasi, lalu bulan berikutnya lanjut ke maintenance
                            rutin dan request kecil sesuai paket.
                        </p>
                    </div>

                    <div className='mt-8 grid gap-6 lg:grid-cols-2'>
                        <article className={`${panelBase} animate-on-scroll`}>
                            <div className='absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-500 to-sky-600' />
                            <p className='text-sm font-bold uppercase tracking-[0.2em] text-cyan-700'>
                                Bulan pertama
                            </p>
                            <h3 className='mt-3 text-xl font-bold md:text-2xl'>
                                Audit dan Perbaikan Dasar
                            </h3>
                            <ul className='mt-5 space-y-3 text-sm font-medium text-slate-700 md:text-base'>
                                {firstMonthSteps.map((step) => (
                                    <li key={step} className='flex items-start gap-3'>
                                        <span className='mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-800'>
                                            1
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article
                            className={`${panelBase} animate-on-scroll reveal-delay-100`}
                        >
                            <div className='absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500' />
                            <p className='text-sm font-bold uppercase tracking-[0.2em] text-amber-700'>
                                Bulan berikutnya
                            </p>
                            <h3 className='mt-3 text-xl font-bold md:text-2xl'>
                                Maintenance dan Pengembangan Ringan
                            </h3>
                            <ul className='mt-5 space-y-3 text-sm font-medium text-slate-700 md:text-base'>
                                {recurringMonthSteps.map((step) => (
                                    <li key={step} className='flex items-start gap-3'>
                                        <span className='mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800'>
                                            2
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </div>
                </div>
            </section>

            <section id='layanan' className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <div className='animate-on-scroll max-w-3xl'>
                    <span className='inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-bold text-cyan-800'>
                        Tiga layanan dalam satu paket
                    </span>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Developer, Maintenance, dan Konsultan IT Berjalan dalam
                        Satu Ritme Kerja
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                        Anda tidak perlu pecah vendor untuk hal-hal kecil.
                        Semua kebutuhan teknis ringan dikelola dalam satu alur
                        yang lebih jelas.
                    </p>
                </div>

                <div className='mt-8 grid gap-6 lg:grid-cols-3'>
                    {servicePillars.map((pillar, index) => (
                        <article
                            key={pillar.title}
                            className={`${panelBase} animate-on-scroll`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div
                                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${pillar.accent}`}
                            />
                            <h3 className='text-xl font-bold md:text-2xl'>
                                {pillar.title}
                            </h3>
                            <ul className='mt-5 space-y-3 text-sm font-medium text-slate-700 md:text-base'>
                                {pillar.items.map((item) => (
                                    <li key={item}>- {item}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section id='harga' className='bg-gradient-to-r from-cyan-800 to-slate-900 py-20 text-white md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='animate-on-scroll max-w-4xl'>
                        <span className='inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-bold text-cyan-100'>
                            Project sekali bayar
                        </span>
                        <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Butuh Website Baru atau Fitur Besar?
                        </h2>
                        <p className='mt-4 text-base leading-7 text-slate-200 md:text-lg'>
                            Untuk bisnis yang belum punya website, ingin membuat
                            website baru, atau membutuhkan fitur besar di luar
                            paket maintenance bulanan.
                        </p>
                    </div>

                    <div className='mt-8 grid gap-5 md:grid-cols-3'>
                        {projectPackages.map((item, index) => (
                            <article
                                key={item.name}
                                className='animate-on-scroll rounded-[26px] border border-white/15 bg-white/10 p-6 backdrop-blur'
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <p className='text-sm font-bold uppercase tracking-[0.18em] text-cyan-100'>
                                    {item.price}
                                </p>
                                <h3 className='mt-3 text-2xl font-bold'>
                                    {item.name}
                                </h3>
                                <p className='mt-3 text-base font-medium text-slate-200'>
                                    {item.note}
                                </p>
                            </article>
                        ))}
                    </div>

                    <div className='animate-on-scroll mt-8'>
                        <a
                            href={projectInquiryUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex rounded-full bg-amber-400 px-7 py-3 text-base font-bold text-slate-900 transition hover:bg-amber-300 md:text-lg'
                        >
                            Diskusikan Project Website Baru
                        </a>
                    </div>
                </div>
            </section>

            <section
                id='portfolio'
                className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'
            >
                <div className='animate-on-scroll flex flex-wrap items-end justify-between gap-4'>
                    <div>
                        <h2 className='text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Portfolio
                        </h2>
                        <p className='mt-2 max-w-3xl text-base leading-7 font-medium text-slate-700 md:text-lg'>
                            Project real untuk company profile, event, media,
                            edukasi, dan bisnis lokal.
                        </p>
                    </div>
                    <a
                        href={whatsappPortfolioUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='rounded-full border-2 border-cyan-700 px-5 py-2.5 text-sm font-bold text-cyan-700 transition hover:bg-cyan-50 md:text-base'
                    >
                        Konsultasi Setelah Lihat Portfolio
                    </a>
                </div>

                <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {portfolioProjects.map((project, index) => (
                        <a
                            key={project.id}
                            href={project.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className={`animate-on-scroll group relative block overflow-hidden rounded-[24px] shadow-[0_18px_45px_-30px_rgba(2,132,199,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(2,132,199,0.5)] ${
                                index % 3 === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                            }`}
                            style={{ transitionDelay: `${(index % 3) * 100}ms` }}
                        >
                            <Image
                                src={project.image}
                                alt={project.title}
                                width={640}
                                height={400}
                                className='aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105'
                            />

                            <span className='absolute left-3 top-3 z-10 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-bold text-white'>
                                {project.category}
                            </span>

                            {/* Default: gradient + title at bottom */}
                            <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-5 pt-16 transition-opacity duration-300 group-hover:opacity-0'>
                                <h3 className='text-lg font-bold leading-tight text-white'>
                                    {project.title}
                                </h3>
                            </div>

                            {/* Hover: panel slides up */}
                            <div className='absolute inset-x-0 bottom-0 translate-y-full bg-slate-900/96 p-5 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0'>
                                <p className='text-xs font-bold uppercase tracking-[0.15em] text-cyan-400'>
                                    {project.category}
                                </p>
                                <h3 className='mt-1 text-xl font-bold leading-tight text-white'>
                                    {project.title}
                                </h3>
                                <p className='mt-2 text-sm leading-relaxed text-slate-300'>
                                    {project.description}
                                </p>
                                <div className='mt-3 flex flex-wrap gap-1.5'>
                                    {project.tech.map((tech) => (
                                        <span
                                            key={tech}
                                            className='rounded-full border border-white/20 px-2.5 py-0.5 text-xs font-bold text-slate-200'
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <span className='mt-4 inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white'>
                                    Cek Website
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            <section id='blog' className='bg-slate-100 py-20 md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='animate-on-scroll flex flex-wrap items-end justify-between gap-4'>
                        <div>
                            <h2 className='text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                                Blog
                            </h2>
                            <p className='mt-2 text-base leading-7 font-medium text-slate-700 md:text-lg'>
                                Insight praktis seputar website, maintenance,
                                SEO dasar, dan digital growth untuk bisnis.
                            </p>
                        </div>
                        <LoadingLink
                            href='/blog'
                            className='rounded-full border-2 border-cyan-700 px-5 py-2.5 text-sm font-bold text-cyan-700 transition hover:bg-cyan-50 md:text-base'
                        >
                            Lihat Semua Blog
                        </LoadingLink>
                    </div>

                    <div className='mt-8 grid gap-6 md:grid-cols-3'>
                        {blogPosts.slice(0, 3).map((post, index) => (
                            <LoadingLink
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className={`group flex flex-col ${panelBase} animate-on-scroll`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <p className='inline-flex self-start rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-cyan-800'>
                                    {post.categories[0] ?? 'Blog'}
                                </p>
                                <h3 className='mt-3 text-2xl font-bold leading-tight transition-colors group-hover:text-cyan-700'>
                                    {post.title}
                                </h3>
                                <p className='mt-3 flex-1 text-base font-medium text-slate-700'>
                                    {post.summary}
                                </p>
                                <p className='mt-4 text-sm font-semibold text-slate-500'>
                                    {new Date(post.published_at).toLocaleDateString(
                                        'id-ID',
                                        {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        }
                                    )}
                                </p>
                                <span className='mt-4 inline-flex items-center justify-center rounded-full border border-cyan-700 px-4 py-2 text-sm font-bold text-cyan-700 transition group-hover:bg-cyan-50'>
                                    Baca Artikel
                                </span>
                            </LoadingLink>
                        ))}
                    </div>
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <h2 className='animate-on-scroll text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                    FAQ
                </h2>
                <div className='mt-8 space-y-4'>
                    {faqs.map((faq, index) => (
                        <details
                            key={faq.q}
                            className='animate-on-scroll rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <summary className='cursor-pointer text-lg font-bold md:text-xl'>
                                {faq.q}
                            </summary>
                            <p className='mt-3 text-base font-medium text-slate-700 md:text-lg'>
                                {faq.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            <section
                id='kontak'
                className='bg-gradient-to-r from-cyan-800 to-slate-900 py-20 text-white md:py-24'
            >
                <div className='mx-auto grid w-full max-w-6xl gap-8 px-4 lg:grid-cols-2'>
                    <div className='animate-on-scroll'>
                        <h2 className='text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Siap Diskusi Tentang Website Care atau Project Baru?
                        </h2>
                        <p className='mt-4 max-w-2xl text-base leading-7 font-medium text-slate-200 md:text-lg'>
                            Kirim kondisi website atau kebutuhan bisnis Anda.
                            Kami bantu petakan apakah lebih cocok maintenance
                            bulanan atau project sekali bayar.
                        </p>
                        <a
                            href={whatsappUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mt-7 inline-flex rounded-full bg-amber-400 px-7 py-3 text-base font-bold text-slate-900 transition hover:bg-amber-300 md:text-lg'
                        >
                            Konsultasi Gratis via WhatsApp
                        </a>
                    </div>

                    <div className='animate-on-scroll reveal-delay-200 rounded-[24px] border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
                        <h3 className='text-xl font-bold md:text-2xl'>
                            Kontak
                        </h3>
                        <ul className='mt-4 space-y-3 text-base font-medium text-slate-100 md:text-lg'>
                            <li>
                                WhatsApp:{' '}
                                <a
                                    className='font-bold underline'
                                    href={`https://wa.me/${whatsappNumber}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    +62 821-5192-8443
                                </a>
                            </li>
                            <li>
                                Instagram:{' '}
                                <a
                                    className='font-bold underline'
                                    href={instagramUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    @bangunwebsite_id
                                </a>
                            </li>
                            <li>Jam support: Senin - Minggu, 08:00 - 18:00</li>
                        </ul>
                    </div>
                </div>
            </section>

            <footer className='border-t border-slate-200 bg-white py-8'>
                <div className='mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm font-medium text-slate-600 md:flex-row md:text-base'>
                    <p>© {new Date().getFullYear()} BangunWebsite.id</p>
                    <p>
                        WhatsApp Support:{' '}
                        <a
                            href={`https://wa.me/${whatsappNumber}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-bold text-cyan-800'
                        >
                            +62 821-5192-8443
                        </a>
                    </p>
                </div>
            </footer>
        </main>
    );
}
