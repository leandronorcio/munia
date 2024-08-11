import { FindActivityResults, GetActivities } from '@/types/definitions';
import { ActivityType } from '@prisma/client';
import prisma from './prisma';
import { convertMentionUsernamesToIds } from '../convertMentionUsernamesToIds';
import { fileNameToUrl } from '../s3/fileNameToUrl';

async function getContentFromPostOrComment(
  type: ActivityType,
  sourceId: number,
  targetId: number | null,
): Promise<string> {
  const entity =
    type === 'POST_LIKE' || type === 'POST_MENTION'
      ? await prisma.post.findUnique({
          where: {
            id: type === 'POST_LIKE' ? targetId! : sourceId,
          },
          select: {
            content: true,
          },
        })
      : await prisma.comment.findFirst({
          where: {
            id: type.includes('LIKE') ? targetId! : sourceId,
          },
          select: {
            content: true,
          },
        });

  if (entity?.content) {
    return (
      await convertMentionUsernamesToIds({
        str: entity.content,
        reverse: true,
      })
    ).str;
  }

  return `This was deleted by the owner.`;
}

export async function toGetActivities(findActivityResults: FindActivityResults): Promise<GetActivities> {
  const notificationsPromises = findActivityResults.map(async (activity) => {
    const { type, sourceId, targetId, sourceUser, targetUser } = activity;

    // The `name` and `username` are guaranteed to be filled after the user's registration,
    // thus we can safely use non-null assertion here.
    const sourceUserWithPhotoUrl = {
      ...sourceUser,
      name: sourceUser.name!,
      username: sourceUser.username!,
      profilePhoto: fileNameToUrl(sourceUser.profilePhoto),
    };
    const targetUserWithPhotoUrl = {
      ...targetUser,
      name: targetUser.name!,
      username: targetUser.username!,
      profilePhoto: fileNameToUrl(targetUser.profilePhoto),
    };

    if (type === 'CREATE_FOLLOW') {
      return {
        ...activity,
        sourceUser: sourceUserWithPhotoUrl,
        targetUser: targetUserWithPhotoUrl,
      };
    }

    const content = await getContentFromPostOrComment(type, sourceId, targetId);
    return {
      ...activity,
      content,
      sourceUser: sourceUserWithPhotoUrl,
      targetUser: targetUserWithPhotoUrl,
    };
  });

  return Promise.all(notificationsPromises);
}
