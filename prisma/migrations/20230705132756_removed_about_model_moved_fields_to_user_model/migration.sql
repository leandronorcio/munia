/*
  Warnings:

  - You are about to drop the `About` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "About" DROP CONSTRAINT "About_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "relationshipStatus" "RelationshipStatus",
ADD COLUMN     "website" TEXT;

-- DropTable
DROP TABLE "About";
