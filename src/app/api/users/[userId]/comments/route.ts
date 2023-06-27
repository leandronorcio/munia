import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface CommentPostRequestBody {
  postId: number;
  content: string;
}
export default async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 401 });

  const { content, postId } = (await request.json()) as CommentPostRequestBody;

  const res = await prisma.comment.create({
    data: {
      content: content,
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
