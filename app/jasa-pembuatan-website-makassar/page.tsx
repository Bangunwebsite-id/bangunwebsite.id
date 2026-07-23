import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { LandingAvailabilityBar } from '@/app/components/landing-availability-bar';
import { PublicFooter } from '@/app/components/public-footer';
import { TrustedBySection } from '@/app/components/trusted-by-section';
import {
    SITE_NAME,
    getDefaultSocialImageUrl,
    getPublicSiteConfig,
} from '@/app/lib/site-config';

export const revalidate = 3600;

const { siteUrl } = getPublicSiteConfig();
const pageUrl = `${siteUrl}/jasa-pembuatan-website-makassar`;
const socialImageUrl = getDefaultSocialImageUrl(siteUrl);

const pageTitle = 'Jasa Pembuatan Website Makassar';
const pageDescription =
    'Jasa pembuatan website Makassar untuk bisnis lokal yang butuh landing page, company profile, katalog, dan sistem web sesuai kebutuhan, CTA, dan fondasi SEO.';

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    alternates: {
        canonical: pageUrl,
    },
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: pageUrl,
        siteName: SITE_NAME,
        images: [
            {
                url: socialImageUrl,
                width: 1200,
                height: 630,
                alt: 'Jasa Pembuatan Website Makassar',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription,
        images: [socialImageUrl],
    },
};

const heroPoints = [
    'Funnel WhatsApp untuk pelanggan lokal',
    'Konten layanan yang mudah dipahami dari HP',
    'Struktur trust untuk bisnis sekitar Makassar',
    'Fondasi SEO lokal dan tracking dasar',
];

const heroBriefRows = [
    {
        label: 'Output',
        value: 'Website bisnis Makassar siap online',
    },
    {
        label: 'Mulai',
        value: 'Rp1.000.000',
    },
    {
        label: 'Fokus',
        value: 'Lead WhatsApp dari pencarian lokal',
    },
    {
        label: 'Lanjut',
        value: 'Bisa maintenance bulanan',
    },
];

const businessFitPoints = [
    {
        title: 'Riset kebutuhan dulu',
        body: 'Kami lihat jenis bisnis, area layanan, cara calon pelanggan bertanya, dan offer utama sebelum menentukan struktur website.',
    },
    {
        title: 'WhatsApp-first untuk bisnis lokal',
        body: 'Banyak pelanggan lokal ingin tanya cepat. Karena itu CTA, urutan konten, paket, dan tombol chat dibuat mudah ditemukan dari layar HP.',
    },
    {
        title: 'Area layanan ikut diperjelas',
        body: 'Jika bisnis melayani Panakkukang, Pettarani, Tamalanrea, Gowa, atau Maros, informasi area dibuat natural di halaman, bukan sekadar daftar kota.',
    },
];

const makassarBusinessTypes = [
    'Rental mobil bandara, travel, tour, dan transportasi harian',
    'Klinik, dental care, salon, barbershop, dan beauty service area kota',
    'Cafe, restoran, catering, oleh-oleh, dan kuliner yang butuh menu online',
    'Sekolah, kampus, kursus, pelatihan, dan komunitas edukasi lokal',
    'Event organizer, venue, hotel, homestay, dan wisata sekitar Sulsel',
    'Kontraktor, interior, jasa profesional, toko, dan katalog produk lokal',
];

const makassarFunnelExamples = [
    {
        title: 'Rental mobil dan travel',
        body: 'Pengunjung diarahkan melihat armada, area jemput, paket, syarat sewa, lalu chat WhatsApp untuk tanya ketersediaan.',
    },
    {
        title: 'Klinik, salon, dan jasa appointment',
        body: 'Halaman menonjolkan layanan, jadwal, lokasi, foto tempat, testimoni, dan tombol booking atau tanya jadwal.',
    },
    {
        title: 'Kuliner, toko, dan katalog produk',
        body: 'Menu, paket, varian, foto produk, harga mulai, dan tombol order dibuat mudah discan dari HP sebelum pelanggan chat.',
    },
];

const makassarAreas = [
    'Panakkukang',
    'Pettarani',
    'Tamalanrea',
    'Biringkanaya',
    'Daya',
    'Mariso',
    'Losari',
    'Gowa',
    'Maros',
];

