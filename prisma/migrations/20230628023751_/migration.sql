/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Post_id_userId_key" ON "Post"("id", "userId");
