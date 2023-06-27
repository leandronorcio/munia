/*
  Warnings:

  - A unique constraint covering the columns `[id,userId,postId]` on the table `PostLike` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PostLike_userId_postId_key";

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_id_userId_postId_key" ON "PostLike"("id", "userId", "postId");