const websiteTypes = [
    {
        title: 'Landing Page Campaign',
        body: 'Untuk promosi produk, jasa, event, iklan lokal Makassar, atau validasi offer dengan satu tujuan konversi yang jelas.',
    },
    {
        title: 'Company Profile',
        body: 'Untuk bisnis lokal yang perlu menampilkan profil, layanan, portfolio, lokasi, legalitas, dan kontak yang meyakinkan.',
    },
    {
        title: 'Katalog Produk atau Jasa',
        body: 'Untuk menampilkan produk, paket, menu, pricelist, atau layanan agar pelanggan lokal bisa tanya/order lewat WhatsApp.',
    },
    {
        title: 'Custom Website atau System',
        body: 'Untuk booking sederhana, registrasi event, order flow, dashboard admin, atau sistem internal bisnis yang mulai bertumbuh.',
    },
];

const packages = [
    {
        name: 'Starter & Business Website',
        price: 'Mulai Rp1.000.000',
        fit: 'Untuk landing page, company profile, atau website bisnis sederhana yang butuh cepat online.',
        points: [
            'Struktur halaman sesuai kebutuhan bisnis',
            'Desain responsif desktop dan mobile',
            'CTA WhatsApp atau form kontak',
            'Copy dasar untuk bagian utama',
            'Setup metadata SEO dasar',
            'Deploy website sampai online',
        ],
        featured: true,
    },
    {
        name: 'Custom Website/System',
        price: 'Mulai Rp3.500.000',
        fit: 'Untuk website dengan fitur khusus, data, dashboard, booking, katalog, atau alur bisnis tertentu.',
        points: [
            'Scope fitur disusun dari kebutuhan bisnis',
            'Dashboard/admin sederhana bila dibutuhkan',
            'Integrasi form, database, atau tools bisnis',
            'Struktur halaman dan flow lebih lengkap',
            'Testing fitur inti sebelum live',
            'Opsional lanjut ke maintenance bulanan',
        ],
    },
];

const processSteps = [
    {
        title: 'Diskusi kebutuhan',
        body: 'Kami pahami jenis bisnis, area layanan, kebiasaan calon pelanggan bertanya, dan tujuan utama website.',
    },
    {
        title: 'Susun struktur',
        body: 'Kami rapikan urutan informasi lokal: layanan, area, bukti kerja, paket, lokasi, dan CTA WhatsApp.',
    },
    {
        title: 'Desain dan development',
        body: 'Website dibangun responsif agar nyaman dibuka calon pelanggan dari HP sebelum mereka chat atau datang ke lokasi.',
    },
    {
        title: 'Launch dan arahan lanjut',
        body: 'Setelah online, kami bantu cek tampilan, CTA, tracking dasar, dan opsi maintenance untuk update promo atau layanan.',
    },
];

const portfolioProjects = [
    {
        title: 'Rental Mobil Makassar',
        note: 'Website promosi lokal dengan fokus trust dan lead WhatsApp cepat.',
        image: '/lovable-uploads/77e2b1a3-1f70-45c9-b30b-0944cdbafab4.png',
    },
    {
        title: 'SentulTrip',
        note: 'Landing page wisata dengan struktur paket dan CTA booking yang jelas.',
        image: '/lovable-uploads/sentultrip.png',
    },
    {
        title: 'Zero Carbon Run',
        note: 'Website event dengan registrasi, pembayaran, dan tiket digital.',
        image: '/lovable-uploads/zero-carbon.png',
    },
];

const faqs = [
    {
        q: 'Berapa biaya jasa pembuatan website Makassar?',
        a: 'Paket website bisnis mulai Rp1.000.000. Website dengan fitur custom seperti dashboard, booking, payment, atau sistem khusus mulai Rp3.500.000 tergantung scope.',
    },
    {
        q: 'Apakah bisa untuk bisnis di luar Makassar?',
        a: 'Bisa, tapi halaman ini kami khususkan untuk bisnis Makassar dan sekitarnya seperti Gowa, Maros, Panakkukang, Tamalanrea, dan Biringkanaya. Versi umum tersedia terpisah.',
    },
    {
        q: 'Apakah website sudah termasuk SEO?',
        a: 'Termasuk fondasi SEO dasar seperti struktur heading, metadata, halaman responsif, dan arahan konten lokal. SEO lanjutan bisa dibahas sebagai optimasi terpisah atau maintenance bulanan.',
    },
    {
        q: 'Setelah website selesai apakah bisa lanjut maintenance?',
        a: 'Bisa. Setelah website online, Anda bisa lanjut ke Website Care bulanan untuk update konten, perbaikan ringan, optimasi, dan tambah fitur sesuai paket.',
    },
];

