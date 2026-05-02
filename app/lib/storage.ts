import { randomUUID } from 'crypto';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

type StorageConfig = {
    endpoint: string;
    bucket: string;
    publicBaseUrl: string;
    objectPrefix: string;
    accessKey: string;
    secretKey: string;
};

const DEFAULT_OBJECT_PREFIX = 'assets';

declare global {
    var __bangunWebsiteS3Client: S3Client | undefined;
}

function parseBoolean(value: string | undefined, fallback: boolean) {
    if (!value) {
        return fallback;
    }

    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function buildEndpoint() {
    const rawEndpoint = process.env.MINIO_ENDPOINT?.trim() ?? '';
    const rawPort = process.env.MINIO_PORT?.trim() ?? '';
    const useSsl = parseBoolean(process.env.MINIO_USE_SSL, true);

    if (!rawEndpoint) {
        throw new Error('MINIO_ENDPOINT is not set in environment variables');
    }

    if (rawEndpoint.startsWith('http://') || rawEndpoint.startsWith('https://')) {
        return rawEndpoint.replace(/\/+$/, '');
    }

    const protocol = useSsl ? 'https' : 'http';
    const defaultPort = useSsl ? '443' : '80';
    const port = rawPort && rawPort !== defaultPort ? `:${rawPort}` : '';

    return `${protocol}://${rawEndpoint}${port}`;
}

function sanitizePrefix(value: string) {
    return value
        .trim()
        .replace(/^\/+/, '')
        .replace(/\/+$/, '');
}

function getStorageConfig(): StorageConfig {
    const bucket = process.env.MINIO_BUCKET?.trim() ?? '';
    const publicBaseUrl = (process.env.MINIO_PUBLIC_BASE_URL?.trim() ?? '').replace(
        /\/+$/,
        ''
    );
    const accessKey = process.env.MINIO_ACCESS_KEY?.trim() ?? '';
    const secretKey = process.env.MINIO_SECRET_KEY?.trim() ?? '';
    const objectPrefix = sanitizePrefix(
        process.env.MINIO_OBJECT_PREFIX ?? DEFAULT_OBJECT_PREFIX
    );

    if (!bucket) {
        throw new Error('MINIO_BUCKET is not set in environment variables');
    }
    if (!publicBaseUrl) {
        throw new Error('MINIO_PUBLIC_BASE_URL is not set in environment variables');
    }
    if (!accessKey || !secretKey) {
        throw new Error(
            'MINIO_ACCESS_KEY or MINIO_SECRET_KEY is not set in environment variables'
        );
    }

    return {
        endpoint: buildEndpoint(),
        bucket,
        publicBaseUrl,
        objectPrefix,
        accessKey,
        secretKey,
    };
}

function getS3Client() {
    if (global.__bangunWebsiteS3Client) {
        return global.__bangunWebsiteS3Client;
    }

    const config = getStorageConfig();

    const client = new S3Client({
        endpoint: config.endpoint,
        forcePathStyle: true,
        region: process.env.MINIO_REGION?.trim() || 'us-east-1',
        credentials: {
            accessKeyId: config.accessKey,
            secretAccessKey: config.secretKey,
        },
    });

    global.__bangunWebsiteS3Client = client;
    return client;
}

function guessExtension(originalName: string, mimeType: string) {
    const lower = originalName.toLowerCase();
    const dotIndex = lower.lastIndexOf('.');

    if (dotIndex > -1 && dotIndex < lower.length - 1) {
        const ext = lower.slice(dotIndex + 1);
        if (/^[a-z0-9]{2,8}$/.test(ext)) {
            return ext;
        }
    }

    switch (mimeType) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/webp':
            return 'webp';
        case 'image/gif':
            return 'gif';
        case 'image/svg+xml':
            return 'svg';
        default:
            return 'bin';
    }
}

function sanitizeBaseName(originalName: string) {
    const withoutExtension = originalName.replace(/\.[^.]+$/, '');
    const normalized = withoutExtension
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return normalized || 'image';
}

function buildObjectKey(originalName: string, mimeType: string) {
    const config = getStorageConfig();
    const now = new Date();
    const year = String(now.getUTCFullYear());
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const baseName = sanitizeBaseName(originalName);
    const ext = guessExtension(originalName, mimeType);
    const unique = randomUUID().split('-')[0];

    return `${config.objectPrefix}/${year}/${month}/${baseName}-${unique}.${ext}`;
}

export type UploadResult = {
    objectKey: string;
    publicUrl: string;
    bucket: string;
};

export async function uploadImageToStorage(params: {
    fileBuffer: Buffer;
    originalName: string;
    mimeType: string;
}) {
    const config = getStorageConfig();
    const objectKey = buildObjectKey(params.originalName, params.mimeType);
    const client = getS3Client();

    await client.send(
        new PutObjectCommand({
            Bucket: config.bucket,
            Key: objectKey,
            Body: params.fileBuffer,
            ContentType: params.mimeType || 'application/octet-stream',
            ACL: 'public-read',
            CacheControl: 'public, max-age=31536000, immutable',
        })
    );

    const publicUrl = `${config.publicBaseUrl}/${objectKey}`;

    return {
        objectKey,
        publicUrl,
        bucket: config.bucket,
    } satisfies UploadResult;
}
