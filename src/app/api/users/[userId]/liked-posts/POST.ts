/**
 * POST /api/users/:userId/liked-posts
 * - Allows an authenticated user to add a post to
 * their liked posts.
 *
 * JSON body: {
 *  postId: string
 * }
 */

import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const [user] = await getServerUser();
  if (!user || params.userId !== user.id) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  const { postId } = await request.json();

  // Check first if the post is already liked
  const isLiked = await prisma.postLike.count({
    where: {
      userId,
      postId,
    },
  });

  if (isLiked) {
    // Post is already liked, return 409 Conflict
    return NextResponse.json({}, { status: 409 });
  }

  // Like the post
  const res = await prisma.postLike.create({
    data: {
      userId,
      postId,
    },
  });

  // Record a 'POST_LIKE' activity
  const postOwner = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      userId: true,
    },
  });
  if (postOwner) {
    await prisma.activity.create({
      data: {
        type: 'POST_LIKE',
        sourceId: res.id,
        sourceUserId: userId,
        targetId: postId,
        targetUserId: postOwner?.userId,
      },
    });
  }

  return NextResponse.json({});
}
