/**
 * POST /api/comments/:commentId/replies
 * - Allows an authenticated user to create a reply to
 * a comment specified on the :commentId param.
 */

import { getServerUser } from '@/lib/getServerUser';
import { includeToComment } from '@/lib/prisma/includeToComment';
import prisma from '@/lib/prisma/prisma';
import { toGetComment } from '@/lib/prisma/toGetComment';
import { commentWriteSchema } from '@/lib/validations/comment';
import { NextResponse } from 'next/server';
import { GetComment } from 'types';
import { z } from 'zod';

export async function POST(
  request: Request,
  { params }: { params: { commentId: string } },
) {
  const [user] = await getServerUser();
  if (!user) NextResponse.json({}, { status: 401 });
  const userId = user?.id!;

  try {
    const body = await request.json();
    const { content } = commentWriteSchema.parse(body);

    const res = await prisma.comment.create({
      data: {
        content,
        userId,
        parentId: parseInt(params.commentId),
      },
      include: includeToComment(userId),
    });

    return NextResponse.json(toGetComment(res) as GetComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
