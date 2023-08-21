import { FindActivityResults, GetActivities } from 'types';
import prisma from './prisma';
import { convertMentionUsernamesToIds } from '../convertMentionUsernamesToIds';
import { ActivityType } from '@prisma/client';

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

export async function toGetActivities(
  findActivityResults: FindActivityResults,
): Promise<GetActivities> {
  const notifications: GetActivities = [];

  for (const activity of findActivityResults) {
    const { type, sourceId, targetId } = activity;

    if (type === 'CREATE_FOLLOW') {
      notifications.push(activity);
      continue;
    }

    const content = await getContentFromPostOrComment(type, sourceId, targetId);
    notifications.push({ ...activity, content });
  }

  return notifications;
}
