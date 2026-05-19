# Ship.md

Run all quality checks for the Snap Notes project, fix any issues, then commit and push.

## Steps

Run these in order. Stop immediately if any step fails and cannot be auto-fixed.

### 1. Review

Run the `/review` command on the current changes.

- If there are any **must fix** issues, stop and surface them — do not proceed until resolved.
- If there are **should fix** issues, flag them to the user and ask whether to fix them before continuing.
- If there are only **worth noting** issues or none, proceed automatically.

### 2. Safety check

Run `git diff --staged && git diff HEAD` to understand what's changed.

If any `.env` or `.env.test` files are staged, **stop immediately** and warn the user — do not proceed.

### 3. Backend checks (run from repo root)

```bash
pnpm --filter backend format        # Auto-fixes formatting
pnpm --filter backend test          # Must pass — do not proceed if tests fail
pnpm --filter backend lint          # Must pass — do not proceed if linting fails
```

If tests fail:

- Diagnose the failure.
- Fix it if the cause is clear and the fix is small and safe.
- Re-run tests to confirm.
- If the fix is non-trivial or risky, stop and explain what's broken before touching anything.

### 4. Frontend checks

```bash
pnpm --filter frontend format       # Auto-fixes formatting
pnpm --filter frontend test:run     # Vitest — must pass
pnpm --filter frontend lint         # ESLint — fix auto-fixable issues
pnpm --filter frontend build        # Production build + type-check — must pass
```

If tests fail:

- Diagnose the failure.
- Fix it if the cause is clear and the fix is small and safe.
- Re-run tests to confirm.
- If the fix is non-trivial or risky, stop and explain what's broken before touching anything.

If the build fails due to type errors, fix them. If lint errors are not auto-fixable, fix them manually.

### 5. Prisma check

If `backend/prisma/schema.prisma` was modified, verify `prisma generate` has been run:

```bash
pnpm --filter backend exec prisma generate
```

### 6. Commit

Stage all changes including any fixes made during this process:

```bash
git add -A
```

Then run the `/commit` command, which handles commit message generation and env file safety checks.

### 7. Push

```bash
git push
```

If the push is rejected due to upstream changes, run `git pull --rebase` then push again. If rebase conflicts arise, stop and surface them — do not attempt to resolve conflicts silently.

## Done

Report: what was checked, what (if anything) was fixed, the commit message used, and confirmation that the push succeeded.
