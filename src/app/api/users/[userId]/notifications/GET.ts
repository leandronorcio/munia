/**
 * GET /api/users/:userId/notifications
 * - Returns the notifications of an authenticated user.
 */
import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { toGetActivities } from '@/lib/prisma/toGetActivities';
import { NextResponse } from 'next/server';
import { FindActivityResults } from '@/types/definitions';

export async function GET(request: Request) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const cursor = parseInt(searchParams.get('cursor') || '0', 10);
  const sortDirection = (searchParams.get('sort-direction') as 'asc' | 'desc') || 'desc';

  const selectUser = {
    select: {
      id: true,
      username: true,
      name: true,
      profilePhoto: true,
      gender: true,
    },
  };

  const activities: FindActivityResults = await prisma.activity.findMany({
    where: {
      /**
       * This is an alternative approach to Prisma's cursor-based pagination
       * that does not return the expected results when the cursor no longer
       * exists.
       * The issue links:
       * https://github.com/prisma/prisma/issues/3362
       * https://github.com/prisma/prisma/issues/8560
       */
      ...(cursor && {
        id: {
          ...(sortDirection === 'desc' && {
            lt: cursor,
          }),
          ...(sortDirection === 'asc' && {
            gt: cursor,
          }),
        },
      }),
      targetUserId: userId,
      sourceUserId: {
        not: userId,
      },
    },
    take: limit,
    orderBy: {
      id: sortDirection,
    },
    select: {
      id: true,
      type: true,
      sourceId: true,
      targetId: true,
      createdAt: true,
      isNotificationRead: true,
      sourceUser: selectUser,
      targetUser: selectUser,
    },
  });

  return NextResponse.json(await toGetActivities(activities));
}
