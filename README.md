# BangunWebsite.id Landing Page

Official landing page for **bangunwebsite.id**, a digital service business focused on website development, maintenance, IT consulting, and product delivery.

## Services

- Website Development
- Website Maintenance
- IT Consulting
- Product / SaaS Delivery

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- PostgreSQL (for admin + blog management)

## Live Website

[https://bangunwebsite.id](https://bangunwebsite.id)

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy env template:

```bash
cp .env.example .env.local
```

3. Fill real values in `.env.local` (never commit this file).

4. Run app:

```bash
npm run dev
```

5. Optional DB setup / migration seed:

```bash
npm run db:setup-admin
```

## Security Notes (Public Repo Safe)

- `.env.local` is ignored by git.
- Use `.env.example` for variable documentation only.
- Never commit:
  - DB passwords
  - API keys / tokens
  - session secrets
  - private keys

## Sitemap & SEO

- Dynamic sitemap is served at `/sitemap.xml`.
- `robots.txt` points to the sitemap.
- New blog posts added from admin dashboard are automatically included in sitemap.

## Blog Image Upload (CDN)

- Admin dashboard supports image upload for blog posts via `/api/admin/blogs/upload`.
- Configure S3/MinIO env variables:
  - `MINIO_ENDPOINT`
  - `MINIO_PORT`
  - `MINIO_USE_SSL`
  - `MINIO_ACCESS_KEY`
  - `MINIO_SECRET_KEY`
  - `MINIO_BUCKET`
  - `MINIO_PUBLIC_BASE_URL`
  - `MINIO_OBJECT_PREFIX` (recommended: `assets`)
