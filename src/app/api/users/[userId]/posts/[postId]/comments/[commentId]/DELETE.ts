import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string; commentId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user) return NextResponse.json({}, { status: 401 });

  const res = await prisma.comment.delete({
    where: {
      id_userId_postId: {
        id: parseInt(params.commentId),
        postId: parseInt(params.postId),
        userId: user.id, // author of the comment, not the post
      },
    },
  });

  return NextResponse.json({ id: res.id });
}
