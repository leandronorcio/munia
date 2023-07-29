/**
 * PUT /api/comments/:commentId
 * - Allows an authenticated user to edit a comment on a post.
 */

import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { verifyAccessToComment } from './verifyAccessToComment';
import { commentWriteSchema } from '@/lib/validations/comment';
import { FindCommentResult, GetComment } from 'types';
import { getServerUser } from '@/lib/getServerUser';
import { includeToComment } from '@/lib/prisma/includeToComment';
import { toGetComment } from '@/lib/prisma/toGetComment';

export async function PUT(
  request: Request,
  { params }: { params: { commentId: string } },
) {
  const [user] = await getServerUser();
  const userId = user?.id;
  const commentId = parseInt(params.commentId);

  if (!verifyAccessToComment(commentId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { content } = commentWriteSchema.parse(body);

  const res: FindCommentResult = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content,
    },
    include: includeToComment(userId),
  });

  return NextResponse.json(toGetComment(res));
}
