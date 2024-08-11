/**
 * PUT /api/comments/:commentId
 * - Allows an authenticated user to edit a comment on a post.
 */

import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { commentWriteSchema } from '@/lib/validations/comment';
import { FindCommentResult, GetComment } from '@/types/definitions';
import { getServerUser } from '@/lib/getServerUser';
import { includeToComment } from '@/lib/prisma/includeToComment';
import { toGetComment } from '@/lib/prisma/toGetComment';
import { convertMentionUsernamesToIds } from '@/lib/convertMentionUsernamesToIds';
import { mentionsActivityLogger } from '@/lib/mentionsActivityLogger';
import { z } from 'zod';
import { verifyAccessToComment } from './verifyAccessToComment';

export async function PUT(request: Request, { params }: { params: { commentId: string } }) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user?.id;
  const commentId = parseInt(params.commentId, 10);

  if (!verifyAccessToComment(commentId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    let { content } = commentWriteSchema.parse(body);
    const { str, usersMentioned } = await convertMentionUsernamesToIds({
      str: content,
    });
    content = str;

    const res: FindCommentResult = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
      include: includeToComment(userId),
    });

    // Update the 'COMMENT_MENTION' or 'REPLY_MENTION' activity if applicable
    await mentionsActivityLogger({
      usersMentioned,
      activity: {
        type: res.parentId ? 'REPLY_MENTION' : 'COMMENT_MENTION',
        sourceUserId: userId,
        sourceId: res.id,
        targetId: res.parentId || res.postId,
      },
      isUpdate: true,
    });

    return NextResponse.json<GetComment>(await toGetComment(res));
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
