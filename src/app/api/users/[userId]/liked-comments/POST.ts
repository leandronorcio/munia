/**
 * POST /api/users/:userId/liked-comments
 * - Allows an authenticated user to add a comment to
 * their liked comments.
 *
 * JSON body: {
 *  commentId: string
 * }
 */

import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const [user] = await getServerUser();
  if (!user || params.userId !== user.id)
    return NextResponse.json({}, { status: 401 });

  const { commentId } = await request.json();

  // Check first if the post is already liked
  const isLiked = await prisma.commentLike.count({
    where: {
      userId: user.id,
      commentId,
    },
  });

  if (isLiked) {
    // Post is already liked, return 409 Conflict
    return NextResponse.json({}, { status: 409 });
  }

  // Like the post
  await prisma.commentLike.create({
    data: {
      userId: user.id,
      commentId,
    },
  });

  return NextResponse.json({});
}
