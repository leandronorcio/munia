import { NextResponse } from 'next/server';
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import prisma from '@/lib/prisma';
import { selectPost } from './selectPost';
import { PostType } from 'types';

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
  const cursor = parseInt(searchParams.get('cursor') || '0');

  const res = await prisma.post.findMany({
    select: selectPost(user.id),
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

  return NextResponse.json<{ posts: PostType[] }>({ posts: res });
}
