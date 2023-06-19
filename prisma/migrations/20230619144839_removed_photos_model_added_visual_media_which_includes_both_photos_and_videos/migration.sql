/*
  Warnings:

  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VisualMediaType" AS ENUM ('PHOTO', 'VIDEO');

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_postId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_userId_fkey";

-- DropTable
DROP TABLE "Photo";

-- CreateTable
CREATE TABLE "VisualMedia" (
    "id" SERIAL NOT NULL,
    "type" "VisualMediaType" NOT NULL DEFAULT 'PHOTO',
    "url" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "VisualMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VisualMedia" ADD CONSTRAINT "VisualMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualMedia" ADD CONSTRAINT "VisualMedia_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
