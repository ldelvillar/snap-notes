# Commit.md

Analyze the staged changes and write a conventional commit message for the Snap Notes project.

## Instructions

1. Run `git diff --staged` to review what's staged.
2. If nothing is staged, run `git diff HEAD` to check unstaged changes, then tell the user to stage what they want committed and stop.
3. Identify the **primary intent** of the changes — don't describe every file touched, describe what the change accomplishes.
4. Write a commit message following the format below.
5. Run `git commit -m "<message>"` — do not ask for confirmation unless the changes are ambiguous or span multiple unrelated concerns (in which case, flag this and suggest splitting).

## Commit Message Format

```
<type>(<scope>): <short description>

[optional body — only if the change needs context that isn't obvious from the title]
```

**Types:**

- `feat` — new feature or behaviour
- `fix` — bug fix
- `refactor` — restructuring with no behaviour change
- `test` — adding or updating tests
- `chore` — tooling, config, dependencies, migrations
- `style` — formatting only (Prettier, ESLint)
- `docs` — documentation only

**Scopes for this project:**

- `auth` — authentication, JWT, cookies, `requireAuth` middleware
- `notes` — note CRUD, pinning, ordering
- `payments` — Stripe integration
- `db` — Prisma schema, migrations, `prisma generate`
- `frontend` — Next.js pages, components, context, hooks
- `api` — Express routes, middleware, `app.ts`
- `test` — Vitest tests under `backend/src/tests/`
- `config` — monorepo config, `pnpm-workspace.yaml`, env files
- `ci` — GitHub Actions workflows

## Rules

- Keep the title under 72 characters.
- Use the imperative mood: "add rate limiting" not "added rate limiting".
- Do not mention file names in the title unless the file name *is* the feature (e.g. `add .env.example`).
- Do not include the scope if the change is truly cross-cutting.
- If a Prisma schema change is included, verify `prisma generate` was run — if not, warn the user before committing.
- Never commit anything in `.env` or `.env.test` files — if staged, warn the user immediately and do not proceed.
