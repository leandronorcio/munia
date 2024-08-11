/**
 * DELETE /api/users/:userId:/liked-posts/:postId
 * - Allows an authenticated user to delete a post
 * from their liked posts.
 */

import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { userId: string; postId: string } }) {
  const [user] = await getServerUser();
  if (!user || params.userId !== user.id) return NextResponse.json({}, { status: 401 });

  const postId = parseInt(params.postId, 10);

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

  const res = await prisma.postLike.delete({
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  });

  // Delete the associated 'POST_LIKE' activity
  await prisma.activity.deleteMany({
    where: {
      type: 'POST_LIKE',
      sourceUserId: user.id,
      sourceId: res.id,
      targetId: postId,
    },
  });

  return NextResponse.json({});
}
