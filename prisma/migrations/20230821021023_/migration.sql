/*
  Warnings:

  - Made the column `sourceId` on table `Activity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "sourceId" SET NOT NULL;
