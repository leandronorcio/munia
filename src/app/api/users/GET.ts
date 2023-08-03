import { getServerUser } from '@/lib/getServerUser';
import { includeToUser } from '@/lib/prisma/includeToUser';
import prisma from '@/lib/prisma/prisma';
import { toGetUser } from '@/lib/prisma/toGetUser';
import { Gender, RelationshipStatus } from '@prisma/client';
import { snakeCase, toUpper } from 'lodash';
import { NextResponse } from 'next/server';
import { FindUserResult, GetUser } from 'types';

export async function GET(request: Request) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get('limit') || '4');
  const offset = parseInt(searchParams.get('offset') || '0');

  const genderParam = searchParams.get('gender');
  const gender = genderParam ? toUpper(snakeCase(genderParam)) : null;

  const search = searchParams.get('search');
  const relationshipStatusParam = searchParams.get('relationship-status');
  const relationshipStatus = relationshipStatusParam
    ? toUpper(snakeCase(relationshipStatusParam))
    : null;

  const res: FindUserResult[] | null = await prisma.user.findMany({
    include: includeToUser(user.id),
    where: {
      ...(gender !== null && { gender: gender as Gender }),
      ...(relationshipStatus !== null && {
        relationshipStatus: relationshipStatus as RelationshipStatus,
      }),
      ...(search !== null && {
        name: {
          search: search?.replaceAll(' ', ' | '),
        },
      }),
    },
    take: limit,
    skip: offset,
  });

  if (res === null) {
    return NextResponse.json(null);
  }

  const users = res.map((singleUser) => toGetUser(singleUser));
  return NextResponse.json<GetUser[] | null>(users);
}
