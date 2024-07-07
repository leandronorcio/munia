/**
 * GET /api/posts/hashtag/:hashtag
 * - Returns the posts that contains the specified `hashtag`.
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { selectPost } from '@/lib/prisma/selectPost';
import { GetPost } from '@/types/definitions';
import { toGetPost } from '@/lib/prisma/toGetPost';
import { getServerUser } from '@/lib/getServerUser';
import { usePostsSorter } from '@/hooks/usePostsSorter';

export async function GET(request: Request, { params }: { params: { hashtag: string } }) {
  /**
   * The [user] will only be used to check whether the
   * user requesting the Posts have like them or not.
   */
  const [user] = await getServerUser();
  const { filters, limitAndOrderBy } = usePostsSorter(request.url);

  const res = await prisma.post.findMany({
    where: {
      content: {
        search: params.hashtag,
      },
      ...filters,
    },
    ...limitAndOrderBy,
    select: selectPost(user?.id),
  });

  const posts: GetPost[] = [];
  for (const post of res) posts.push(await toGetPost(post));
  return NextResponse.json<GetPost[] | null>(posts);
}
