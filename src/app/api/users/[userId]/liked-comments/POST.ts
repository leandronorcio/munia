/**
 * POST /api/users/:userId/liked-comments
 * - Allows an authenticated user to add a comment to
 * their liked comments.
 *
 * JSON body: {
 *  commentId: string
 * }
 */

import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const [user] = await getServerUser();
  if (!user || params.userId !== user.id) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  const { commentId } = await request.json();

  // Check first if the comment is already liked
  const isLiked = await prisma.commentLike.count({
    where: {
      userId,
      commentId,
    },
  });

  // Comment is already liked, return 409 Conflict
  if (isLiked) {
    return NextResponse.json({}, { status: 409 });
  }

  // Like the comment
  const res = await prisma.commentLike.create({
    data: {
      userId,
      commentId,
    },
  });

  // Record a 'REPLY_LIKE' or a 'COMMENT_LIKE' activity
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      parentId: true,
      userId: true,
    },
  });
  if (comment) {
    const type = comment?.parentId ? 'REPLY_LIKE' : 'COMMENT_LIKE';
    await prisma.activity.create({
      data: {
        type,
        sourceId: res.id,
        sourceUserId: userId,
        targetId: commentId,
        targetUserId: comment?.userId,
      },
    });
  }

  return NextResponse.json({});
}
