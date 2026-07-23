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
const pageUrl = `${siteUrl}/maintenance-website`;
const socialImageUrl = getDefaultSocialImageUrl(siteUrl);

const pageTitle = 'Maintenance Website - Website Care Bulanan';
const pageDescription =
    'Jasa maintenance website untuk bisnis yang butuh website tetap aman, cepat, rapi, mudah diupdate, dan siap dikembangkan setiap bulan.';

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
                alt: 'Maintenance Website',
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

const auditPoints = [
    'Cek error, form, tombol WhatsApp, dan tampilan mobile',
    'Optimasi ringan untuk kecepatan, CTA, dan struktur halaman',
    'Backup berkala, update konten ringan, dan monitoring dasar',
    'Saran SEO on-page dan tracking untuk Google Search Console',
];

const maintenanceRequestScreenshots = [
    {
        src: '/maintenance-makassar/3.png',
        alt: 'Contoh permintaan request klien untuk update atau tambah fitur sub rubrik di website',
        width: 1074,
        height: 1036,
    },
    {
        src: '/maintenance-makassar/1.png',
        alt: 'Contoh permintaan request klien untuk update atau tambah fitur komentar di website',
        width: 1088,
        height: 590,
    },
    {
        src: '/maintenance-makassar/2.png',
        alt: 'Contoh permintaan request klien untuk update konten foto dan dokumen ke CMS website',
        width: 1120,
        height: 654,
    },
    {
        src: '/maintenance-makassar/4.png',
        alt: 'Contoh permintaan request klien untuk update atau tambah fitur video di website lewat WhatsApp',
        width: 1070,
        height: 684,
    },
];

const localProblems = [
    'Website sudah online, tapi jarang dicek dan mulai terasa lambat',
    'Calon pelanggan klik WhatsApp, tapi tombol atau form tidak berjalan',
    'Konten promo, paket, produk, atau jadwal sering perlu diupdate',
    'Website terlihat lama, tapi belum perlu redesign total',
    'Tidak tahu performa website setelah iklan, SEO, atau posting konten',
    'Mau tambah section atau fitur ringan tapi tidak punya developer tetap',
];

