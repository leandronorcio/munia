-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'NONBINARY');

-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('SINGLE', 'IN_A_RELATIONSHIP', 'ENGAGED', 'MARRIED');

-- CreateTable
CREATE TABLE "About" (
    "userId" TEXT NOT NULL,
    "gender" "Gender",
    "birthDate" TIMESTAMP(3),
    "phoneNumber" TEXT,
    "address" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "relationshipStatus" "RelationshipStatus" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "About_userId_key" ON "About"("userId");

-- AddForeignKey
ALTER TABLE "About" ADD CONSTRAINT "About_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
