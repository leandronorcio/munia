/**
 * DELETE /api/posts/:postId/comments/:commentId
 * - Allows an authenticated user to delete a comment on a post.
 */

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAccessToComment } from './verifyAccessToComment';

export async function DELETE(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  const commentId = parseInt(params.commentId);
  if (!verifyAccessToComment(commentId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const res = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return NextResponse.json({ id: res.id });
}
