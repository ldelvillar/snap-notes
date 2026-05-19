-- Note_userId_idx is fully shadowed by Note_userId_pinnedAt_updatedAt_idx
-- (Postgres uses the leading column of a composite index).
-- Note_updatedAt_idx is unused; every notes query filters by userId first.
DROP INDEX "Note_userId_idx";
DROP INDEX "Note_updatedAt_idx";