const packageRows = [
    {
        name: 'Website Care Basic',
        price: 'Rp500.000/bulan',
        fit: 'Untuk website bisnis yang butuh perawatan rutin dan request ringan.',
        featured: true,
        items: [
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
        examples: [],
    },
    {
        name: 'Website Care Priority',
        price: 'Rp2.000.000/bulan',
        fit: 'Untuk bisnis yang butuh prioritas, optimasi lebih aktif, dan pengembangan bertahap.',
        items: [
            'Semua fitur Basic',
            'Prioritas pengerjaan tertinggi',
            'Optimasi CTA, funnel, dan landing page',
            'SEO on-page lebih mendalam',
            'Maintenance & perbaikan bug teknis mendalam',
            'Support campaign/iklan digital lanjutan',
            'Maksimal 4-5 request per bulan',
            'Support intensif via WhatsApp',
            'Evaluasi & review strategi performa bulanan',
            'Integrasi tools ringan-menengah',
        ],
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

const processSteps = [
    {
        title: 'Audit website',
        body: 'Kami cek kondisi halaman, bug yang terlihat, CTA utama, kecepatan dasar, dan kesiapan tracking.',
    },
    {
        title: 'Rapikan prioritas',
        body: 'Masalah yang paling dekat dengan lead, order, dan kepercayaan pelanggan dikerjakan dulu.',
    },
    {
        title: 'Maintenance bulanan',
        body: 'Setelah fondasi rapi, website dijaga lewat monitoring, update ringan, dan request sesuai paket.',
    },
];

const idealClients = [
    'Rental, travel, tour, dan transportasi',
    'Klinik, salon, dan layanan profesional',
    'Cafe, restoran, catering, dan bisnis kuliner',
    'Kursus, sekolah, dan komunitas edukasi',
    'Event organizer, hotel, dan promotor acara',
    'Company profile yang sudah lama tidak diupdate',
];

const portfolioHighlights = [
    {
        title: 'Website rental kendaraan',
        note: 'Website promosi dengan fokus trust dan lead WhatsApp.',
        image: '/lovable-uploads/77e2b1a3-1f70-45c9-b30b-0944cdbafab4.png',
    },
    {
        title: 'Sistem tes psikologi',
        note: 'Sistem web dengan dashboard, alur login, dan manajemen soal.',
        image: '/lovable-uploads/psikologi-polda.png',
    },
    {
        title: 'Platform edukasi',
        note: 'Website edukasi untuk akuisisi siswa dan penjualan kelas.',
        image: '/lovable-uploads/6740e6ed-df81-4708-b579-9613605b29b3.png',
    },
];

const faqs = [
    {
        q: 'Apakah maintenance website ini bisa untuk website yang bukan dibuat BangunWebsite.id?',
        a: 'Bisa. Paket ini cocok untuk website lama yang sudah berjalan dan butuh dirawat, diperbaiki, atau dioptimalkan.',
    },
    {
        q: 'Apakah semua proses bisa lewat WhatsApp?',
        a: 'Bisa. Mayoritas request, prioritas kerja, dan update progress bisa dilakukan lewat WhatsApp agar pemilik bisnis lebih mudah memberi arahan.',
    },
    {
        q: 'Apakah termasuk bikin website baru?',
        a: 'Maintenance fokus untuk website yang sudah ada. Website baru, redesign total, dashboard kompleks, atau payment gateway dihitung sebagai project terpisah.',
    },
    {
        q: 'Apa target bulan pertama?',
        a: 'Bulan pertama fokus audit, perbaikan dasar, pengecekan CTA, mobile, kecepatan, dan prioritas kerja agar website lebih siap dipakai untuk marketing.',
    },
];

function createWhatsappLink(number: string, text: string) {
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export default function MaintenanceWebsitePage() {
    const { whatsappNumber, instagramUrl } = getPublicSiteConfig();
    const whatsappUrl = createWhatsappLink(
        whatsappNumber,
        'Halo BangunWebsite.id, saya ingin konsultasi maintenance website.'
    );

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Maintenance Website',
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
            lowPrice: '500000',
            highPrice: '2000000',
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
                    { label: 'FAQ', href: '#faq' },
                    { label: 'Blog', href: '/blog' },
                    { label: 'Kontak', href: '#kontak' },
                ]}
            />

            <section className='relative overflow-hidden bg-[linear-gradient(135deg,#062f49_0%,#102236_54%,#713f12_100%)] text-white'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(34,211,238,0.2),transparent_32%),radial-gradient(circle_at_85%_14%,rgba(251,191,36,0.18),transparent_28%)]' />
                <div className='relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 md:py-24 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-center'>
                    <div className='max-w-4xl'>
                        <p className='inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-cyan-100'>
                            Jasa maintenance website
                        </p>
                        <h1 className='mt-5 text-[2.1rem] font-bold leading-[1.1] sm:text-4xl md:text-5xl'>
                            Website Bisnis Tetap Aman, Cepat, dan Siap
                            Menghasilkan Lead
                        </h1>
                        <p className='mt-6 text-base leading-7 text-slate-200 md:text-lg'>
                            BangunWebsite.id membantu bisnis merawat,
                            memperbaiki, mengoptimalkan, dan mengembangkan
                            website setiap bulan. Cocok untuk website yang
                            sudah berjalan tapi mulai lambat, error, atau jarang
                            diupdate.
                        </p>
                        <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
                            <a
                                href={whatsappUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-full bg-amber-400 px-7 py-3 text-center text-base font-bold text-slate-950 transition hover:bg-amber-300'
                            >
                                Audit Awal via WhatsApp
                            </a>
                            <a
                                href='#paket'
                                className='rounded-full border border-white/30 px-7 py-3 text-center text-base font-bold text-white transition hover:bg-white/10'
                            >
                                Lihat Paket Bulanan
                            </a>
                        </div>
                        <div className='mt-8 grid gap-3 sm:grid-cols-2'>
                            {auditPoints.map((point) => (
                                <p
                                    key={point}
                                    className='rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-semibold text-slate-100'
                                >
                                    {point}
                                </p>
                            ))}
                        </div>
                    </div>

                    <aside className='rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-[0_28px_80px_-45px_rgba(14,165,233,0.7)] backdrop-blur'>
                        <p className='text-sm font-bold text-cyan-100'>
                            Target bulan pertama
                        </p>
                        <h2 className='mt-3 text-2xl font-bold leading-tight'>
                            Dari website yang dibiarkan menjadi aset marketing
                            yang dirawat.
                        </h2>
                        <div className='mt-6 space-y-3'>
                            {processSteps.map((step, index) => (
                                <div
                                    key={step.title}
                                    className='rounded-2xl border border-white/15 bg-white/10 p-4'
                                >
                                    <p className='text-sm font-bold text-amber-200'>
                                        {index + 1}. {step.title}
                                    </p>
                                    <p className='mt-2 text-sm leading-6 text-slate-200'>
                                        {step.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </section>

            <TrustedBySection />

            <section className='border-b border-slate-200 bg-white py-16 md:py-20'>
                <div className='mx-auto w-full max-w-7xl px-4'>
                    <div className='mx-auto max-w-4xl text-center'>
                        <p className='inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-bold text-cyan-800'>
                            Contoh request klien
                        </p>
                        <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Maintenance Bisa Dipakai untuk Update Konten dan
                            Tambah Fitur
                        </h2>
                        <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                            Ini contoh request real dari klien: kirim kebutuhan
                            lewat WhatsApp, kami cek scope, lalu eksekusi sesuai
                            prioritas paket maintenance.
                        </p>
                    </div>
                    <div className='mx-auto mt-10 max-w-4xl rounded-[28px] border border-slate-200 bg-slate-950 p-3 shadow-[0_28px_80px_-50px_rgba(15,23,42,0.75)] md:p-4'>
                        <div className='space-y-4'>
                            {maintenanceRequestScreenshots.map((image, index) => (
                                <Image
                                    key={image.src}
                                    src={image.src}
                                    alt={image.alt}
                                    width={image.width}
                                    height={image.height}
                                    className='w-full rounded-[22px] border border-white/10 object-contain shadow-[0_18px_50px_-34px_rgba(0,0,0,0.8)]'
                                    priority={index === 0}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className='mx-auto w-full max-w-6xl px-4 py-16 md:py-20'>
                <div className='max-w-3xl'>
                    <p className='inline-flex rounded-full bg-cyan-100 px-4 py-1 text-sm font-bold text-cyan-800'>
                        Masalah umum
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Website Tidak Harus Rusak Total untuk Mulai Kehilangan
                        Peluang
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                        Masalah kecil pada website bisa membuat calon pelanggan
                        ragu sebelum sempat menghubungi atau melakukan order.
                    </p>
                </div>
                <div className='mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {localProblems.map((problem) => (
                        <article
                            key={problem}
                            className='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)]'
                        >
                            <p className='text-base font-bold leading-7 text-slate-900'>
                                {problem}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section id='paket' className='bg-slate-100 py-16 md:py-20'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='max-w-3xl'>
                        <p className='inline-flex rounded-full bg-slate-900 px-4 py-1 text-sm font-bold text-white'>
                            Paket maintenance website
                        </p>
                        <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Mulai dari Perawatan Rutin sampai Prioritas
                            Pengembangan Bulanan
                        </h2>
                    </div>

                    <div className='mt-8 grid gap-5 md:grid-cols-2'>
                        {packageRows.map((item) => (
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
                                        Paling direkomendasikan
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
                                    {item.items.map((point) => (
                                        <li key={point} className='flex gap-2'>
                                            <span className='font-bold text-cyan-700'>
                                                -
                                            </span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                                {item.examples.length > 0 ? (
                                    <div className='mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                                        <p className='text-sm font-bold text-slate-900'>
                                            Contoh request semi kompleks -
                                            kompleks
                                        </p>
                                        <ul className='mt-3 grid gap-2 text-sm font-medium text-slate-700'>
                                            {item.examples.map((example) => (
                                                <li
                                                    key={example}
                                                    className='flex gap-2'
                                                >
                                                    <span className='font-bold text-cyan-700'>
                                                        -
                                                    </span>
                                                    <span>{example}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
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

            <section className='mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start'>
                <div>
                    <p className='inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-800'>
                        Cocok untuk siapa?
                    </p>
                    <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                        Untuk Bisnis yang Butuh Website Aktif, Bukan Sekadar
                        Online
                    </h2>
                    <p className='mt-4 text-base leading-7 text-slate-700 md:text-lg'>
                        Fokusnya adalah website yang membantu kepercayaan,
                        pencarian Google, dan lead WhatsApp berjalan lebih rapi.
                    </p>
                </div>
                <div className='grid gap-3 sm:grid-cols-2'>
                    {idealClients.map((client) => (
                        <p
                            key={client}
                            className='rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 shadow-sm'
                        >
                            {client}
                        </p>
                    ))}
                </div>
            </section>

            <section className='bg-slate-950 py-16 text-white md:py-20'>
                <div className='mx-auto w-full max-w-6xl px-4'>
                    <div className='max-w-3xl'>
                        <p className='inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-bold text-cyan-100'>
                            Bukti kerja
                        </p>
                        <h2 className='mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                            Sudah Menangani Website Bisnis dan Sistem Web
                        </h2>
                    </div>
                    <div className='mt-8 grid gap-5 md:grid-cols-3'>
                        {portfolioHighlights.map((project) => (
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

            <section id='faq' className='mx-auto w-full max-w-6xl px-4 py-16 md:py-20'>
                <h2 className='text-2xl font-bold leading-tight sm:text-3xl md:text-4xl'>
                    FAQ Maintenance Website
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
                            Mau Cek Kondisi Website Anda Bulan Ini?
                        </h2>
                        <p className='mt-3 text-base leading-7 text-slate-200 md:text-lg'>
                            Kirim link website dan ceritakan masalahnya. Kami
                            bantu cek prioritas awal sebelum masuk paket bulanan.
                        </p>
                    </div>
                    <a
                        href={whatsappUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex rounded-full bg-amber-400 px-7 py-3 text-center text-base font-bold text-slate-950 transition hover:bg-amber-300'
                    >
                        Audit Awal via WhatsApp
                    </a>
                </div>
            </section>

            <PublicFooter />
        </main>
    );
}
