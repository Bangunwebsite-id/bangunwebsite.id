const DEFAULT_SITE_URL = 'https://bangunwebsite.id';
export const SITE_NAME = 'BangunWebsite.id';
export const DEFAULT_SITE_DESCRIPTION =
    'BangunWebsite.id membantu UMKM dan bisnis lokal mengelola website secara berkelanjutan melalui langganan developer, maintenance website, konsultasi IT, SEO dasar, dan optimasi bulanan.';
export const DEFAULT_SOCIAL_IMAGE_PATH = '/bangun-website.png';
const DEFAULT_WHATSAPP_NUMBER = '6282151928443';
const DEFAULT_WHATSAPP_TEXT =
    'Halo BangunWebsite.id, saya ingin konsultasi tentang website, maintenance, atau kebutuhan IT.';
const DEFAULT_WHATSAPP_PORTFOLIO_TEXT =
    'Halo Bangunwebsite.id! Saya tertarik untuk konsultasi gratis setelah melihat portfolio Anda. Mohon informasi lebih lanjut.';
const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/bangunwebsite_id/';

function getEnvValue(name: string, fallback: string) {
    const value = process.env[name]?.trim();
    return value || fallback;
}

function normalizeWhatsappNumber(value: string) {
    const normalized = value.replace(/[^0-9]/g, '');
    return normalized || DEFAULT_WHATSAPP_NUMBER;
}

function createWhatsappUrl(number: string, text: string) {
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function getPublicSiteConfig() {
    const siteUrlRaw = getEnvValue('NEXT_PUBLIC_SITE_URL', DEFAULT_SITE_URL);
    const siteUrl = siteUrlRaw.endsWith('/')
        ? siteUrlRaw.slice(0, -1)
        : siteUrlRaw;
    const whatsappNumber = normalizeWhatsappNumber(
        getEnvValue('NEXT_PUBLIC_WHATSAPP_NUMBER', DEFAULT_WHATSAPP_NUMBER)
    );
    const whatsappDefaultText = getEnvValue(
        'NEXT_PUBLIC_WHATSAPP_DEFAULT_TEXT',
        DEFAULT_WHATSAPP_TEXT
    );
    const whatsappPortfolioText = getEnvValue(
        'NEXT_PUBLIC_WHATSAPP_PORTFOLIO_TEXT',
        DEFAULT_WHATSAPP_PORTFOLIO_TEXT
    );
    const instagramUrl = getEnvValue(
        'NEXT_PUBLIC_INSTAGRAM_URL',
        DEFAULT_INSTAGRAM_URL
    );

    return {
        siteUrl,
        whatsappNumber,
        whatsappDefaultText,
        whatsappPortfolioText,
        whatsappDefaultUrl: createWhatsappUrl(
            whatsappNumber,
            whatsappDefaultText
        ),
        whatsappPortfolioUrl: createWhatsappUrl(
            whatsappNumber,
            whatsappPortfolioText
        ),
        instagramUrl,
    };
}

export function getAbsoluteUrl(pathOrUrl: string, baseUrl?: string) {
    const fallbackBaseUrl = baseUrl ?? getPublicSiteConfig().siteUrl;

    try {
        return new URL(pathOrUrl, fallbackBaseUrl).toString();
    } catch {
        return new URL(DEFAULT_SOCIAL_IMAGE_PATH, fallbackBaseUrl).toString();
    }
}

export function getDefaultSocialImageUrl(baseUrl?: string) {
    return getAbsoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH, baseUrl);
}
