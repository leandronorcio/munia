/**
 * GET /api/posts/:postId/comments
 * - Returns the comments of a post specified by the postId provided.
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { GetComment } from 'types';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } },
) {
  const res: GetComment[] = await prisma.comment.findMany({
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
          username: true,
          name: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  return NextResponse.json<GetComment[]>(res);
}
