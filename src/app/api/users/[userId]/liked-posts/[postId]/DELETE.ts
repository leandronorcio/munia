/**
 * DELETE /api/users/:userId:/liked-posts/:postId
 * - Allows an authenticated user to delete a post
 * from their liked posts.
 */

import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; postId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || params.userId !== user.id)
    return NextResponse.json({}, { status: 401 });

  const postId = parseInt(params.postId);
  if (!verifyAccessToLike(postId)) {
    return NextResponse.json({}, { status: 403 });
  }

  try {
    await prisma.postLike.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    return NextResponse.json({ deleted: true }); // Can add 204 status code here, but there is bug with RSC https://stackoverflow.com/questions/75924132/why-does-a-204-response-to-a-fetch-in-a-react-server-component-throw-a-typeerr
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { message: 'Post already unliked/never liked.' },
          { status: 410 }
        );
      }
    }
    return NextResponse.json({}, { status: 500 });
  }
}

const verifyAccessToLike = async (postId: number) => {
  const [user] = await useProtectApiRoute();
  const count = await prisma.postLike.count({
    where: {
      postId,
      userId: user?.id,
    },
  });

  return count > 0;
};
