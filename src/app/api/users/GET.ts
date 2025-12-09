/**
 * GET /api/users
 * - Returns a list of users, allows filtering by `gender`,
 * `relationshipStatus`, and by followers/following.
 */

import { getServerUser } from '@/lib/getServerUser';
import { includeToUser } from '@/lib/prisma/includeToUser';
import prisma from '@/lib/prisma/prisma';
import { searchUser } from '@/lib/prisma/searchUser';
import { toGetUser } from '@/lib/prisma/toGetUser';
import { snakeCase, toUpper } from 'lodash';
import { NextResponse } from 'next/server';
import { FindUserResult, GetUser, Gender, RelationshipStatus } from '@/types/definitions';

export async function GET(request: Request) {
  // Get the current logged-in userde
  const [user] = await getServerUser();
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get('limit') || '4', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const search = searchParams.get('search');
  const gender = searchParams.get('gender') ? (toUpper(snakeCase(searchParams.get('gender')!)) as Gender) : undefined;
  const relationshipStatus = searchParams.get('relationship-status')
    ? (toUpper(snakeCase(searchParams.get('relationship-status')!)) as RelationshipStatus)
    : undefined;
  const followersOf = searchParams.get('followers-of');
  const followingOf = searchParams.get('following-of');

  const res: FindUserResult[] = await prisma.user.findMany({
    where: {
      ...(search && searchUser(search)),
      ...(gender && { gender }),
      ...(relationshipStatus && { relationshipStatus }),
      ...(followersOf && {
        following: {
          some: {
            followingId: followersOf,
          },
        },
      }),
      ...(followingOf && {
        followers: {
          some: {
            followerId: followingOf,
          },
        },
      }),
      id: { not: user?.id },
      name: { not: null },
      username: { not: null },
    },
    include: includeToUser(user?.id),
    take: limit,
    skip: offset,
  });

  const users: GetUser[] = res.map((singleUser) => toGetUser(singleUser));

  return NextResponse.json<GetUser[]>(users);
}
