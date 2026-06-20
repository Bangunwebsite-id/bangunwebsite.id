import Image from 'next/image';

import { LoadingLink } from '@/app/components/loading-link';
import { ScrollReveal } from '@/app/components/scroll-reveal';
import { listHomepageBlogPosts } from '@/app/lib/blogs';
import { getPublicSiteConfig } from '@/app/lib/site-config';

export const revalidate = 3600;

const navItems = [
    { label: 'Paket', href: '#paket' },
    { label: 'Masalah', href: '#masalah' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Kontak', href: '#kontak' },
];

const heroPoints = [
    'Maintenance website rutin',
    'Perbaikan bug dan error minor',
    'Optimasi kecepatan ringan',
    'SEO dasar dan Google Analytics',
    'Bantuan setup Google Ads',
    'Maksimal 2 request ringan per bulan',
];

const localSeoTags = [
    'Jasa website Makassar',
    'Maintenance website Makassar',
    'Jasa pembuatan website UMKM',
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

const websiteCareIncludes = [
    'Audit kondisi website',
    'Perbaikan bertahap berdasarkan prioritas',
    'Maintenance ringan bulanan',
    'Backup berkala',
    'Optimasi kecepatan ringan',
    'Perbaikan error minor',
    'Update konten ringan',
    'Konsultasi IT bisnis',
    'Setup atau cek Google Analytics',
    'Setup atau cek Google Search Console',
    'SEO dasar on-page',
    'Bantuan kesiapan Google Ads',
];

const firstMonthSteps = [
    'Cek struktur website',
    'Cek error dan keamanan dasar',
    'Cek kecepatan loading',
    'Cek tampilan mobile',
    'Cek SEO dasar',
    'Pasang atau rapikan Analytics',
    'Susun prioritas perbaikan',
];

const recurringMonthSteps = [
    'Monitoring website',
    'Perbaikan bug minor',
    'Optimasi ringan berkelanjutan',
    'Update konten ringan',
    'Evaluasi performa',
    'Maksimal 2 request ringan per bulan',
];

const servicePillars = [
    {
        title: 'Developer',
        accent: 'from-cyan-500 to-sky-600',
        items: [
            'Perbaikan fitur kecil',
            'Tambah halaman atau section',
            'Rapikan form, tombol, dan CTA',
            'Integrasi ringan yang dibutuhkan bisnis',
        ],
    },
    {
        title: 'Maintenance',
        accent: 'from-amber-500 to-orange-500',
        items: [
            'Backup berkala',
            'Monitoring dasar',
            'Bug fixing minor',
            'Optimasi performa ringan',
        ],
    },
    {
        title: 'Konsultan IT',
        accent: 'from-slate-700 to-slate-900',
        items: [
            'Rekomendasi tools bisnis',
            'Arahan strategi website',
            'SEO dasar dan Analytics',
            'Persiapan untuk iklan digital',
        ],
    },
];

const fitBusinessTypes = [
    'Rental mobil',
    'Travel dan tour',
    'Klinik',
    'Sekolah dan kursus',
    'Salon dan beauty',
    'Restoran dan kafe',
    'Event organizer',
    'UMKM lokal',
    'Company profile',
    'Landing page bisnis',
];

const projectPackages = [
    {
        name: 'Starter Website',
        price: 'Mulai Rp750.000',
        note: 'Untuk bisnis yang butuh landing page atau company profile sederhana.',
    },
    {
        name: 'Business Website',
        price: 'Mulai Rp1.500.000',
        note: 'Untuk UMKM yang butuh halaman lebih lengkap, CTA jelas, dan fondasi SEO.',
    },
    {
        name: 'Custom Website/System',
        price: 'Mulai Rp3.000.000',
        note: 'Untuk alur kerja khusus seperti dashboard, booking, katalog, atau order management.',
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
];

const faqs = [
    {
        q: 'Apakah konsultasi awal berbayar?',
        a: 'Tidak. Konsultasi awal gratis via WhatsApp untuk memetakan kebutuhan dan kondisi website Anda.',
    },
    {
        q: 'Apakah paket bulanan bisa untuk website yang bukan buatan BangunWebsite.id?',
        a: 'Bisa. Kami mulai dari audit singkat agar prioritas kerja bulan pertama jelas.',
    },
    {
        q: 'Apa yang dimaksud 2 request ringan per bulan?',
        a: 'Request ringan contohnya update konten, tambah section sederhana, rapikan CTA, atau perbaikan minor. Fitur besar dihitung sebagai project terpisah.',
    },
    {
        q: 'Kalau butuh dashboard, payment gateway, atau redesign total bagaimana?',
        a: 'Kebutuhan seperti itu masuk kategori project terpisah atau upgrade scope karena effort-nya di luar maintenance ringan bulanan.',
    },
];

const panelBase =
    'relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_45px_-30px_rgba(2,132,199,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(2,132,199,0.5)]';

export default async function Home() {
    const blogPosts = await listHomepageBlogPosts();
    const {
        whatsappNumber,
        whatsappDefaultUrl: whatsappUrl,
        whatsappPortfolioUrl,
        instagramUrl,
    } = getPublicSiteConfig();

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
                className='relative overflow-hidden bg-[linear-gradient(135deg,#082f49_0%,#0f172a_52%,#7c2d12_100%)] py-20 text-white md:py-28'
            >
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(251,191,36,0.2),transparent_28%),radial-gradient(circle_at_60%_80%,rgba(14,165,233,0.16),transparent_28%)]' />
                <div className='relative mx-auto grid w-full max-w-6xl gap-10 px-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center'>
                    <div className='max-w-4xl'>
                        <p className='mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-cyan-100 sm:text-sm'>
                            Langganan website bulanan untuk UMKM dan bisnis lokal
                        </p>
                        <h1 className='text-[2.6rem] font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-7xl'>
                            Developer, Maintenance Website, dan Konsultan IT
                            dalam Satu Paket Bulanan
                        </h1>
                        <p className='mt-6 max-w-3xl text-base leading-7 text-slate-200 md:text-2xl'>
                            Website bisnis Anda kami rawat, perbaiki,
                            optimalkan, dan kembangkan bertahap setiap bulan.
                            Cocok untuk UMKM, bisnis lokal, company profile,
                            landing page, dan website yang sudah berjalan.
                        </p>

                        <div className='mt-8 flex flex-wrap items-center gap-4'>
                            <div className='rounded-[24px] border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm'>
                                <p className='text-sm font-semibold text-cyan-100'>
                                    Mulai dari
                                </p>
                                <p className='mt-1 text-3xl font-bold text-white md:text-4xl'>
                                    Rp500.000<span className='text-xl'>/bulan</span>
                                </p>
                            </div>
                            <p className='max-w-md text-sm font-medium text-slate-300 md:text-base'>
                                Satu biaya bulanan untuk developer, maintenance,
                                konsultasi IT, SEO dasar, dan optimasi website.
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

                        <div className='mt-8 flex flex-wrap gap-2'>
                            {localSeoTags.map((tag) => (
                                <span
                                    key={tag}
                                    className='rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold text-slate-200 sm:text-sm'
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <aside className='rounded-[30px] border border-white/15 bg-white/10 p-6 shadow-[0_28px_80px_-45px_rgba(14,165,233,0.7)] backdrop-blur md:p-7'>
                        <p className='text-sm font-bold uppercase tracking-[0.24em] text-cyan-100'>
                            Dalam satu paket
                        </p>
                        <h2 className='mt-3 text-2xl font-bold leading-tight md:text-3xl'>
                            Website Care Subscription
                        </h2>
                        <p className='mt-3 text-sm leading-6 font-medium text-slate-200 md:text-base'>
                            Untuk bisnis yang butuh partner teknis bulanan,
                            bukan developer sekali panggil.
                        </p>
                        <ul className='mt-6 space-y-3'>
                            {heroPoints.map((point) => (
                                <li
                                    key={point}
                                    className='flex items-start gap-3 text-sm font-medium text-white md:text-base'
                                >
                                    <span className='mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900'>
                                        ✓
                                    </span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                        <div className='mt-6 rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4 text-sm font-medium text-amber-50'>
                            Bulan pertama fokus pada audit dan perbaikan dasar.
                            Bulan berikutnya fokus pada maintenance dan
                            pengembangan ringan.
                        </div>
                    </aside>
                </div>
            </section>

            <section id='masalah' className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <div className='animate-on-scroll max-w-3xl'>
                    <span className='inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-bold text-cyan-800'>
                        Masalah yang sering terjadi
                    </span>
                    <h2 className='mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl'>
                        Website Sudah Ada, Tapi Tidak Terurus?
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-xl'>
                        Kalau masalahnya seperti ini, Anda tidak butuh developer
                        sekali panggil. Anda butuh partner teknis bulanan yang
                        bisa menjaga website tetap aktif dan terus membaik.
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

            <section id='paket' className='bg-slate-100 py-20 md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]'>
                        <div>
                            <div className='animate-on-scroll max-w-3xl'>
                                <span className='inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-700'>
                                    Paket utama
                                </span>
                                <h2 className='mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl'>
                                    Paket Website Care
                                    <span className='block text-cyan-700'>
                                        Mulai Rp500.000/Bulan
                                    </span>
                                </h2>
                                <p className='mt-4 text-base leading-7 text-slate-700 md:text-xl'>
                                    Satu biaya bulanan untuk developer,
                                    maintenance, konsultasi IT, SEO dasar, dan
                                    optimasi website.
                                </p>
                            </div>

                            <div className='mt-8 grid gap-4 sm:grid-cols-2'>
                                {websiteCareIncludes.map((item, index) => (
                                    <article
                                        key={item}
                                        className='animate-on-scroll rounded-[22px] border border-slate-200 bg-white px-5 py-4 shadow-sm'
                                        style={{
                                            transitionDelay: `${index * 45}ms`,
                                        }}
                                    >
                                        <p className='text-base font-semibold text-slate-800'>
                                            {item}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <aside className='animate-on-scroll rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.25)] md:p-8'>
                            <p className='text-sm font-bold uppercase tracking-[0.2em] text-cyan-700'>
                                Fokus utama
                            </p>
                            <h3 className='mt-3 text-3xl font-bold md:text-4xl'>
                                Website aktif dan terus berkembang
                            </h3>
                            <p className='mt-3 text-base leading-7 font-medium text-slate-700'>
                                Paket ini cocok untuk website bisnis yang sudah
                                berjalan dan perlu dirawat, dibenahi, lalu
                                dikembangkan secara bertahap.
                            </p>

                            <div className='mt-6 rounded-[24px] bg-slate-950 p-5 text-white'>
                                <p className='text-sm font-semibold text-slate-300'>
                                    Harga mulai
                                </p>
                                <p className='mt-1 text-4xl font-bold'>
                                    Rp500.000
                                </p>
                                <p className='text-base font-medium text-slate-300'>
                                    per bulan
                                </p>
                            </div>

                            <ul className='mt-6 space-y-3 text-sm font-medium text-slate-700 md:text-base'>
                                <li>- Maksimal 2 request pengembangan ringan per bulan</li>
                                <li>- Cocok untuk company profile, landing page, dan website UMKM</li>
                                <li>- Bisa untuk website lama yang butuh audit dan perbaikan</li>
                            </ul>

                            <div className='mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-5'>
                                <p className='text-sm font-bold uppercase tracking-[0.18em] text-amber-700'>
                                    Catatan penting
                                </p>
                                <p className='mt-3 text-sm leading-6 font-medium text-amber-900 md:text-base'>
                                    Fitur besar seperti sistem login, dashboard
                                    kompleks, payment gateway, aplikasi mobile,
                                    atau redesign total dihitung sebagai project
                                    terpisah atau upgrade scope.
                                </p>
                            </div>

                            <div className='mt-6 flex flex-wrap gap-3'>
                                <a
                                    href={whatsappUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='rounded-full bg-cyan-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-800 md:text-base'
                                >
                                    Diskusikan Paket Ini
                                </a>
                                <a
                                    href='#cara-kerja'
                                    className='rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100 md:text-base'
                                >
                                    Lihat Cara Kerja
                                </a>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <section id='cara-kerja' className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <div className='animate-on-scroll max-w-3xl'>
                    <span className='inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-bold text-white'>
                        Cara kerja langganan
                    </span>
                    <h2 className='mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl'>
                        Bulan Pertama Audit dan Perbaikan Dasar, Bulan
                        Berikutnya Maintenance dan Pengembangan Ringan
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-xl'>
                        Model ini membantu klien memahami kenapa bulan pertama
                        biasanya lebih padat, lalu berlanjut ke ritme maintenance
                        yang stabil.
                    </p>
                </div>

                <div className='mt-8 grid gap-6 lg:grid-cols-2'>
                    <article className={`${panelBase} animate-on-scroll`}>
                        <div className='absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-500 to-sky-600' />
                        <p className='text-sm font-bold uppercase tracking-[0.2em] text-cyan-700'>
                            Bulan pertama
                        </p>
                        <h3 className='mt-3 text-2xl font-bold md:text-3xl'>
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

                    <article className={`${panelBase} animate-on-scroll reveal-delay-100`}>
                        <div className='absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500' />
                        <p className='text-sm font-bold uppercase tracking-[0.2em] text-amber-700'>
                            Bulan berikutnya
                        </p>
                        <h3 className='mt-3 text-2xl font-bold md:text-3xl'>
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
            </section>

            <section id='layanan' className='bg-slate-100 py-20 md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='animate-on-scroll max-w-3xl'>
                        <span className='inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-bold text-cyan-800'>
                            Tiga layanan dalam satu paket
                        </span>
                        <h2 className='mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl'>
                            Bukan Cuma Jasa Website. Ini Partner Teknis Bulanan
                            Anda.
                        </h2>
                        <p className='mt-4 text-base leading-7 text-slate-700 md:text-xl'>
                            Anda tidak perlu pisahkan developer, maintenance,
                            dan konsultasi. Semua berjalan dalam satu alur kerja
                            yang lebih ringkas.
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
                                <h3 className='text-2xl font-bold md:text-3xl'>
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
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <div className='animate-on-scroll relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.25)] md:p-10'>
                    <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-100 blur-3xl' />
                    <div className='absolute -bottom-14 left-0 h-44 w-44 rounded-full bg-amber-100 blur-3xl' />
                    <div className='relative'>
                        <span className='inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-bold text-white'>
                            Cocok untuk
                        </span>
                        <h2 className='mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl'>
                            Bisnis yang Ingin Website-nya Tetap Aktif dan
                            Menghasilkan
                        </h2>
                        <p className='mt-4 max-w-3xl text-base leading-7 text-slate-700 md:text-xl'>
                            Model langganan ini paling terasa manfaatnya untuk
                            bisnis yang tidak punya tim web internal tetapi tetap
                            perlu website yang jalan terus.
                        </p>
                        <div className='mt-8 flex flex-wrap gap-3'>
                            {fitBusinessTypes.map((item, index) => (
                                <span
                                    key={item}
                                    className='animate-on-scroll rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 md:text-base'
                                    style={{ transitionDelay: `${index * 40}ms` }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id='harga' className='bg-gradient-to-r from-cyan-800 to-slate-900 py-20 text-white md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='animate-on-scroll max-w-3xl'>
                        <span className='inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-bold text-cyan-100'>
                            Project terpisah
                        </span>
                        <h2 className='mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl'>
                            Butuh Website Baru atau Fitur Besar?
                        </h2>
                        <p className='mt-4 text-base leading-7 text-slate-200 md:text-xl'>
                            Kami juga kerjakan website baru dan project custom di
                            luar paket langganan bulanan.
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
                </div>
            </section>

            <section
                id='portfolio'
                className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'
            >
                <div className='animate-on-scroll flex flex-wrap items-end justify-between gap-4'>
                    <div>
                        <h2 className='text-3xl font-bold leading-tight sm:text-4xl md:text-5xl'>
                            Portfolio
                        </h2>
                        <p className='mt-2 max-w-3xl text-base leading-7 font-medium text-slate-700 md:text-xl'>
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
                        <article
                            key={project.id}
                            className={`animate-on-scroll group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_45px_-30px_rgba(2,132,199,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(2,132,199,0.5)] ${index % 3 === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                            style={{
                                transitionDelay: `${(index % 3) * 100}ms`,
                            }}
                        >
                            <div className='relative'>
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    width={640}
                                    height={400}
                                    className='aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105'
                                />
                                <div className='absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent' />
                                <span className='absolute left-3 top-3 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-bold text-white'>
                                    {project.category}
                                </span>
                            </div>

                            <div className='space-y-4 p-5'>
                                <h3 className='text-2xl font-bold leading-tight'>
                                    {project.title}
                                </h3>
                                <p className='text-base font-medium text-slate-700'>
                                    {project.description}
                                </p>

                                <div className='flex flex-wrap gap-2'>
                                    {project.tech.map((tech) => (
                                        <span
                                            key={tech}
                                            className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700'
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <a
                                    href={project.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex w-full justify-center rounded-xl bg-cyan-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-800 md:text-base'
                                >
                                    Cek Website
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section id='blog' className='bg-slate-100 py-20 md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='animate-on-scroll flex flex-wrap items-end justify-between gap-4'>
                        <div>
                            <h2 className='text-3xl font-bold leading-tight sm:text-4xl md:text-5xl'>
                                Blog
                            </h2>
                            <p className='mt-2 text-base leading-7 font-medium text-slate-700 md:text-xl'>
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
                            <article
                                key={post.slug}
                                className={`${panelBase} animate-on-scroll`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <p className='text-xs font-bold uppercase tracking-[0.2em] text-cyan-700'>
                                    {post.categories[0] ?? 'Blog'}
                                </p>
                                <h3 className='mt-2 text-2xl font-bold leading-tight'>
                                    {post.title}
                                </h3>
                                <p className='mt-3 text-base font-medium text-slate-700'>
                                    {post.summary}
                                </p>
                                <LoadingLink
                                    href={`/blog/${post.slug}`}
                                    className='mt-4 inline-flex rounded-full border border-cyan-700 px-4 py-1.5 text-sm font-bold text-cyan-700 transition hover:bg-cyan-50'
                                >
                                    Baca Artikel
                                </LoadingLink>
                                <p className='mt-3 text-sm font-semibold text-slate-500'>
                                    {new Date(post.published_at).toLocaleDateString(
                                        'id-ID',
                                        {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        }
                                    )}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <h2 className='animate-on-scroll text-3xl font-bold leading-tight sm:text-4xl md:text-5xl'>
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
                        <h2 className='text-3xl font-bold leading-tight sm:text-4xl md:text-5xl'>
                            Siap Punya Partner Teknis Bulanan untuk Website
                            Bisnis Anda?
                        </h2>
                        <p className='mt-4 max-w-2xl text-base leading-7 font-medium text-slate-200 md:text-xl'>
                            Kirim kondisi website atau target bisnis Anda. Kami
                            bantu petakan langkah paling efisien untuk bulan
                            pertama.
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
                        <h3 className='text-2xl font-bold md:text-3xl'>
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
