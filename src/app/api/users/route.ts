import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getServerUser } from '@/lib/getServerUser';
import { toGetUser } from '@/lib/prisma/toGetUser';
import { FindUserResult, GetUser } from '@/types/definitions';
import { Gender, RelationshipStatus } from '@prisma/client';
import { searchUser } from '@/lib/prisma/searchUser';
import { snakeCase, toUpper } from 'lodash';

export async function GET(request: Request) {
  const [user] = await getServerUser();
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get('limit') || '4', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const search = searchParams.get('search');
  const gender = toUpper(snakeCase(searchParams.get('gender') || '')) as Gender | undefined;
  const relationshipStatus = toUpper(snakeCase(searchParams.get('relationship-status') || '')) as
    | RelationshipStatus
    | undefined;
  const followersOf = searchParams.get('followers-of');
  const followingOf = searchParams.get('following-of');

  const res: FindUserResult[] = await prisma.user.findMany({
    where: {
      ...(search && searchUser(search)),
      ...(gender && { gender }),
      ...(relationshipStatus && { relationshipStatus }),
      ...(followersOf && { following: { some: { followingId: followersOf } } }),
      ...(followingOf && { followers: { some: { followerId: followingOf } } }),
      id: { not: user?.id },
      name: { not: null },
      username: { not: null },
    },
    select: {
      id: true,
      username: true,
      name: true,
      profilePhoto: true,
      _count: { select: { followers: true, following: true } },
      followers: { select: { followerId: true } },
    },
    take: limit,
    skip: offset,
  });

  const users: GetUser[] = res.map((singleUser) => toGetUser(singleUser, user?.id));

  return NextResponse.json(users);
}
