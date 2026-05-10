# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Snap Notes** is a monorepo note-taking application with a Next.js frontend and Express.js backend, both in TypeScript. It features JWT/cookie authentication, CRUD notes with pinning, and Stripe integration for billing.

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, TypeScript (port 3000)
- **Backend**: Express.js 5, Prisma ORM 7, PostgreSQL, TypeScript (port 3001)
- **Testing**: Vitest + Supertest (backend only)
- **Package Manager**: pnpm 10+ (monorepo via `pnpm-workspace.yaml`)

## Monorepo Structure

```text
snap-notes/
├── frontend/src/
│   ├── app/          # Next.js App Router — grouped segments (public) and (authenticated)
│   ├── components/   # React components
│   ├── context/      # AuthProvider, NotesProvider
│   ├── hooks/        # useClickOutside, useKeyboardShortcuts, etc.
│   ├── lib/          # notesService.ts — all API calls
│   └── types/
├── backend/src/
│   ├── app.ts        # Express setup and route mounting
│   ├── server.ts     # Entry point
│   ├── routes/       # auth, notes, payments, health
│   ├── middlewares/  # requireAuth (JWT), CORS
│   ├── lib/          # Prisma singleton
│   └── tests/        # Vitest tests mirroring route structure
└── backend/prisma/
    ├── schema.prisma
    └── migrations/
```

## Commands

### Development

```bash
pnpm --filter backend dev      # http://localhost:3001
pnpm --filter frontend dev     # http://localhost:3000
```

### Testing

```bash
pnpm --filter backend test

# Single file
pnpm --filter backend test src/tests/notes/create.test.ts

# Pattern match
pnpm --filter backend test -- --grep "login"
```

### Code Quality

```bash
pnpm --filter backend lint          # ESLint
pnpm --filter backend lint:fix
pnpm --filter backend format        # Prettier
pnpm --filter backend format:check
pnpm --filter frontend lint         # ESLint
```

### Database

```bash
pnpm --filter backend exec prisma generate               # After schema changes
pnpm --filter backend exec prisma migrate dev --name <name>
pnpm --filter backend exec prisma migrate deploy
pnpm --filter backend exec prisma studio
```

## Architecture

### Authentication Flow

1. Register/login via `/auth/register` or `/auth/login`
2. Backend validates with bcrypt, issues JWT in httpOnly cookie
3. `AuthProvider.refreshSession()` calls `/auth/me` on mount
4. All subsequent requests include cookie automatically (`credentials: 'include'`)
5. `requireAuth` middleware verifies JWT on protected routes

### Data Models

- **User**: id, email, firstName, lastName, phone, photo, passwordHash, subscription (free/pro/team), timestamps
- **Note**: id, title, text, userId, pinnedAt, timestamps — indexed on `userId` and `updatedAt`

### Notes Ordering

Notes are always returned pinned-first, then sorted by `updatedAt` descending.

### Cookie Configuration

`SameSite` is `'none'` in production and `'lax'` in development. Frontend must pass `credentials: 'include'`; backend CORS must have `credentials: true`.

## API Routes

Routes are defined in `backend/src/routes/`: `auth.ts`, `notes.ts`, `payments.ts`, `health.ts`.

## Rules

- Use `pnpm --filter` for all commands — never run npm/yarn or cd into packages
- After any `schema.prisma` change, run `prisma generate` before writing or running tests
- Tests are integration tests that hit a real test database via `backend/.env.test` — do not mock Prisma
- Cookie config differs by environment (`SameSite: none` prod, `lax` dev) — don't flatten this
- All API calls go through `frontend/src/lib/notesService.ts` — don't fetch directly from components
- Notes must always be returned pinned-first, then `updatedAt` descending — don't change this ordering
- In backend source files, always use `env` from `@/lib/env` — never `process.env` directly (except in `lib/prisma.ts` and `lib/env.ts` itself)

## Environment Variables

See `frontend/.env.example` and `backend/.env.example`.

Note: `backend/.env.test` is a separate file for the test database — don't use the main `DATABASE_URL` in tests.

`backend/.env.test` — separate test database; loaded via `dotenv-cli` before Vitest runs.

All backend environment variables are centralized in `backend/src/lib/env.ts`. Never read `process.env` directly in backend source files — always import from `@/lib/env`. The only exceptions are `backend/src/lib/prisma.ts` (consumed by Prisma directly) and `env.ts` itself.

## Testing Practices

- Tests are **integration tests** — they hit a real PostgreSQL test database via `backend/.env.test`, loaded automatically by `dotenv-cli`
- Never mock Prisma; do not use `vi.mock('@/lib/prisma')` or `vi.spyOn(prisma.*)` in tests
- Each test file must use a **unique email** for its test user to avoid parallel-worker collisions
- `beforeAll` sets up users and notes directly via Prisma; `afterAll` cleans them up
- Mirror route structure for new test files: `src/tests/auth/login.test.ts` → `src/routes/auth.ts`
- Run `prisma generate` after any schema change before writing tests

## Stripe

`POST /payments/payment-intent` creates a Stripe PaymentIntent server-side.
Never log or store the Stripe secret key. Keep Stripe logic isolated to `routes/payments.ts`.
