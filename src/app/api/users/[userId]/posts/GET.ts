/**
 * GET /api/users/:userId/posts
 * - Returns the posts composed by a single user, specified
 * by the :userId parameter.
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { selectPost } from '@/lib/prisma/selectPost';
import { GetPost } from 'types';
import { toGetPost } from '@/lib/prisma/toGetPost';
import { getServerUser } from '@/lib/getServerUser';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  /**
   * The [user] will only be used to check whether the
   * user requesting the Posts have like them or not.
   */
  const [user] = await getServerUser();

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  const cursor = parseInt(searchParams.get('cursor') || '0');
  const sortDirection =
    (searchParams.get('sort-direction') as 'asc' | 'desc') || 'desc';

  const res = await prisma.post.findMany({
    where: {
      userId: params.userId,
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
    select: selectPost(user?.id),
  });

  const posts: GetPost[] = [];
  for (const post of res) posts.push(await toGetPost(post));
  return NextResponse.json<GetPost[] | null>(posts);
}
