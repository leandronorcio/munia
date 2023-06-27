import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  const offset = parseInt(searchParams.get('offset') || '0');

  const res = await prisma.post.findMany({
    take: limit,
    skip: offset,
    where: {
      userId: params.id,
    },
    include: {
      user: {
        select: {
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
      _count: {
        select: {
          postLikes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json({ posts: res });
}
