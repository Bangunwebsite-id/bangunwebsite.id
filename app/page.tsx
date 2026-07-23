import Image from 'next/image';

import { LoadingLink } from '@/app/components/loading-link';
import { PageSpeedChecker } from '@/app/components/pagespeed-checker';
import { PublicFooter } from '@/app/components/public-footer';
import { ScrollReveal } from '@/app/components/scroll-reveal';
import { TrustedBySection } from '@/app/components/trusted-by-section';
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
    'Maintenance dan perbaikan ringan',
    'Update kecil sesuai paket',
    'Konsultasi via WhatsApp',
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
        featured: true,
        badge: 'Paling Direkomendasikan',
        points: [
            'Backup berkala',
            'Perbaikan bug minor',
            'Optimasi kecepatan ringan',
            'Cek tampilan mobile',
            'Cek tombol WhatsApp/form kontak',
            'SEO dasar on-page ringan',
            'Setup Google Ads & campaign awal',
            'Audit awal website',
            'Cek error dasar',
            'Monitoring dasar website',
            'Update konten ringan',
            'Setup/cek Google Analytics',
            'Setup/cek Google Search Console',
            'Konsultasi via WhatsApp',
            'Maksimal 1 request ringan per bulan',
        ],
        examplesTitle: null,
        examples: [],
    },
    {
        id: 'priority',
        name: 'Website Care Priority',
        price: 'Rp2.000.000/bulan',
        subtitle:
            'Untuk bisnis yang butuh maintenance lebih aktif, prioritas tinggi, dan request fitur semi kompleks hingga kompleks.',
        cta: 'Konsultasi Paket Priority',
        points: [
            'Semua fitur Basic',
            'Prioritas pengerjaan tertinggi',
            'Optimasi CTA, funnel, dan landing page',
            'SEO on-page lebih mendalam',
            'Maintenance & perbaikan bug teknis mendalam',
            'Support campaign/iklan digital lanjutan',
            'Maksimal 4-5 request per bulan',
            'Support intensif via WhatsApp',
            'Evaluasi & review strategi performa bulanan',
            'Integrasi tools bisnis ringan-menengah',
        ],
        examplesTitle: 'Contoh request semi kompleks - kompleks',
        examples: [
            'Tambah section/halaman baru pada landing page',
            'Form lead/contact lebih rapi dengan database',
            'Integrasi tracking/pixel & WhatsApp lanjutan',
            'Mini dashboard/admin sederhana',
            'Katalog produk/jasa sederhana',
            'Booking sederhana',
            'Perbaikan flow order/lead',
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
        name: 'Starter & Business Website',
        price: 'Mulai Rp1.000.000',
        note: 'Untuk landing page, company profile, atau halaman bisnis lebih lengkap dengan CTA jelas dan fondasi SEO.',
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
    {
        id: 10,
        title: 'Harsyahputra',
        description:
            'Website spesialis undangan pernikahan dan undangan acara dengan alur pemesanan yang jelas.',
        image: '/lovable-uploads/harsyahputra.png',
        tech: ['Next.js', 'Tailwind CSS', 'Responsive', 'SEO'],
        category: 'Wedding',
        url: 'https://harsyahputra.id',
    },
    {
        id: 11,
        title: 'Prima Event',
        description:
            'Website sewa tenda dan perlengkapan event dengan fondasi SEO, katalog layanan, dan funnel WhatsApp.',
        image: '/lovable-uploads/primaevent.id.png',
        tech: ['Next.js', 'SEO', 'WhatsApp Funnel', 'Responsive'],
        category: 'Event Rental',
        url: 'https://primaevent.id',
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

const panelBase =
    'relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_45px_-30px_rgba(2,132,199,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(2,132,199,0.5)]';

const checkColors = [
    'bg-rose-100 text-rose-700',
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
    'bg-sky-100 text-sky-700',
    'bg-violet-100 text-violet-700',
    'bg-teal-100 text-teal-700',
    'bg-fuchsia-100 text-fuchsia-700',
];

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

            <header className='sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 shadow-[0_1px_16px_rgba(15,23,42,0.06)] backdrop-blur-xl'>
                <div className='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3'>
                    <a href='#top' className='flex items-center gap-3'>
                        <Image
                            src='/bangunwebsite-logo.png'
                            alt='BangunWebsite.id'
                            width={180}
                            height={54}
                            sizes='180px'
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

                        <div className='mt-8 flex w-full flex-col gap-4 rounded-[26px] border border-white/15 bg-white/10 px-5 py-4 shadow-[0_24px_70px_-45px_rgba(14,165,233,0.65)] backdrop-blur-sm sm:max-w-2xl sm:flex-row sm:items-end sm:justify-between sm:gap-6'>
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

                        <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
                            <a
                                href={whatsappUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='w-full rounded-full bg-amber-400 px-7 py-3 text-center text-[15px] font-bold text-slate-900 transition hover:bg-amber-300 sm:w-auto sm:text-base md:text-lg'
                            >
                                Konsultasi Gratis via WhatsApp
                            </a>
                            <a
                                href='#paket'
                                className='w-full rounded-full border border-white/30 px-7 py-3 text-center text-[15px] font-bold text-white transition hover:bg-white/10 sm:w-auto sm:text-base md:text-lg'
                            >
                                Cek Paket Bulanan
                            </a>
                        </div>

                        <div className='mt-8 hidden max-w-2xl gap-3 sm:grid-cols-2 lg:grid'>
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

                    <aside className='w-full rounded-[30px] border border-white/15 bg-white/10 p-6 shadow-[0_28px_80px_-45px_rgba(14,165,233,0.7)] backdrop-blur md:p-7 lg:max-w-[24rem] lg:justify-self-end'>
                        <p className='text-sm font-bold uppercase tracking-[0.24em] text-cyan-100'>
                            Ringkasan manfaat
                        </p>
                        <h2 className='mt-3 text-xl font-bold leading-tight md:text-2xl'>
                            Website Care bulanan
                        </h2>
                        <p className='mt-4 text-sm leading-6 font-medium text-slate-200 md:text-base'>
                            Kami bantu jaga website tetap jalan, rapi, dan
                            mudah dikembangkan.
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
                        <PageSpeedChecker />
                    </aside>

                    <div className='lg:hidden -mx-4 mt-6 overflow-hidden'>
                        <div
                            className='marquee-track flex w-max items-center gap-3 px-4'
                            style={{ animationDuration: '18s' }}
                        >
                            {heroTrustBadges.map((badge) => (
                                <span
                                    key={badge}
                                    className='inline-flex items-center gap-2 whitespace-nowrap rounded-2xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-semibold text-slate-100'
                                >
                                    <span className='text-cyan-300'>✓</span>
                                    {badge}
                                </span>
                            ))}
                            {heroTrustBadges.map((badge) => (
                                <span
                                    key={`${badge}-dup`}
                                    aria-hidden
                                    className='inline-flex items-center gap-2 whitespace-nowrap rounded-2xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-semibold text-slate-100'
                                >
                                    <span className='text-cyan-300'>✓</span>
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <TrustedBySection />

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

                <div className='mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2 xl:grid-cols-4'>
                    {painPoints.map((issue, index) => (
                        <article
                            key={issue}
                            className='animate-on-scroll rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)] sm:rounded-3xl sm:p-5'
                            style={{ transitionDelay: `${index * 60}ms` }}
                        >
                            <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm'>
                                {index + 1}
                            </span>
                            <p className='mt-3 text-sm font-semibold text-slate-800 sm:mt-4 sm:text-base md:text-lg'>
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

                    <div className='mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-3'>
                        {solutionCards.map((item, index) => (
                            <article
                                key={item.title}
                                className='animate-on-scroll relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_16px_45px_-30px_rgba(2,132,199,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(2,132,199,0.5)] sm:rounded-[26px] sm:p-6'
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <h3 className='text-lg font-bold leading-tight sm:text-xl md:text-2xl'>
                                    {item.title}
                                </h3>
                                <p className='mt-3 text-sm leading-6 font-medium text-slate-700 sm:mt-4 sm:text-base sm:leading-7'>
                                    {item.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id='paket' className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <div className='animate-on-scroll max-w-4xl'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-700'>
                            Maintenance bulanan
                        </span>
                        <span className='inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-4 py-1 text-sm font-bold text-rose-700'>
                            <span className='h-1.5 w-1.5 rounded-full bg-rose-600' />
                            Hanya menerima 3 klien baru bulan ini
                        </span>
                    </div>
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

                <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                    {websiteCarePackages.map((item, index) => {
                        const visiblePoints = item.points.slice(0, 7);
                        const morePoints = item.points.slice(7);
                        const hasMore = morePoints.length > 0 || item.examples.length > 0;

                        return (
                            <article
                                key={item.id}
                                className={`animate-on-scroll relative overflow-hidden rounded-2xl border bg-white p-4 shadow-[0_12px_32px_-28px_rgba(15,23,42,0.35)] ${
                                    item.featured
                                        ? 'border-cyan-300 ring-2 ring-cyan-100'
                                        : 'border-slate-200'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {item.featured && item.badge ? (
                                    <span className='mb-2 inline-flex rounded-full bg-cyan-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-800'>
                                        {item.badge}
                                    </span>
                                ) : null}

                                <h3 className='text-base font-bold text-slate-900'>
                                    {item.name}
                                </h3>
                                <p className='mt-1.5 text-lg font-bold text-slate-900'>
                                    {item.price}
                                </p>
                                <p className='mt-2 text-xs leading-5 font-medium text-slate-600'>
                                    {item.subtitle}
                                </p>

                                <ul className='mt-4 space-y-2 text-xs font-medium text-slate-700'>
                                    {visiblePoints.map((point, i) => (
                                        <li key={point} className='flex items-start gap-2'>
                                            <span
                                                className={`mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full text-[10px] font-bold ${checkColors[i % checkColors.length]}`}
                                            >
                                                ✓
                                            </span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>

                                {hasMore ? (
                                    <details className='mt-2.5'>
                                        <summary className='cursor-pointer text-xs font-bold text-cyan-700'>
                                            Selengkapnya
                                        </summary>

                                        {morePoints.length > 0 ? (
                                            <ul className='mt-2.5 space-y-2 text-xs font-medium text-slate-700'>
                                                {morePoints.map((point, i) => (
                                                    <li key={point} className='flex items-start gap-2'>
                                                        <span
                                                            className={`mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full text-[10px] font-bold ${checkColors[(i + 7) % checkColors.length]}`}
                                                        >
                                                            ✓
                                                        </span>
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}

                                        {item.examples.length > 0 ? (
                                            <div className='mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3'>
                                                <p className='text-xs font-bold text-slate-900'>
                                                    {item.examplesTitle}
                                                </p>
                                                <ul className='mt-2 space-y-1.5 text-xs font-medium text-slate-700'>
                                                    {item.examples.map((example) => (
                                                        <li key={example} className='flex items-start gap-1.5'>
                                                            <span className='mt-0.5 text-[10px]'>-</span>
                                                            <span>{example}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}
                                    </details>
                                ) : null}

                                <a
                                    href={
                                        packageInquiryLinks[
                                            item.id as keyof typeof packageInquiryLinks
                                        ]
                                    }
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={`mt-4 inline-flex rounded-full px-4 py-2 text-xs font-bold transition ${
                                        item.featured
                                            ? 'bg-cyan-700 text-white hover:bg-cyan-800'
                                            : 'bg-slate-900 text-white hover:bg-slate-700'
                                    }`}
                                >
                                    {item.cta}
                                </a>
                            </article>
                        );
                    })}
                </div>

                <div className='animate-on-scroll mt-8 rounded-[24px] border border-amber-200 bg-amber-50 p-5'>
                    <p className='text-sm leading-6 font-medium text-amber-900 md:text-base'>
                        Paket maintenance kami juga bisa dipakai untuk tambah
                        fitur. Cukup chat kebutuhan Anda via WhatsApp, kami cek
                        scope, susun prioritas, lalu eksekusi sesuai jatah
                        request paket bulanan.
                    </p>
                    <p className='mt-3 text-sm leading-6 font-medium text-amber-900 md:text-base'>
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

                    <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                        <article className='animate-on-scroll relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_32px_-28px_rgba(15,23,42,0.35)]'>
                            <div className='absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-500 to-sky-600' />
                            <p className='text-xs font-bold uppercase tracking-widest text-cyan-700'>
                                Bulan pertama
                            </p>
                            <h3 className='mt-2 text-base font-bold text-slate-900'>
                                Audit dan Perbaikan Dasar
                            </h3>
                            <ul className='mt-4 space-y-2 text-xs font-medium text-slate-700'>
                                {firstMonthSteps.map((step) => (
                                    <li key={step} className='flex items-start gap-2'>
                                        <span className='mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-cyan-100 text-[10px] font-bold text-cyan-800'>
                                            1
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className='animate-on-scroll reveal-delay-100 relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_32px_-28px_rgba(15,23,42,0.35)]'>
                            <div className='absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500' />
                            <p className='text-xs font-bold uppercase tracking-widest text-amber-700'>
                                Bulan berikutnya
                            </p>
                            <h3 className='mt-2 text-base font-bold text-slate-900'>
                                Maintenance dan Pengembangan Ringan
                            </h3>
                            <ul className='mt-4 space-y-2 text-xs font-medium text-slate-700'>
                                {recurringMonthSteps.map((step) => (
                                    <li key={step} className='flex items-start gap-2'>
                                        <span className='mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-800'>
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

                    <div className='mt-8 grid gap-5 md:grid-cols-2'>
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

            <PublicFooter />
        </main>
    );
}
