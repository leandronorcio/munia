/**
 * GET /api/comments/:commentId/replies
 * - Returns the replies of a comment specified by the
 * :commentId parameter.
 */
import { getServerUser } from '@/lib/getServerUser';
import { includeToComment } from '@/lib/prisma/includeToComment';
import prisma from '@/lib/prisma/prisma';
import { toGetComment } from '@/lib/prisma/toGetComment';
import { NextResponse } from 'next/server';
import { FindCommentResult } from '@/types/definitions';

export async function GET(request: Request, { params }: { params: { commentId: string } }) {
  /**
   * The `userId` will only be used to check whether the user
   * requesting the comments has liked them or not.
   */
  const [user] = await getServerUser();
  const userId = user?.id;

  const res: FindCommentResult[] = await prisma.comment.findMany({
    where: {
      parentId: parseInt(params.commentId, 10),
    },
    include: includeToComment(userId),
    orderBy: {
      id: 'asc',
    },
  });

  const repliesPromises = res.map(toGetComment);
  const replies = await Promise.all(repliesPromises);

  return NextResponse.json(replies);
}
