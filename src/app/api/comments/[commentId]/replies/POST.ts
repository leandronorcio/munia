/**
 * POST /api/comments/:commentId/replies
 * - Allows an authenticated user to create a reply to
 * a comment specified on the :commentId param.
 */

import { convertMentionUsernamesToIds } from '@/lib/convertMentionUsernamesToIds';
import { getServerUser } from '@/lib/getServerUser';
import { mentionsActivityLogger } from '@/lib/mentionsActivityLogger';
import { includeToComment } from '@/lib/prisma/includeToComment';
import prisma from '@/lib/prisma/prisma';
import { toGetComment } from '@/lib/prisma/toGetComment';
import { commentWriteSchema } from '@/lib/validations/comment';
import { NextResponse } from 'next/server';
import { GetComment } from '@/types/definitions';
import { z } from 'zod';

export async function POST(request: Request, { params }: { params: { commentId: string } }) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;
  const commentId = parseInt(params.commentId, 10);

  try {
    const body = await request.json();
    let { content } = commentWriteSchema.parse(body);
    const { str, usersMentioned } = await convertMentionUsernamesToIds({
      str: content,
    });
    content = str;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        userId: true,
        postId: true,
      },
    });

    if (!comment) return NextResponse.json({ error: 'The comment to reply to does not exist.' }, { status: 404 });

    const res = await prisma.comment.create({
      data: {
        content,
        userId,
        parentId: commentId,
        postId: comment.postId,
      },
      include: includeToComment(userId),
    });

    // Record a 'CREATE_REPLY' activity
    // Find the owner of the comment being replied to
    if (comment) {
      await prisma.activity.create({
        data: {
          type: 'CREATE_REPLY',
          sourceId: res.id,
          sourceUserId: userId,
          targetId: commentId,
          targetUserId: comment.userId,
        },
      });
    }

    // Log the 'REPLY_MENTION' activity if applicable
    await mentionsActivityLogger({
      usersMentioned,
      activity: {
        type: 'REPLY_MENTION',
        sourceUserId: userId,
        sourceId: res.id,
        targetId: res.parentId,
      },
      isUpdate: false,
    });

    return NextResponse.json((await toGetComment(res)) as GetComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(null, {
        status: 422,
        statusText: error.issues[0].message || 'Input validation error',
      });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
