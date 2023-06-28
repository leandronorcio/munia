import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { userId: string; postId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 401 });

  const res = await prisma.postLike.create({
    data: {
      post: {
        connect: {
          id: parseInt(params.postId),
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
