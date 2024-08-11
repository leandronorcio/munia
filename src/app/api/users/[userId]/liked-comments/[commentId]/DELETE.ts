/**
 * DELETE /api/users/:userId/liked-comments/:commentId
 * - Allows an authenticated user to delete a comment
 * from their liked comments.
 */

import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { userId: string; commentId: string } }) {
  const [user] = await getServerUser();
  if (!user || params.userId !== user.id) return NextResponse.json({}, { status: 401 });

  const commentId = parseInt(params.commentId, 10);

  const isLiked = await prisma.commentLike.count({
    where: {
      userId: user.id,
      commentId,
    },
  });

  if (!isLiked) {
    // If the post is NOT liked, return 409 Conflict
    return NextResponse.json({}, { status: 409 });
  }

  const res = await prisma.commentLike.delete({
    where: {
      userId_commentId: {
        userId: user.id,
        commentId,
      },
    },
  });

  // Delete the associated 'COMMENT_LIKE' or 'REPLY_LIKE' activity
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      parentId: true,
      userId: true,
    },
  });
  const type = comment?.parentId ? 'REPLY_LIKE' : 'COMMENT_LIKE';
  await prisma.activity.deleteMany({
    where: {
      type,
      sourceUserId: user.id,
      sourceId: res.id,
      targetId: commentId,
    },
  });

  return NextResponse.json({});
}
