import 'server-only';
import prisma from './prisma/prisma';

export async function mentionsActivityLogger({
  usersMentioned,
  activity,
  isUpdate,
}: {
  usersMentioned?: {
    id: string;
    username: string | null;
  }[];
  activity: {
    type: 'POST_MENTION' | 'COMMENT_MENTION' | 'REPLY_MENTION';
    sourceUserId: string;
    sourceId: number;
    targetId?: number | null;
    // For 'POST_MENTION', the `targetId` is not needed
    // For 'COMMENT_MENTION', the `targetId` is the POST `id` of the comment
    // For 'REPLY_MENTION', the `targetId` is the `parentId` of the reply
  };
  isUpdate: boolean;
}) {
  // If this is an update operation, delete the previous mention activity logs first
  if (isUpdate) {
    await prisma.activity.deleteMany({
      where: activity,
    });
  }

  // Return if there no mentioned users
  if (!usersMentioned) return;

  const usersMentionedIds = usersMentioned.map(({ id }) => id);
  await Promise.all(
    usersMentionedIds.map((id) =>
      prisma.activity.create({
        data: { ...activity, targetUserId: id },
      }),
    ),
  );
}
