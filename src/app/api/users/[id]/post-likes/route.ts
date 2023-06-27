import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface PostLikePostRequestBody {
  postId: number;
}

export default async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.id)
    return NextResponse.json({}, { status: 401 });

  const { postId } = (await request.json()) as PostLikePostRequestBody;

  const res = await prisma.postLike.create({
    data: {
      post: {
        connect: {
          id: postId,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return NextResponse.json({ id: res.id });
}
