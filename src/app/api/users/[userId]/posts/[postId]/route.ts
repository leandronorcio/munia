import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; postId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 401 });

  const res = await prisma.post.delete({
    where: {
      id_userId: {
        id: parseInt(params.postId),
        userId: user.id,
      },
    },
  });

  return NextResponse.json({ id: res.id });
}
