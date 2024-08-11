/**
 * DELETE /api/comments/:commentId
 * - Allows an authenticated user to delete a comment on a post.
 */

import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/getServerUser';
import { verifyAccessToComment } from './verifyAccessToComment';

export async function DELETE(request: Request, { params }: { params: { commentId: string } }) {
  const [user] = await getServerUser();
  const commentId = parseInt(params.commentId, 10);
  if (!verifyAccessToComment(commentId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const res = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  // Delete the associated 'CREATE_REPLY' or 'CREATE_COMMENT' activity logs
  // If `isComment` is false, it is a reply
  const type = res?.parentId ? 'CREATE_REPLY' : 'CREATE_COMMENT';
  await prisma.activity.deleteMany({
    where: {
      type,
      sourceUserId: user?.id,
      sourceId: res.id,
      targetId: type === 'CREATE_COMMENT' ? res.postId : res.parentId,
    },
  });

  return NextResponse.json({ id: res.id });
}
