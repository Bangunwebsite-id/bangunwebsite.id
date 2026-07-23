import type { Metadata } from 'next';
import Image from 'next/image';

import { LandingStickyHeader } from '@/app/components/landing-sticky-header';
import { PublicFooter } from '@/app/components/public-footer';
import { TrustedBySection } from '@/app/components/trusted-by-section';
import {
    SITE_NAME,
    getDefaultSocialImageUrl,
    getPublicSiteConfig,
} from '@/app/lib/site-config';

export const revalidate = 3600;

const { siteUrl } = getPublicSiteConfig();
const pageUrl = `${siteUrl}/jasa-pembuatan-website`;
const socialImageUrl = getDefaultSocialImageUrl(siteUrl);

const pageTitle = 'Jasa Pembuatan Website untuk Bisnis';
const pageDescription =
    'Jasa pembuatan website untuk bisnis yang butuh alur lead, katalog, profil usaha, dan sistem web yang jelas, mudah dikelola, dan siap dikembangkan.';

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
                alt: 'Jasa Pembuatan Website',
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
    'Riset kebutuhan dan struktur halaman',
    'Copy, CTA, dan alur konversi',
    'Handover agar pemilik mudah mengelola',
    'Siap lanjut maintenance atau optimasi',
];

const heroBriefRows = [
    {
        label: 'Mulai dari',
        value: 'Tujuan bisnis dan alur pelanggan',
    },
    {
        label: 'Output',
        value: 'Website siap dipakai, bukan hanya tampil',
    },
    {
        label: 'Dikelola',
        value: 'Struktur dibuat mudah diupdate',
    },
    {
        label: 'Budget',
        value: 'Mulai Rp1.000.000',
    },
];

const businessFitPoints = [
    {
        title: 'Scope dibuat jelas',
        body: 'Sebelum desain, kami bantu pisahkan mana yang wajib ada saat launch dan mana yang bisa masuk tahap berikutnya.',
    },
    {
        title: 'Pemilik mudah memberi arahan',
        body: 'Konten, referensi, fitur, dan prioritas dibahas dalam bahasa bisnis agar proses tidak terasa teknis untuk pemilik.',
    },
    {
        title: 'Siap dikelola setelah online',
        body: 'Struktur halaman dibuat rapi supaya update paket, layanan, produk, promo, dan CTA lebih mudah saat bisnis berubah.',
    },
];

const businessTypes = [
    'Bisnis jasa yang butuh calon klien cepat paham offer',
    'Produk fisik yang butuh katalog dan tombol order jelas',
    'Layanan profesional yang perlu membangun trust sebelum konsultasi',
    'Brand edukasi yang perlu menjelaskan kelas, jadwal, dan benefit',
    'Event atau campaign yang butuh registrasi dan informasi rapi',
    'Operasional internal yang butuh dashboard atau form sederhana',
];

const funnelExamples = [
    {
        title: 'Alur konsultasi',
        body: 'Untuk jasa bernilai tinggi, halaman dibuat menjelaskan masalah, solusi, bukti, paket, lalu mengarahkan pengunjung ke konsultasi.',
    },
    {
        title: 'Alur katalog',
        body: 'Untuk produk atau paket layanan, pengunjung dibantu membandingkan pilihan sebelum menekan tombol order atau tanya stok.',
    },
    {
        title: 'Alur sistem',
        body: 'Untuk kebutuhan custom, flow dibuat dari aktivitas pengguna: input data, booking, pembayaran, notifikasi, atau dashboard admin.',
    },
];

const websiteTypes = [
    {
        title: 'Landing Page Campaign',
        body: 'Untuk menguji offer, menjalankan iklan, menjelaskan benefit, dan mengarahkan pengunjung ke satu aksi utama.',
    },
    {
        title: 'Company Profile',
        body: 'Untuk menyusun profil usaha, layanan, tim, portfolio, legalitas, dan kontak agar calon klien lebih percaya.',
    },
    {
        title: 'Katalog Produk atau Jasa',
        body: 'Untuk bisnis yang perlu menampilkan pilihan produk, paket, spesifikasi, harga mulai, atau tombol tanya detail.',
    },
    {
        title: 'Custom Website atau System',
        body: 'Untuk booking, registrasi, dashboard admin, database pelanggan, order flow, atau sistem internal sederhana.',
    },
];

