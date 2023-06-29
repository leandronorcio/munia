import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { postId: string; commentId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { content } = (await request.json()) as CommentPUTRequestBody;

  const res = await prisma.comment.update({
    where: {
      id_userId_postId: {
        id: parseInt(params.commentId),
        postId: parseInt(params.postId),
        userId: user.id,
      },
    },
    data: {
      content,
    },
  });

  return NextResponse.json({ id: res.id });
}
