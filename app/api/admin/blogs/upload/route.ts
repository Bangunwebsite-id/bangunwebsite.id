import { NextResponse } from 'next/server';

import { ensureAdminSessionOrApiKey } from '@/app/lib/admin-guard';
import { uploadImageToStorage } from '@/app/lib/storage';

const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
]);

export async function POST(request: Request) {
    const { unauthorizedResponse } = ensureAdminSessionOrApiKey(request);

    if (unauthorizedResponse) {
        return unauthorizedResponse;
    }

    try {
        const formData = await request.formData();
        const fileEntry = formData.get('file');

        if (!(fileEntry instanceof File)) {
            return NextResponse.json(
                { message: 'File gambar tidak ditemukan.' },
                { status: 400 }
            );
        }

        const file = fileEntry;

        if (file.size === 0) {
            return NextResponse.json(
                { message: 'File gambar kosong.' },
                { status: 400 }
            );
        }

        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
            return NextResponse.json(
                {
                    message:
                        'Ukuran gambar terlalu besar. Maksimal 8MB per file.',
                },
                { status: 400 }
            );
        }

        const mimeType = file.type || 'application/octet-stream';

        if (!ALLOWED_MIME_TYPES.has(mimeType)) {
            return NextResponse.json(
                {
                    message:
                        'Format gambar tidak didukung. Gunakan JPG, PNG, WEBP, GIF, atau SVG.',
                },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const uploadResult = await uploadImageToStorage({
            fileBuffer: Buffer.from(arrayBuffer),
            originalName: file.name || 'image',
            mimeType,
        });

        return NextResponse.json({
            message: 'Gambar berhasil diupload.',
            imageUrl: uploadResult.publicUrl,
            objectKey: uploadResult.objectKey,
            bucket: uploadResult.bucket,
        });
    } catch (error) {
        console.error('Blog image upload error:', error);
        return NextResponse.json(
            { message: 'Terjadi kesalahan saat upload gambar.' },
            { status: 500 }
        );
    }
}
