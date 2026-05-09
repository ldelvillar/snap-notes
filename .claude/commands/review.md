# Review.md

Review the current changes in the Snap Notes project and flag any real issues before shipping.

## What to review

Run `git diff HEAD` to get the full picture of what's changed. If nothing is changed, say so and stop.

Focus only on things that matter. Do not flag style preferences, formatting, or anything already enforced by ESLint/Prettier/TypeScript.

### Logic & correctness

- Off-by-one errors, wrong conditions, unreachable branches
- Incorrect notes ordering (must always be pinned-first, then `updatedAt` descending)
- Auth logic mistakes — JWT validation, cookie config (`SameSite: none` prod, `lax` dev)
- Race conditions or state inconsistencies in `AuthProvider` or `NotesProvider`

### Security

- Any credential, secret, or key hardcoded or logged
- Missing `requireAuth` middleware on protected routes
- `credentials: 'include'` missing on frontend API calls via `notesService.ts`
- Stripe logic leaking outside `routes/payments.ts`

### Data layer

- Raw SQL in `app/db/` that could allow injection
- Prisma schema changed but `prisma generate` not run
- Missing indexes on new query patterns (notes are indexed on `userId` and `updatedAt`)

### Tests

- New behaviour added without a corresponding test in `backend/src/tests/`
- Test structure doesn't mirror route structure
- Tests hitting real DB instead of mocking Prisma

### Conventions

- API calls made outside `frontend/src/lib/notesService.ts`
- Agent prompts hardcoded in Python instead of `prompts/prompts.yaml` (if ML pipeline touched)
- `frontend/src/types/api.d.ts` edited by hand instead of via `pnpm generate:api-types`

## Output format

Be direct and concise. Group findings by severity:

**Must fix** — blocks shipping, correctness or security issue
**Should fix** — not blocking but will cause problems soon
**Worth noting** — minor, can be addressed later

If there are no issues, say "Looks good — nothing blocking." and stop. Don't invent problems.
