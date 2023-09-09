/**
 * GET /api/users/:userId/feed
 * - Allows an authenticated user to retrieve the most recent posts
 * posted by the user and their followed users.
 */

import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { selectPost } from '@/lib/prisma/selectPost';
import { toGetPost } from '@/lib/prisma/toGetPost';
import { NextResponse } from 'next/server';
import { GetPost } from 'types';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const [user] = await getServerUser();
  if (!user || params.userId !== user.id)
    return NextResponse.json({}, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  const cursor = parseInt(searchParams.get('cursor') || '0');
  const sortDirection =
    (searchParams.get('sort-direction') as 'asc' | 'desc') || 'desc';

  // Get the IDs of the user's followed users
  const following = await prisma.follow.findMany({
    where: {
      followerId: user.id,
    },
    select: {
      followingId: true,
    },
  });
  const followingIds = following.map((user) => user.followingId);

  const res = await prisma.post.findMany({
    where: {
      userId: {
        in: [...followingIds, user.id],
      },
      /**
       * This is an alternative approach to Prisma's cursor-based pagination
       * that does not return the expected results when the cursor no longer
       * exists.
       * The issue links:
       * https://github.com/prisma/prisma/issues/3362
       * https://github.com/prisma/prisma/issues/8560
       */
      ...(cursor && {
        id: {
          ...(sortDirection === 'desc' && {
            lt: cursor,
          }),
          ...(sortDirection === 'asc' && {
            gt: cursor,
          }),
        },
      }),
    },
    take: limit,
    orderBy: {
      id: sortDirection,
    },
    select: selectPost(user.id),
  });

  const posts: GetPost[] = [];
  for (const post of res) posts.push(await toGetPost(post));
  return NextResponse.json<GetPost[]>(posts);
}
