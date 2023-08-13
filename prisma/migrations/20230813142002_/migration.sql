/*
  Warnings:

  - The values [CREATE_POST,UPDATE_POST,DELETE_POST] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityType_new" AS ENUM ('CREATE_FOLLOW', 'POST_LIKE', 'POST_MENTION', 'CREATE_COMMENT', 'COMMENT_LIKE', 'COMMENT_MENTION', 'CREATE_REPLY', 'REPLY_LIKE', 'REPLY_MENTION');
ALTER TABLE "Activity" ALTER COLUMN "type" TYPE "ActivityType_new" USING ("type"::text::"ActivityType_new");
ALTER TYPE "ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "ActivityType_old";
COMMIT;
