/**
 * DELETE /api/users/:userId/following/:targetUserId
 * - Allows an authenticated user to remove a user
 * from their following list / unfollow the :targetUserId.
 */
import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { userId: string; targetUserId: string } }) {
  const [user] = await getServerUser();
  if (!user || user.id !== params.userId) return NextResponse.json({}, { status: 403 });

  const isFollowing = await prisma.follow.count({
    where: {
      followerId: user.id,
      followingId: params.targetUserId,
    },
  });

  if (isFollowing) {
    const res = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: params.targetUserId,
        },
      },
    });

    // Delete the associated 'CREATE_FOLLOW' activity
    await prisma.activity.deleteMany({
      where: {
        type: 'CREATE_FOLLOW',
        sourceId: res.id,
        sourceUserId: user.id,
        targetUserId: params.targetUserId,
      },
    });

    return NextResponse.json({ unfollowed: true });
  }
  return NextResponse.json({ error: 'You are not following this user.' }, { status: 409 });
}
