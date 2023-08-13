-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATE_POST', 'UPDATE_POST', 'DELETE_POST', 'POST_LIKE', 'POST_MENTION', 'CREATE_COMMENT', 'COMMENT_LIKE', 'COMMENT_MENTION', 'CREATE_REPLY', 'REPLY_LIKE', 'REPLY_MENTION', 'CREATE_FOLLOW');

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ActivityType" NOT NULL,
    "sourceId" INTEGER,
    "targetId" INTEGER,
    "sourceUserId" TEXT NOT NULL,
    "targetUserId" TEXT,
    "isNotificationActive" BOOLEAN NOT NULL DEFAULT true,
    "isNotificationRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