function createWhatsappLink(number: string, text: string) {
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export default function JasaPembuatanWebsiteMakassarPage() {
    const { whatsappNumber, instagramUrl } = getPublicSiteConfig();
    const whatsappUrl = createWhatsappLink(
        whatsappNumber,
        'Halo BangunWebsite.id, saya ingin konsultasi jasa pembuatan website Makassar.'
    );

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'BangunWebsite.id',
        url: pageUrl,
        image: socialImageUrl,
        areaServed: ['Makassar', 'Gowa', 'Maros', 'Sulawesi Selatan', 'Indonesia'],
        telephone: `+${whatsappNumber}`,
        priceRange: 'Mulai Rp1.000.000',
        description: pageDescription,
        sameAs: [instagramUrl],
        makesOffer: {
            '@type': 'Offer',
            name: 'Jasa Pembuatan Website Makassar',
            url: pageUrl,
            category: 'Website development',
        },
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            },
        })),
    };

    return (
        <main className='min-h-screen bg-slate-50 text-slate-950'>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

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
                            <a href='#paket' className='text-slate-700 hover:text-cyan-700'>
                                Paket
                            </a>
                            <a href='#portfolio' className='text-slate-700 hover:text-cyan-700'>
                                Portfolio
                            </a>
                            <Link href='/blog' className='text-slate-700 hover:text-cyan-700'>
                                Blog
                            </Link>
                            <a href='#kontak' className='text-slate-700 hover:text-cyan-700'>
                                Kontak
                            </a>
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

            <section className='relative overflow-hidden bg-[#082f3b] text-white'>
                <div className='absolute inset-x-0 bottom-0 h-2 bg-[linear-gradient(90deg,#22d3ee_0%,#fbbf24_48%,#38bdf8_100%)]' />
                <div className='relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 md:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center'>
                    <div className='max-w-4xl'>
                        <p className='inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-cyan-100'>
                            Jasa pembuatan website Makassar
                        </p>
                        <h1 className='mt-5 text-[2.1rem] font-bold leading-[1.1] sm:text-4xl md:text-5xl'>
                            Website Bisnis Makassar yang Mudah Ditemukan dan
                            Mudah Dihubungi
                        </h1>
                        <p className='mt-6 text-base leading-7 text-slate-200 md:text-lg'>
                            BangunWebsite.id membantu UMKM dan bisnis lokal
                            Makassar membuat website yang sesuai cara pelanggan
                            lokal mencari informasi: buka dari HP, cek layanan,
                            lihat bukti, lalu chat WhatsApp atau datang ke
                            lokasi.
                        </p>
                        <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
                            <a
                                href={whatsappUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-full bg-amber-400 px-7 py-3 text-center text-base font-bold text-slate-950 transition hover:bg-amber-300'
                            >
                                Konsultasi Website Baru
                            </a>
                            <a
                                href='#paket'
                                className='rounded-full border border-white/30 px-7 py-3 text-center text-base font-bold text-white transition hover:bg-white/10'
                            >
                                Lihat Paket Website
                            </a>
                        </div>
                        <div className='mt-8 grid gap-3 sm:grid-cols-2'>
                            {heroPoints.map((point) => (
                                <p
                                    key={point}
                                    className='rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-semibold text-slate-100'
                                >
                                    {point}
                                </p>
                            ))}
                        </div>
                    </div>

                    <aside className='rounded-[28px] border border-white/15 bg-white p-5 text-slate-950 shadow-[0_28px_80px_-45px_rgba(15,23,42,0.9)]'>
                        <p className='text-sm font-bold uppercase tracking-[0.16em] text-cyan-800'>
                            Brief website baru
                        </p>
                        <div className='mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200'>
                            {heroBriefRows.map((row) => (
                                <div
                                    key={row.label}
                                    className='grid grid-cols-[92px_minmax(0,1fr)] gap-3 bg-white px-4 py-3'
                                >
                                    <p className='text-xs font-bold uppercase tracking-[0.14em] text-slate-500'>
                                        {row.label}
                                    </p>
                                    <p className='text-sm font-bold leading-6 text-slate-900'>
                                        {row.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className='mt-5 text-sm leading-6 font-medium text-slate-700'>
                            Cocok untuk bisnis yang mengandalkan pencarian
                            lokal, rekomendasi, iklan area sekitar, dan chat
                            WhatsApp sebagai pintu masuk calon pelanggan.
                        </p>
                        <a
                            href={whatsappUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mt-6 inline-flex w-full justify-center rounded-full bg-cyan-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-800'
                        >
                            Kirim Brief via WhatsApp
                        </a>
                    </aside>
                </div>
            </section>

            <TrustedBySection />

            <section className='mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start'>
                <div>
                    <p className='inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-bold text-cyan-800'>
                        Website untuk Makassar dan Sekitarnya
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Dibuat untuk Kebiasaan Pelanggan Lokal Mencari dan Chat
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                        Pelanggan lokal biasanya ingin cepat tahu layanan,
                        lokasi, harga mulai, bukti kerja, dan cara menghubungi.
                        Struktur halaman dibuat mengikuti pola itu.
                    </p>
                    <div className='mt-5 flex flex-wrap gap-2'>
                        {makassarAreas.map((area) => (
                            <span
                                key={area}
                                className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700'
                            >
                                {area}
                            </span>
                        ))}
                    </div>
                </div>
                <div className='grid gap-3 sm:grid-cols-2'>
                    {makassarBusinessTypes.map((item) => (
                        <p
                            key={item}
                            className='rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold leading-6 text-slate-800 shadow-sm'
                        >
                            {item}
                        </p>
                    ))}
                </div>
            </section>

            <section className='bg-white py-16 md:py-20'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='max-w-3xl'>
                        <p className='inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-800'>
                        Menyesuaikan bisnis
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Konten Website Disesuaikan dengan Offer Lokal Anda
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                            Kami bantu susun pesan utama: apa layanan Anda,
                            siapa targetnya, area mana yang dilayani, bukti apa
                            yang perlu ditampilkan, dan CTA WhatsApp mana yang
                            paling tepat.
                        </p>
                    </div>
                    <div className='mt-8 grid gap-4 md:grid-cols-3'>
                        {businessFitPoints.map((point) => (
                            <article
                                key={point.title}
                                className='rounded-[24px] border border-slate-200 bg-slate-50 p-5'
                            >
                                <h3 className='text-lg font-bold text-slate-950'>
                                    {point.title}
                                </h3>
                                <p className='mt-3 text-sm leading-6 font-medium text-slate-700'>
                                    {point.body}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className='bg-slate-100 py-16 md:py-20'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='max-w-3xl'>
                        <p className='inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-bold text-white'>
                        Funnel bisnis lokal
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Contoh Alur untuk Bisnis Lokal Makassar
                    </h2>
                    </div>
                    <div className='mt-8 grid gap-4 md:grid-cols-3'>
                        {makassarFunnelExamples.map((item) => (
                            <article
                                key={item.title}
                                className='rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm'
                            >
                                <h3 className='text-lg font-bold text-slate-950'>
                                    {item.title}
                                </h3>
                                <p className='mt-3 text-sm leading-6 font-medium text-slate-700'>
                                    {item.body}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 py-16 md:py-20'>
                <div className='max-w-3xl'>
                    <p className='inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-bold text-cyan-800'>
                        Jenis website
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Format Website yang Paling Sering Dibutuhkan Bisnis
                        Lokal
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                        Kami bantu pilih bentuk website yang paling masuk akal
                        untuk kondisi bisnis sekarang: promosi, profil, katalog,
                        booking, atau sistem sederhana.
                    </p>
                </div>
                <div className='mt-8 grid gap-4 md:grid-cols-2'>
                    {websiteTypes.map((item) => (
                        <article
                            key={item.title}
                            className='rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)]'
                        >
                            <h3 className='text-xl font-bold text-slate-950'>
                                {item.title}
                            </h3>
                            <p className='mt-3 text-sm leading-6 font-medium text-slate-700 md:text-base'>
                                {item.body}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section id='paket' className='bg-slate-100 py-16 md:py-20'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='max-w-3xl'>
                        <p className='inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-bold text-white'>
                            Paket pembuatan website
                        </p>
                        <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Paket Website untuk Bisnis Makassar yang Ingin Cepat
                            Online
                        </h2>
                        <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                            Harga final mengikuti jumlah halaman, kebutuhan
                            konten, dan fitur teknis yang perlu dibangun.
                        </p>
                    </div>

                    <div className='mt-8 grid gap-5 md:grid-cols-2'>
                        {packages.map((item) => (
                            <article
                                key={item.name}
                                className={`rounded-[24px] border bg-white p-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)] ${
                                    item.featured
                                        ? 'border-cyan-300 ring-2 ring-cyan-100'
                                        : 'border-slate-200'
                                }`}
                            >
                                {item.featured ? (
                                    <p className='mb-3 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800'>
                                        Paling cocok untuk mulai
                                    </p>
                                ) : null}
                                <h3 className='text-2xl font-bold text-slate-950'>
                                    {item.name}
                                </h3>
                                <p className='mt-2 text-2xl font-bold text-cyan-800'>
                                    {item.price}
                                </p>
                                <p className='mt-3 text-sm leading-6 font-medium text-slate-600'>
                                    {item.fit}
                                </p>
                                <ul className='mt-5 grid gap-2 text-sm font-medium text-slate-700'>
                                    {item.points.map((point) => (
                                        <li key={point} className='flex gap-2'>
                                            <span className='font-bold text-cyan-700'>
                                                -
                                            </span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href={whatsappUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className={`mt-6 inline-flex rounded-full px-5 py-2.5 text-sm font-bold transition ${
                                        item.featured
                                            ? 'bg-cyan-700 text-white hover:bg-cyan-800'
                                            : 'bg-slate-900 text-white hover:bg-slate-700'
                                    }`}
                                >
                                    Konsultasi {item.name}
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 py-16 md:py-20'>
                <div className='max-w-3xl'>
                    <p className='inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-800'>
                        Alur kerja
                    </p>
                        <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Dari Kebutuhan Lokal sampai Website Siap Dipromosikan
                        </h2>
                </div>
                <div className='mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    {processSteps.map((step, index) => (
                        <article
                            key={step.title}
                            className='rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm'
                        >
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-700 text-sm font-bold text-white'>
                                {index + 1}
                            </span>
                            <h3 className='mt-4 text-xl font-bold text-slate-950'>
                                {step.title}
                            </h3>
                            <p className='mt-3 text-sm leading-6 font-medium text-slate-700'>
                                {step.body}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section id='portfolio' className='bg-slate-950 py-16 text-white md:py-20'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='max-w-3xl'>
                        <p className='inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-bold text-cyan-100'>
                            Portfolio website
                        </p>
                        <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Contoh Website dan Project yang Relevan untuk Bisnis
                            Lokal
                        </h2>
                    </div>
                    <div className='mt-8 grid gap-5 md:grid-cols-3'>
                        {portfolioProjects.map((project) => (
                            <article
                                key={project.title}
                                className='overflow-hidden rounded-[24px] border border-white/10 bg-white/10'
                            >
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    width={640}
                                    height={400}
                                    className='aspect-[16/10] w-full object-cover'
                                />
                                <div className='p-5'>
                                    <h3 className='text-xl font-bold'>
                                        {project.title}
                                    </h3>
                                    <p className='mt-2 text-sm leading-6 text-slate-300'>
                                        {project.note}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 py-16 md:py-20'>
                <h2 className='text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                    FAQ Jasa Pembuatan Website Makassar
                </h2>
                <div className='mt-8 space-y-4'>
                    {faqs.map((faq) => (
                        <details
                            key={faq.q}
                            className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'
                        >
                            <summary className='cursor-pointer text-lg font-bold'>
                                {faq.q}
                            </summary>
                            <p className='mt-3 text-base leading-7 font-medium text-slate-700'>
                                {faq.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            <section id='kontak' className='bg-gradient-to-r from-cyan-800 to-slate-900 py-16 text-white md:py-20'>
                <div className='mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between'>
                    <div className='max-w-2xl'>
                        <p className='inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-bold text-cyan-100'>
                            Kontak
                        </p>
                        <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Mau Website Bisnis Makassar Anda Lebih Siap Dicari?
                        </h2>
                        <p className='mt-3 text-base leading-7 text-slate-200 md:text-lg'>
                            Kirim jenis bisnis, area layanan, dan target utama
                            website. Kami bantu susun alur halaman yang cocok
                            untuk calon pelanggan lokal.
                        </p>
                    </div>
                    <a
                        href={whatsappUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex rounded-full bg-amber-400 px-7 py-3 text-center text-base font-bold text-slate-950 transition hover:bg-amber-300'
                    >
                        Konsultasi Website Baru
                    </a>
                </div>
            </section>

            <PublicFooter />
        </main>
    );
}
