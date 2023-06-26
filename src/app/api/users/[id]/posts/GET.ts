import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
      comments: true,
      postLikes: true,
      visualMedia: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json({ posts: res });
}
