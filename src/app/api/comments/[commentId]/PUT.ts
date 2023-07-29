/**
 * PUT /api/comments/:commentId
 * - Allows an authenticated user to edit a comment on a post.
 */

import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { verifyAccessToComment } from './verifyAccessToComment';
import { commentWriteSchema } from '@/lib/validations/comment';
import { GetComment } from 'types';
import { includeUserSummary } from '@/lib/prisma/includeUserSummary';

export async function PUT(
  request: Request,
  { params }: { params: { commentId: string } },
) {
  const commentId = parseInt(params.commentId);
  if (!verifyAccessToComment(commentId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { content } = commentWriteSchema.parse(body);

  const res = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content,
    },
    include: includeUserSummary(),
  });

  return NextResponse.json(res as GetComment);
}
