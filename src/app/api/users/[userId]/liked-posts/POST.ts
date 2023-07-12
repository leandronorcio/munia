/**
 * POST /api/users/:userId/liked-posts
 * - Allows an authenticated user to add a post to
 * their liked posts.
 *
 * JSON body: {
 *  postId: string
 * }
 */

import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || params.userId !== user.id)
    return NextResponse.json({}, { status: 401 });

  const { postId } = await request.json();

  const res = await prisma.postLike.create({
    data: {
      userId: user.id,
      postId,
    },
  });

  return NextResponse.json({ liked: true });
}
