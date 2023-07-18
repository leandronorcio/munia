/**
 * GET /api/users/:userId/feed
 * - Allows an authenticated user to retrieve the most recent posts
 * posted by the user and their followers.
 */
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import prisma from '@/lib/prisma/prisma';
import { selectPost } from '@/lib/prisma/selectPost';
import { NextResponse } from 'next/server';
import { GetPost } from 'types';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 403 });

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  const cursor = parseInt(searchParams.get('cursor') || '0');

  const following = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      following: { select: { followingId: true } },
    },
  });

  const followingArr =
    following?.following.map((item) => item.followingId) || [];

  const posts: GetPost[] = await prisma.post.findMany({
    where: {
      userId: {
        in: [...followingArr, user.id],
      },
    },
    select: selectPost(user.id),
    take: limit,
    skip: cursor ? 1 : undefined,
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(posts);
}
