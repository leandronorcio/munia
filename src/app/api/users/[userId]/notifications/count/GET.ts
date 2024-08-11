/**
 * GET /api/users/:userId/notifications/count
 * - Returns the number of the unread notifications of an
 * authenticated user.
 */
import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  const count = await prisma.activity.count({
    where: {
      isNotificationRead: false,
      targetUserId: userId,
      sourceUserId: {
        not: userId,
      },
    },
  });

  return NextResponse.json(count);
}
