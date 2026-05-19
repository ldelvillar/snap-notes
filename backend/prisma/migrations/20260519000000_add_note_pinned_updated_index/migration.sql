-- Composite index matching the GET /notes ORDER BY (pinnedAt DESC NULLS LAST, updatedAt DESC)
-- so Postgres can walk the index directly instead of sorting in memory.
--
-- NULLS LAST is explicit: Postgres defaults to NULLS FIRST for DESC, but the
-- list query is "ORDER BY pinnedAt DESC NULLS LAST". Without the explicit
-- NULLS LAST on the index, the planner could still use it for filtering on
-- userId but would have to sort in memory. Prisma's @@index annotation does
-- not support nulls ordering, so the index in the SQL diverges from what
-- prisma generate would emit — this is intentional.
CREATE INDEX "Note_userId_pinnedAt_updatedAt_idx" ON "Note" ("userId", "pinnedAt" DESC NULLS LAST, "updatedAt" DESC);
