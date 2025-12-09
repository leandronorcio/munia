import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { followPostSchema } from '@/lib/validations/follow';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const [user] = await getServerUser();
  if (!user || user.id !== params.userId) {
    return NextResponse.json({}, { status: 403 });
  }

  try {
    const { userIdToFollow } = followPostSchema.parse(await request.json());

    const follow = await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: userIdToFollow,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'CREATE_FOLLOW',
        sourceId: follow.id,
        sourceUserId: user.id,
        targetUserId: userIdToFollow,
      },
    });

    return NextResponse.json({ followed: true }, { status: 200 });
  } catch (error: unknown) {
    // Handle Prisma unique constraint errors
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
      return NextResponse.json({ error: 'You are already following this user.' }, { status: 409 });
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json({ error: 'Unknown server error.' }, { status: 500 });
  }
}
