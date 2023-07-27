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

  const res = await prisma.post.findMany({
    select: selectPost(user?.id),
    where: {
      userId: params.userId,
    },
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

  const posts = res.map((post) => toGetPost(post));
  return NextResponse.json<GetPost[] | null>(posts);
}
