/**
 * GET /api/posts/:postId/comments
 * - Returns the comments of a post specified by the postId provided.
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const res = await prisma.comment.findMany({
    where: {
      postId: parseInt(params.postId),
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      postId: true,
      user: {
        select: {
          id: true,
          name: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  return NextResponse.json({ comments: res });
}
