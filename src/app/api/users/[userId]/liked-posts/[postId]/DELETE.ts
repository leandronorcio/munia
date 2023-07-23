/**
 * DELETE /api/users/:userId:/liked-posts/:postId
 * - Allows an authenticated user to delete a post
 * from their liked posts.
 */

import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; postId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || params.userId !== user.id)
    return NextResponse.json({}, { status: 401 });

  const postId = parseInt(params.postId);

  const isLiked = await prisma.postLike.count({
    where: {
      userId: user.id,
      postId,
    },
  });

  if (!isLiked) {
    // If the post is NOT liked, return 409 Conflict
    return NextResponse.json({}, { status: 409 });
  }

  await prisma.postLike.delete({
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  });

  return NextResponse.json({});
}
