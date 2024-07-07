/**
 * PATCH /api/users/:userId/notifications
 * - Allows an authenticated to mark all of thier notifications as read.
 */
import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  const [user] = await getServerUser();
  if (!user || user.id !== params.userId) return NextResponse.json({}, { status: 401 });

  await prisma.activity.updateMany({
    where: {
      targetUserId: user.id,
    },
    data: {
      isNotificationRead: true,
    },
  });

  return NextResponse.json({});
}
