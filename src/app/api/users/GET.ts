import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { convertKebabToAllCaps } from '@/lib/convertKebabToAllCaps';
import prisma from '@/lib/prisma';
import { Gender, RelationshipStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const [user] = await useProtectApiRoute();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { searchParams } = new URL(request.url);
  const gender = convertKebabToAllCaps(searchParams.get('gender'));
  const relationshipStatus = convertKebabToAllCaps(
    searchParams.get('relationship-status')
  );
  const followStatus = convertKebabToAllCaps(searchParams.get('follow-status'));
  const limit = parseInt(searchParams.get('limit') || '4');
  const offset = parseInt(searchParams.get('offset') || '0');
  // const orderBy =
  //   (searchParams.get('order-by') as 'birthDate' | null) || 'birthDate';
  // const sort = (searchParams.get('sort') as 'asc' | 'desc' | null) || 'asc';

  const res = await prisma.user.findMany({
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
  return NextResponse.json(res);
}
