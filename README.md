# Snap Notes

A modern note-taking application that allows you to capture, organize, and manage your notes with ease.

![Snap Notes Landing Page](https://snap-notes.vercel.app/images/landing-page.webp)

- `frontend`: Next.js + React + Tailwind
- `backend`: Express + Prisma + PostgreSQL

## Features

- Authentication with cookie-based sessions
- Notes CRUD (create, read, update, delete)
- Pin/unpin notes
- Plan/subscription update flow from billing

## Monorepo Structure

```text
snap-notes/
├─ frontend/            # Next.js app
├─ backend/             # Express + Prisma API
├─ pnpm-workspace.yaml
└─ README.md
```

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database

## Installation

1. Clone the repository.

```bash
git clone https://github.com/yourusername/snap-notes.git
cd snap-notes
```

1. Install dependencies.

```bash
pnpm install
```

## Environment Variables

Create `frontend/.env` using `frontend/.env.example`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Create `backend/.env` using `backend/.env.example`:

```env
PORT=3001
CORS_ALLOWED_ORIGINS=frontend URL (e.g. http://localhost:3000)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require
AUTH_JWT_SECRET=your_super_secret_key
AUTH_COOKIE_NAME=snapnotes_session
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

To get `STRIPE_WEBHOOK_SECRET` for local development, use the [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --forward-to localhost:3001/payments/webhook
```

Copy the `whsec_...` secret it prints and set it as `STRIPE_WEBHOOK_SECRET`.

> **Note for testing:** You must also create a `backend/.env.test` file pointing to a separate test database. Required keys: `DATABASE_URL`, `AUTH_JWT_SECRET`, `AUTH_COOKIE_NAME`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` (any `whsec_...` value works for tests, e.g. `whsec_test`).

## Prisma Setup (Backend)

From the workspace root:

```bash
pnpm --filter backend exec prisma generate
pnpm --filter backend exec prisma migrate deploy
```

For local development with new migrations:

```bash
pnpm --filter backend exec prisma migrate dev
```

## Run the App in Development

Run each service in a separate terminal from the workspace root.

Terminal 1 (backend):

```bash
pnpm --filter backend dev
```

Terminal 2 (frontend):

```bash
pnpm --filter frontend dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Documentation

When the backend is running, interactive API docs are available at [http://localhost:3001/docs](http://localhost:3001/docs) (Swagger UI).

## Useful Commands

```bash
# frontend
pnpm --filter frontend dev
pnpm --filter frontend build
pnpm --filter frontend lint

# backend
pnpm --filter backend dev
pnpm --filter backend test
pnpm --filter backend lint
pnpm --filter backend format
pnpm --filter backend format:check
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
