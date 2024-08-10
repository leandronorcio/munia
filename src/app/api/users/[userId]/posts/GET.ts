/**
 * GET /api/users/:userId/posts
 * - Returns the posts composed by a single user, specified
 * by the :userId parameter.
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { selectPost } from '@/lib/prisma/selectPost';
import { GetPost } from '@/types/definitions';
import { toGetPost } from '@/lib/prisma/toGetPost';
import { getServerUser } from '@/lib/getServerUser';
import { usePostsSorter } from '@/hooks/usePostsSorter';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  /**
   * The [user] will only be used to check whether the
   * user requesting the Posts have like them or not.
   */
  const [user] = await getServerUser();
  const { filters, limitAndOrderBy } = usePostsSorter(request.url);

  const rawPosts = await prisma.post.findMany({
    where: {
      userId: params.userId,
      ...filters,
    },
    ...limitAndOrderBy,
    select: selectPost(user?.id),
  });

  const posts: GetPost[] = await Promise.all(rawPosts.map((post) => toGetPost(post)));
  return NextResponse.json<GetPost[] | null>(posts);
}