const packages = [
    {
        name: 'Starter & Business Website',
        price: 'Mulai Rp1.000.000',
        fit: 'Untuk bisnis yang butuh website rapi, cepat online, dan punya alur lead atau kontak yang jelas.',
        points: [
            'Pemetaan tujuan website sebelum desain',
            'Wireframe sederhana untuk alur halaman',
            'Desain responsif desktop dan mobile',
            'CTA WhatsApp, form, atau tombol order',
            'Copy dasar untuk hero dan bagian penting',
            'Deploy dan pengecekan setelah online',
        ],
        featured: true,
    },
    {
        name: 'Custom Website/System',
        price: 'Mulai Rp3.500.000',
        fit: 'Untuk website yang perlu menyimpan data, mengatur proses, atau membantu operasional harian.',
        points: [
            'Discovery fitur dan prioritas rilis',
            'Flow pengguna dan flow admin dirapikan',
            'Database, form, atau dashboard bila dibutuhkan',
            'Integrasi tools bisnis sesuai scope',
            'Testing alur inti sebelum launch',
            'Handover dan opsi maintenance bulanan',
        ],
    },
];

const processSteps = [
    {
        title: 'Discovery',
        body: 'Kami gali tujuan website, target pengguna, contoh referensi, aset yang tersedia, dan batasan budget.',
    },
    {
        title: 'Scope',
        body: 'Kami susun struktur halaman, daftar fitur, prioritas rilis, dan hal yang belum perlu dibuat dulu.',
    },
    {
        title: 'Build',
        body: 'Website dibangun responsif, konten utama dipasang, CTA dites, dan halaman disiapkan untuk launch.',
    },
    {
        title: 'Handover',
        body: 'Setelah online, kami bantu cek akses, tracking dasar, arahan update, dan rencana maintenance bila dibutuhkan.',
    },
];

const portfolioProjects = [
    {
        title: 'Website lead generation',
        note: 'Halaman promosi dengan struktur trust, penawaran, dan CTA yang mudah ditemukan.',
        image: '/lovable-uploads/77e2b1a3-1f70-45c9-b30b-0944cdbafab4.png',
    },
    {
        title: 'SentulTrip',
        note: 'Landing page paket wisata dengan informasi pilihan dan CTA booking.',
        image: '/lovable-uploads/sentultrip.png',
    },
    {
        title: 'Zero Carbon Run',
        note: 'Website event dengan registrasi, pembayaran, dan pengiriman tiket digital.',
        image: '/lovable-uploads/zero-carbon.png',
    },
];

const faqs = [
    {
        q: 'Berapa biaya jasa pembuatan website?',
        a: 'Website bisnis sederhana mulai Rp1.000.000. Website custom dengan dashboard, booking, payment, database, atau alur khusus mulai Rp3.500.000 setelah scope disepakati.',
    },
    {
        q: 'Apakah website bisa disesuaikan dengan bisnis saya?',
        a: 'Bisa. Kami mulai dari tujuan bisnis, target pelanggan, aset konten, produk atau jasa yang dijual, dan cara pemilik ingin menerima lead atau order.',
    },
    {
        q: 'Apakah website sudah termasuk SEO?',
        a: 'Termasuk fondasi SEO dasar seperti struktur heading, metadata, performa responsif, dan arahan konten. Optimasi lanjutan bisa masuk pekerjaan terpisah.',
    },
    {
        q: 'Setelah website selesai apakah bisa lanjut maintenance?',
        a: 'Bisa. Setelah website online, website dapat lanjut ke Website Care untuk update konten, perbaikan ringan, optimasi, dan pengembangan bertahap.',
    },
];

