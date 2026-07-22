import Swal from 'sweetalert2';

export const dashboardTabs = [
    {
        id: 'overview',
        label: 'Overview',
        description: 'Ringkasan performa',
    },
    {
        id: 'traffic',
        label: 'Traffic',
        description: 'Sumber dan tren',
    },
    {
        id: 'users',
        label: 'Users',
        description: 'Manajemen akun',
    },
    {
        id: 'blog',
        label: 'Blog',
        description: 'CRUD artikel',
    },
    {
        id: 'notulen',
        label: 'Notulen',
        description: 'CRUD rapat',
    },
    {
        id: 'todo-list',
        label: 'To Do List',
        description: 'Tugas harian',
    },
    {
        id: 'secret-variable',
        label: 'Notes Secret',
        description: 'Catatan rahasia',
    },
] as const;

export type DashboardTabId = (typeof dashboardTabs)[number]['id'];

export function formatDate(value: string) {
    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatDateShort(value: string) {
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function formatDayLabel(value: string) {
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
    });
}

export function toDateInputValue(value: string) {
    return new Date(value).toISOString().slice(0, 10);
}

export function getTodayDateInput() {
    return new Date().toISOString().slice(0, 10);
}

export function getGrowthLabel(today: number, yesterday: number) {
    if (yesterday === 0 && today > 0) {
        return '+100%';
    }

    if (yesterday === 0) {
        return '0%';
    }

    const pct = ((today - yesterday) / yesterday) * 100;
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
}

export function slugify(raw: string) {
    return raw
        .toLowerCase()
        .trim()
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export function getSourceBadgeClass(sourceLabel: string) {
    if (sourceLabel.startsWith('utm:')) {
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }

    const label = sourceLabel.toLowerCase();

    if (label === 'direct') {
        return 'border-slate-200 bg-slate-100 text-slate-700';
    }
    if (label === 'google' || label === 'bing' || label === 'duckduckgo') {
        return 'border-sky-200 bg-sky-50 text-sky-700';
    }
    if (
        label === 'instagram' ||
        label === 'facebook' ||
        label === 'tiktok' ||
        label === 'x-twitter' ||
        label === 'youtube' ||
        label === 'linkedin' ||
        label === 'whatsapp'
    ) {
        return 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700';
    }

    return 'border-amber-200 bg-amber-50 text-amber-700';
}

export const swalConfirmButtonColor = '#0891b2';
export const swalCancelButtonColor = '#475569';
export const swalDeleteButtonColor = '#dc2626';
export const publicSiteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bangunwebsite.id'
).replace(/\/$/, '');

export function showSuccessAlert(text: string, title = 'Berhasil!') {
    return Swal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonColor: swalConfirmButtonColor,
    });
}

export function showErrorAlert(text: string, title = 'Gagal!') {
    return Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: swalConfirmButtonColor,
    });
}

export function showCopySuccessToast(url: string) {
    return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Tautan berhasil disalin!',
        text: url,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });
}

export async function copyTextToClipboard(text: string) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const isCopied = document.execCommand('copy');

        if (!isCopied) {
            throw new Error('Browser tidak dapat menyalin tautan otomatis.');
        }
    } finally {
        document.body.removeChild(textArea);
    }
}

export function confirmSaveChanges() {
    return Swal.fire({
        icon: 'warning',
        title: 'Simpan Perubahan?',
        text: 'Perubahan yang Anda lakukan akan disimpan.',
        showCancelButton: true,
        confirmButtonText: 'Ya, Simpan',
        cancelButtonText: 'Batal',
        confirmButtonColor: swalConfirmButtonColor,
        cancelButtonColor: swalCancelButtonColor,
    });
}

export function confirmDeleteData() {
    return Swal.fire({
        icon: 'warning',
        title: 'Hapus Data?',
        text: 'Data yang dihapus tidak dapat dikembalikan.',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: swalDeleteButtonColor,
        cancelButtonColor: swalCancelButtonColor,
    });
}
