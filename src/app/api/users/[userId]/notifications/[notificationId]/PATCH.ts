/**
 * PATCH /api/users/:userId/notifications/:notificationId
 * - Allows an authenticated to mark one of their notification,
 * specified by the `notificationId`, as read.
 */
import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

async function verifyAccessToNotification(notificationId: number) {
  const [user] = await getServerUser();
  const count = await prisma.activity.count({
    where: {
      id: notificationId,
      targetUserId: user?.id,
    },
  });

  return count > 0;
}

export async function PATCH(request: Request, { params }: { params: { userId: string; notificationId: string } }) {
  const notificationId = parseInt(params.notificationId, 10);
  if (!verifyAccessToNotification(notificationId)) return NextResponse.json({}, { status: 403 });

  await prisma.activity.update({
    where: {
      id: notificationId,
    },
    data: {
      isNotificationRead: true,
    },
  });

  return NextResponse.json({});
}