function createWhatsappLink(number: string, text: string) {
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export default function JasaPembuatanWebsitePage() {
    const { whatsappNumber, instagramUrl } = getPublicSiteConfig();
    const whatsappUrl = createWhatsappLink(
        whatsappNumber,
        'Halo BangunWebsite.id, saya ingin konsultasi jasa pembuatan website.'
    );

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Jasa Pembuatan Website',
        url: pageUrl,
        image: socialImageUrl,
        provider: {
            '@type': 'Organization',
            name: 'BangunWebsite.id',
            url: siteUrl,
            sameAs: [instagramUrl],
            telephone: `+${whatsappNumber}`,
        },
        areaServed: 'Indonesia',
        description: pageDescription,
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'IDR',
            lowPrice: '1000000',
            highPrice: '3500000',
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

            <LandingStickyHeader
                whatsappUrl={whatsappUrl}
                navItems={[
                    { label: 'Paket', href: '#paket' },
                    { label: 'Portfolio', href: '#portfolio' },
                    { label: 'Kontak', href: '#kontak' },
                ]}
            />

            <section className='relative overflow-hidden bg-[#082f3b] text-white'>
                <div className='absolute inset-x-0 bottom-0 h-2 bg-[linear-gradient(90deg,#22d3ee_0%,#fbbf24_48%,#38bdf8_100%)]' />
                <div className='relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 md:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center'>
                    <div className='max-w-4xl'>
                        <p className='inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-cyan-100'>
                            Jasa pembuatan website
                        </p>
                        <h1 className='mt-5 text-[2.1rem] font-bold leading-[1.1] sm:text-4xl md:text-5xl'>
                            Website Bisnis yang Jelas, Mudah Dikelola, dan Siap
                            Dipakai Jualan
                        </h1>
                        <p className='mt-6 text-base leading-7 text-slate-200 md:text-lg'>
                            BangunWebsite.id membantu bisnis merancang website
                            dari tujuan bisnisnya dulu: cari lead, menampilkan
                            katalog, membangun trust, menerima order, atau
                            membuat sistem sederhana untuk operasional.
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
                            Brief awal kami pakai untuk menentukan struktur,
                            prioritas halaman, CTA, dan fitur yang benar-benar
                            dibutuhkan saat launch.
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
                        Scope berdasarkan tujuan
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Website Dibangun dari Cara Bisnis Anda Bekerja
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                        Setiap bisnis punya alur yang berbeda. Ada yang perlu
                        menjelaskan layanan dulu, ada yang harus memudahkan
                        pembeli memilih produk, dan ada yang membutuhkan form
                        atau dashboard agar operasional lebih rapi.
                    </p>
                </div>
                <div className='grid gap-3 sm:grid-cols-2'>
                    {businessTypes.map((item) => (
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
                            Cara kerja
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Bukan Sekadar Desain, tapi Struktur yang Bisa
                            Dipakai Pemilik Bisnis
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                            Website yang bagus bukan cuma terlihat rapi. Ia
                            perlu mudah diarahkan, mudah diupdate, dan punya
                            prioritas konten yang membantu pengunjung mengambil
                            keputusan.
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
                            Alur pengguna
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Dari Pengunjung Datang sampai Mereka Mengambil Aksi
                    </h2>
                    </div>
                    <div className='mt-8 grid gap-4 md:grid-cols-3'>
                        {funnelExamples.map((item) => (
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
                        Format project
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Pilih Bentuk Website dari Kebutuhan Launch
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                        Kami bantu menentukan apakah cukup landing page,
                        company profile, katalog, atau perlu sistem custom
                        dengan database dan dashboard.
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
                            Paket Awal untuk Website yang Siap Dipakai
                        </h2>
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
                        Tahapan project
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Dari Kebutuhan Bisnis sampai Website Bisa Digunakan
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
                            Contoh Output Website dan Sistem Web
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
                    FAQ Jasa Pembuatan Website
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
                            Mau Susun Scope Website yang Masuk Akal?
                        </h2>
                        <p className='mt-3 text-base leading-7 text-slate-200 md:text-lg'>
                            Kirim tujuan website, contoh referensi, dan fitur
                            yang Anda bayangkan. Kami bantu pisahkan kebutuhan
                            wajib, opsional, dan tahap lanjutan.
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
