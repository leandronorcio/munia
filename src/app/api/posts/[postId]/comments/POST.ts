/**
 * POST /api/posts/:postId/comments
 * - Allows an authenticated user to comment on a post specified
 * by the :postId.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { FindCommentResult, GetComment } from 'types';
import { commentWriteSchema } from '@/lib/validations/comment';
import { z } from 'zod';
import { getServerUser } from '@/lib/getServerUser';
import { includeToComment } from '@/lib/prisma/includeToComment';
import { toGetComment } from '@/lib/prisma/toGetComment';

export async function POST(
  request: Request,
  { params }: { params: { postId: string } },
) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  try {
    const body = await request.json();
    const { content } = commentWriteSchema.parse(body);

    const res: FindCommentResult = await prisma.comment.create({
      data: {
        content: content,
        userId: userId,
        postId: parseInt(params.postId),
      },
      include: includeToComment(userId),
    });

    return NextResponse.json(toGetComment(res));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
