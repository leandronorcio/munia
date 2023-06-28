import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; postId: string; likeId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 401 });

  const res = await prisma.postLike.delete({
    where: {
      id_userId_postId: {
        userId: params.userId,
        postId: parseInt(params.postId),
        id: parseInt(params.likeId),
      },
    },
  });

  return NextResponse.json({ id: res.id });
}
