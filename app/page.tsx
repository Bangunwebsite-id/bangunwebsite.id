import Image from 'next/image';

import { LoadingLink } from '@/app/components/loading-link';
import { ScrollReveal } from '@/app/components/scroll-reveal';
import { listPublishedBlogPosts } from '@/app/lib/blogs';
import { getPublicSiteConfig } from '@/app/lib/site-config';

export const revalidate = 3600; // Cache for 1 hour (ISR) piu

const navItems = [
    { label: 'Maintenance', href: '#maintenance' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Produk', href: '#produk' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Paket', href: '#harga' },
    { label: 'Blog', href: '/blog' },
    { label: 'Kontak', href: '#kontak' },
];

const issues = [
    'Belum punya website profesional',
    'Website lama tidak terurus',
    'Website lemot atau sering error',
    'Ingin iklan tapi belum ada landing page',
    'Bingung pilih tools digital',
    'Butuh booking, katalog, order, atau invoice',
    'Ingin bisnis terlihat lebih dipercaya',
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

const websitePackages = [
    {
        name: 'Starter Website',
        price: 'Mulai Rp750.000',
        note: 'Untuk bisnis baru yang butuh landing cepat.',
    },
    {
        name: 'Business Website',
        price: 'Mulai Rp1.500.000',
        note: 'Untuk UMKM yang butuh fitur lebih lengkap.',
    },
    {
        name: 'Custom Website/System',
        price: 'Mulai Rp3.000.000',
        note: 'Untuk kebutuhan alur kerja dan fitur khusus.',
    },
];

const maintenancePackages = [
    {
        name: 'Maintenance Basic',
        price: 'Mulai Rp150.000/bulan',
        points: [
            'Backup berkala',
            'Update konten ringan',
            'Update plugin/theme',
            'Support WhatsApp',
        ],
    },
    {
        name: 'Maintenance Pro',
        price: 'Mulai Rp300.000-Rp500.000/bulan',
        points: [
            'Semua fitur Basic',
            'Optimasi kecepatan ringan',
            'Perbaikan bug minor',
            'Laporan bulanan',
        ],
    },
    {
        name: 'Perbaikan Sekali Jalan',
        price: 'Mulai Rp250.000/kasus',
        points: [
            'Website error / gagal login',
            'Form tidak jalan',
            'Masalah hosting, SSL, domain',
            'Perbaikan tampilan',
        ],
    },
];

const consultationPackages = [
    {
        name: 'Konsultasi Singkat',
        price: 'Rp100.000-Rp250.000/sesi',
        detail: 'Diskusi 30-60 menit untuk arah langkah awal.',
    },
    {
        name: 'Audit Digital Bisnis',
        price: 'Mulai Rp500.000',
        detail: 'Audit kondisi saat ini + prioritas implementasi.',
    },
    {
        name: 'Pendampingan Implementasi',
        price: 'Mulai Rp1.000.000+',
        detail: 'Pendampingan sampai solusi berjalan.',
    },
];

const processSteps = [
    {
        title: 'Konsultasi',
        description:
            'Kita tentukan target bisnis dan kebutuhan paling prioritas.',
    },
    {
        title: 'Rencana Kerja',
        description:
            'Kami siapkan scope, timeline, dan estimasi biaya yang jelas.',
    },
    {
        title: 'Eksekusi',
        description:
            'Implementasi, testing, dan evaluasi hasil secara terukur.',
    },
];

const faqs = [
    {
        q: 'Apakah konsultasi awal berbayar?',
        a: 'Tidak. Konsultasi awal gratis via WhatsApp.',
    },
    {
        q: 'Bisa maintenance website yang bukan buatan BangunWebsite.id?',
        a: 'Bisa. Kami audit singkat dulu lalu susun prioritas perbaikan.',
    },
    {
        q: 'Apakah harga paket sudah final?',
        a: 'Belum. Harga di halaman ini adalah harga mulai.',
    },
    {
        q: 'Apakah bisa minta fitur booking atau dashboard?',
        a: 'Bisa. Ini masuk kategori custom website/system.',
    },
];

const panelBase =
    'relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_45px_-30px_rgba(2,132,199,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(2,132,199,0.5)]';

export default async function Home() {
    const blogPosts = await listPublishedBlogPosts(3);
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
                <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3'>
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

                    <nav className='hidden items-center gap-7 text-base font-semibold md:flex'>
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
                className='relative overflow-hidden bg-gradient-to-br from-cyan-950 via-slate-900 to-amber-900 py-24 text-white md:py-28'
            >
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.25),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(251,191,36,0.2),transparent_35%)]' />
                <div className='relative mx-auto w-full max-w-6xl px-4'>
                    <div className='max-w-4xl'>
                        <p className='animate-on-scroll mb-5 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-semibold text-cyan-100 md:text-base'>
                            Solusi Website & Konsultasi Digital untuk UMKM dan
                            Bisnis Lokal
                        </p>
                        <h1 className='animate-on-scroll reveal-delay-100 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl'>
                            Website Anda Masih Jalan? Atau Cuma Ada?
                        </h1>
                        <p className='animate-on-scroll reveal-delay-200 mt-6 max-w-3xl text-lg text-slate-200 md:text-2xl'>
                            Banyak bisnis punya website tapi tidak terawat —
                            lemot, error, dan tidak menghasilkan. Kami bantu
                            perbaiki, rawat, dan kembangkan.
                        </p>
                        <div className='animate-on-scroll reveal-delay-300 mt-9 flex flex-wrap gap-3'>
                            <a
                                href={whatsappUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-full bg-amber-400 px-7 py-3 text-base font-bold text-slate-900 transition hover:bg-amber-300 md:text-lg'
                            >
                                Konsultasi Sekarang via WhatsApp
                            </a>
                            <a
                                href='#maintenance'
                                className='rounded-full border border-white/40 px-7 py-3 text-base font-bold text-white transition hover:bg-white/10 md:text-lg'
                            >
                                Cek Layanan Maintenance
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <div className='animate-on-scroll rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.25)] md:p-10'>
                    <h2 className='text-4xl font-bold leading-tight md:text-5xl'>
                        Masalah yang Sering Terjadi di Website Bisnis
                    </h2>
                    <div className='mt-8 grid gap-4 md:grid-cols-2'>
                        {issues.map((issue, index) => (
                            <div
                                key={issue}
                                className='animate-on-scroll flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-semibold text-slate-800 md:text-lg'
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <span className='inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white'>
                                    {index + 1}
                                </span>
                                {issue}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Maintenance — Section Utama */}
            <section id='maintenance' className='bg-slate-100 py-20 md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='animate-on-scroll max-w-3xl'>
                        <span className='inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-700'>
                            Layanan Unggulan
                        </span>
                        <h2 className='mt-3 text-4xl font-bold leading-tight md:text-5xl'>
                            Maintenance Website
                        </h2>
                        <p className='mt-4 text-lg font-medium text-slate-700 md:text-xl'>
                            Website yang tidak dirawat akan lambat, rentan
                            diretas, dan ditinggal pengunjung. Kami jaga website
                            Anda tetap sehat, cepat, dan aman setiap bulan.
                        </p>
                    </div>

                    <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        {[
                            {
                                title: 'Keamanan Website',
                                desc: 'Cek celah keamanan, pastikan SSL aktif, dan lindungi dari akses tidak sah.',
                            },
                            {
                                title: 'Optimasi Kecepatan',
                                desc: 'Kompres gambar, aktifkan cache, dan pastikan loading cepat di semua perangkat.',
                            },
                            {
                                title: 'Update Plugin & Theme',
                                desc: 'Semua komponen website selalu versi terbaru agar tidak ada celah bug.',
                            },
                            {
                                title: 'Backup Berkala',
                                desc: 'Data website dicadangkan rutin sehingga bisa dipulihkan kapan pun dibutuhkan.',
                            },
                            {
                                title: 'Perbaikan Error',
                                desc: 'Formulir tidak jalan, halaman error, atau tampilan rusak — langsung ditangani.',
                            },
                            {
                                title: 'Laporan Bulanan',
                                desc: 'Anda terima laporan kondisi website setiap bulan, transparan dan mudah dipahami.',
                            },
                        ].map((item, idx) => (
                            <article
                                key={item.title}
                                className={`${panelBase} animate-on-scroll`}
                                style={{ transitionDelay: `${idx * 80}ms` }}
                            >
                                <div className='absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500' />
                                <h3 className='text-lg font-bold md:text-xl'>
                                    {item.title}
                                </h3>
                                <p className='mt-2 text-sm font-medium text-slate-700 md:text-base'>
                                    {item.desc}
                                </p>
                            </article>
                        ))}
                    </div>

                    <div className='animate-on-scroll mt-10 flex flex-wrap gap-3'>
                        <a
                            href={whatsappUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='rounded-full bg-amber-500 px-7 py-3 text-base font-bold text-white transition hover:bg-amber-600 md:text-lg'
                        >
                            Konsultasi Maintenance Sekarang
                        </a>
                        <a
                            href='#harga'
                            className='rounded-full border-2 border-slate-900 px-7 py-3 text-base font-bold text-slate-900 transition hover:bg-slate-100 md:text-lg'
                        >
                            Lihat Paket
                        </a>
                    </div>
                </div>
            </section>

            {/* Mid-page CTA */}
            <section className='bg-gradient-to-r from-cyan-800 to-slate-900 py-14 md:py-16'>
                <div className='mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 text-center md:flex-row md:justify-between md:text-left'>
                    <div className='animate-on-scroll'>
                        <h2 className='text-3xl font-bold text-white md:text-4xl'>
                            Tidak Tahu Kondisi Website Anda?
                        </h2>
                        <p className='mt-2 text-base font-medium text-slate-300 md:text-lg'>
                            Konsultasikan sekarang — gratis, tanpa komitmen.
                        </p>
                    </div>
                    <a
                        href={whatsappUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='animate-on-scroll flex-none rounded-full bg-amber-400 px-8 py-3.5 text-base font-bold text-slate-900 transition hover:bg-amber-300 md:text-lg'
                    >
                        Konsultasi Sekarang
                    </a>
                </div>
            </section>

            {/* Layanan Lainnya */}
            <section id='layanan' className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <div className='animate-on-scroll max-w-2xl'>
                    <h2 className='text-4xl font-bold leading-tight md:text-5xl'>
                        Layanan Lainnya
                    </h2>
                    <p className='mt-3 text-lg text-slate-700 md:text-xl'>
                        Butuh website baru atau arahan strategi digital? Kami
                        juga siap bantu.
                    </p>
                </div>
                <div className='mt-8 grid gap-6 md:grid-cols-2'>
                    <article className={`${panelBase} animate-on-scroll`}>
                        <div className='absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-600 to-blue-600' />
                        <span className='text-sm font-bold tracking-[0.2em] text-slate-500'>
                            01
                        </span>
                        <h3 className='mt-3 text-2xl font-bold leading-tight md:text-3xl'>
                            Pembuatan Website
                        </h3>
                        <p className='mt-3 text-base font-medium text-slate-700 md:text-lg'>
                            Website baru yang rapi, cepat, dan siap jualan.
                            Company profile, landing page, toko online, hingga
                            sistem custom.
                        </p>
                        <ul className='mt-4 space-y-1.5 text-sm font-medium text-slate-600 md:text-base'>
                            {[
                                'Company profile',
                                'Landing page promosi',
                                'Toko online sederhana',
                                'Website custom system',
                            ].map((p) => (
                                <li key={p}>- {p}</li>
                            ))}
                        </ul>
                        <a
                            href={whatsappUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 md:text-base'
                        >
                            Diskusi Kebutuhan Website
                        </a>
                    </article>

                    <article className={`${panelBase} animate-on-scroll reveal-delay-100`}>
                        <div className='absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-slate-700 to-slate-900' />
                        <span className='text-sm font-bold tracking-[0.2em] text-slate-500'>
                            02
                        </span>
                        <h3 className='mt-3 text-2xl font-bold leading-tight md:text-3xl'>
                            Konsultasi IT
                        </h3>
                        <p className='mt-3 text-base font-medium text-slate-700 md:text-lg'>
                            Arah digital yang jelas sebelum eksekusi biaya
                            besar. Audit kebutuhan, rekomendasi tools, dan
                            pendampingan implementasi.
                        </p>
                        <ul className='mt-4 space-y-1.5 text-sm font-medium text-slate-600 md:text-base'>
                            {[
                                'Pemetaan kebutuhan website/sistem',
                                'Rekomendasi tools bisnis',
                                'Integrasi WhatsApp, form, CRM',
                                'Pendampingan hosting/domain',
                            ].map((p) => (
                                <li key={p}>- {p}</li>
                            ))}
                        </ul>
                        <a
                            href={whatsappUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 md:text-base'
                        >
                            Konsultasi Kebutuhan IT
                        </a>
                    </article>
                </div>
            </section>

            <section id='produk' className='bg-slate-100 py-20 md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='animate-on-scroll relative overflow-hidden rounded-[32px] border border-amber-200 bg-gradient-to-r from-amber-100 via-white to-cyan-100 p-8 shadow-[0_24px_70px_-35px_rgba(245,158,11,0.45)] md:p-10'>
                        <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-300/40 blur-2xl' />
                        <p className='relative text-sm font-bold uppercase tracking-[0.2em] text-cyan-800'>
                            Produk Khusus
                        </p>
                        <h2 className='relative mt-2 text-4xl font-bold leading-tight md:text-5xl'>
                            Website Rental Event
                        </h2>
                        <p className='relative mt-4 max-w-3xl text-lg font-medium text-slate-700 md:text-xl'>
                            Untuk bisnis rental event yang butuh katalog,
                            booking, jadwal sewa, invoice, dan dashboard order.
                        </p>
                        <div className='relative mt-6 flex flex-wrap items-center gap-3'>
                            <span className='rounded-full bg-amber-500 px-4 py-1.5 text-sm font-bold text-white'>
                                Segera Hadir
                            </span>
                            <a
                                href={whatsappUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 md:text-base'
                            >
                                Daftar Early Access
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id='portfolio'
                className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'
            >
                <div className='animate-on-scroll flex flex-wrap items-end justify-between gap-4'>
                    <div>
                        <h2 className='text-4xl font-bold leading-tight md:text-5xl'>
                            Portfolio
                        </h2>
                        <p className='mt-2 max-w-3xl text-lg font-medium text-slate-700 md:text-xl'>
                            Project real yang sudah online dan dipakai klien.
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

            <section id='harga' className='bg-slate-100 py-20 md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <h2 className='animate-on-scroll text-4xl font-bold leading-tight md:text-5xl'>
                        Paket Layanan
                    </h2>

                    <div className='mt-10'>
                        <h3 className='animate-on-scroll text-3xl font-bold md:text-4xl'>
                            Paket Website Baru
                        </h3>
                        <div className='mt-5 grid gap-4 md:grid-cols-3'>
                            {websitePackages.map((item, idx) => (
                                <article
                                    key={item.name}
                                    className={`animate-on-scroll relative overflow-hidden rounded-3xl border p-6 shadow-sm ${idx === 1 ? 'border-cyan-300 bg-cyan-700 text-white' : 'border-slate-200 bg-white'}`}
                                    style={{
                                        transitionDelay: `${idx * 100}ms`,
                                    }}
                                >
                                    {idx === 1 && (
                                        <span className='mb-4 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold'>
                                            Paling Populer
                                        </span>
                                    )}
                                    <h4 className='text-2xl font-bold'>
                                        {item.name}
                                    </h4>
                                    <p
                                        className={`mt-3 text-base font-medium ${idx === 1 ? 'text-cyan-50' : 'text-slate-700'}`}
                                    >
                                        {item.note}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className='mt-12'>
                        <h3 className='animate-on-scroll text-3xl font-bold md:text-4xl'>
                            Paket Maintenance
                        </h3>
                        <div className='mt-5 grid gap-4 md:grid-cols-3'>
                            {maintenancePackages.map((item, index) => (
                                <article
                                    key={item.name}
                                    className={`${panelBase} animate-on-scroll`}
                                    style={{
                                        transitionDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <h4 className='text-2xl font-bold'>
                                        {item.name}
                                    </h4>
                                    <ul className='mt-4 space-y-2 text-base font-medium text-slate-700'>
                                        {item.points.map((point) => (
                                            <li key={point}>- {point}</li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                        <p className='mt-4 text-base font-medium text-slate-600'>
                            Harga final menyesuaikan tingkat kerusakan dan
                            teknologi website.
                        </p>
                    </div>

                    <div className='mt-12'>
                        <h3 className='animate-on-scroll text-3xl font-bold md:text-4xl'>
                            Paket Konsultasi IT
                        </h3>
                        <div className='mt-5 grid gap-4 md:grid-cols-3'>
                            {consultationPackages.map((item, index) => (
                                <article
                                    key={item.name}
                                    className={`${panelBase} animate-on-scroll`}
                                    style={{
                                        transitionDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <h4 className='text-2xl font-bold'>
                                        {item.name}
                                    </h4>
                                    <p className='mt-3 text-base font-medium text-slate-700'>
                                        {item.detail}
                                    </p>
                                </article>
                            ))}
                        </div>
                        <p className='mt-4 text-base font-medium text-slate-700'>
                            Konsultasi awal gratis via WhatsApp.
                        </p>
                    </div>
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <h2 className='animate-on-scroll text-4xl font-bold leading-tight md:text-5xl'>
                    Proses Kerja
                </h2>
                <div className='mt-8 grid gap-6 md:grid-cols-3'>
                    {processSteps.map((step, idx) => (
                        <article
                            key={step.title}
                            className={`${panelBase} animate-on-scroll`}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            <p className='text-sm font-bold uppercase tracking-[0.2em] text-cyan-700'>
                                Langkah {idx + 1}
                            </p>
                            <h3 className='mt-2 text-2xl font-bold md:text-3xl'>
                                {step.title}
                            </h3>
                            <p className='mt-3 text-base font-medium text-slate-700 md:text-lg'>
                                {step.description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section id='blog' className='bg-slate-100 py-20 md:py-24'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='animate-on-scroll flex flex-wrap items-end justify-between gap-4'>
                        <div>
                            <h2 className='text-4xl font-bold leading-tight md:text-5xl'>
                                Blog
                            </h2>
                            <p className='mt-2 text-lg font-medium text-slate-700 md:text-xl'>
                                3 artikel terbaru. Untuk semua artikel, buka
                                halaman blog.
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
                                    {new Date(
                                        post.published_at,
                                    ).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 py-20 md:py-24'>
                <h2 className='animate-on-scroll text-4xl font-bold leading-tight md:text-5xl'>
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
                        <h2 className='text-4xl font-bold leading-tight md:text-5xl'>
                            Siap Bangun atau Rapikan Website Anda?
                        </h2>
                        <p className='mt-4 max-w-2xl text-lg font-medium text-slate-200 md:text-xl'>
                            Kirim kebutuhan Anda, kami bantu petakan langkah
                            paling efisien.
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
