import { convertKebabToAllCaps } from '@/lib/convertKebabToAllCaps';
import { getServerUser } from '@/lib/getServerUser';
import { includeToUser } from '@/lib/prisma/includeToUser';
import prisma from '@/lib/prisma/prisma';
import { toGetUser } from '@/lib/prisma/toGetUser';
import { Gender, RelationshipStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { FindUserResult, GetUser } from 'types';

export async function GET(request: Request) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { searchParams } = new URL(request.url);
  const gender = convertKebabToAllCaps(searchParams.get('gender'));
  const relationshipStatus = convertKebabToAllCaps(
    searchParams.get('relationship-status')
  );
  // const followStatus = convertKebabToAllCaps(searchParams.get('follow-status'));
  const limit = parseInt(searchParams.get('limit') || '4');
  const offset = parseInt(searchParams.get('offset') || '0');
  // const orderBy =
  //   (searchParams.get('order-by') as 'birthDate' | null) || 'birthDate';
  // const sort = (searchParams.get('sort') as 'asc' | 'desc' | null) || 'asc';

  const res: FindUserResult[] | null = await prisma.user.findMany({
    include: includeToUser(user.id),
    where: {
      ...(gender !== null && { gender: gender as Gender }),
      ...(relationshipStatus !== null && {
        relationshipStatus: relationshipStatus as RelationshipStatus,
      }),
    },
    take: limit,
    skip: offset,
    // orderBy: {
    //   [orderBy]: sort,
    // },
  });

  if (res === null) {
    return NextResponse.json(null);
  }

  const users = res.map((singleUser) => toGetUser(singleUser));
  return NextResponse.json<GetUser[] | null>(users);
}
