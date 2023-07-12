/**
 * POST /api/posts/:postId/comments
 * - Allows an authenticated user to comment on a post specified
 * by the :postId.
 */

import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { CommentType } from 'types';
import { commentWriteSchema } from '@/lib/validations/comment';
import { z } from 'zod';

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user) return NextResponse.json({}, { status: 401 });

  try {
    const body = await request.json();
    const { content } = commentWriteSchema.parse(body);

    const res = await prisma.comment.create({
      data: {
        content: content,
        user: {
          connect: {
            id: user.id,
          },
        },
        post: {
          connect: {
            id: parseInt(params.postId),
          },
        },
      },
    });

    return NextResponse.json({
      id: res.id,
      content,
      createdAt: new Date(),
      postId: parseInt(params.postId),
      user: { id: user.id, name: user.name, profilePhoto: user.profilePhoto },
    } as CommentType);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
