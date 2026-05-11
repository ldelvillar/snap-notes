/*
  Warnings:

  - Made the column `subscription` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- Backfill existing NULL subscriptions before making column NOT NULL
UPDATE "User" SET subscription = 'free' WHERE subscription IS NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ALTER COLUMN "subscription" SET NOT NULL,
ALTER COLUMN "subscription" SET DEFAULT 'free';
