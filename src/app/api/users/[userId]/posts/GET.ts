import { NextResponse } from 'next/server';
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  /**
   * The [user] will only be used to check whether the
   * user requesting the Posts have like them or not.
   */
  const [user] = await useProtectApiRoute();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  const offset = parseInt(searchParams.get('offset') || '0');

  const res = await prisma.post.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          profilePhoto: true,
        },
      },
      visualMedia: {
        select: {
          type: true,
          url: true,
        },
      },
      /**
       * Use postLikes to store the <PostLike>'s id of the user to the Post.
       * If there is a <PostLike> id, that means the user requesting has
       * liked the Post.
       */
      postLikes: {
        select: {
          id: true,
        },
        where: {
          userId: user.id,
        },
      },
      _count: {
        select: {
          postLikes: true,
          comments: true,
        },
      },
    },
    where: {
      userId: params.userId,
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json({ posts: res });
}
