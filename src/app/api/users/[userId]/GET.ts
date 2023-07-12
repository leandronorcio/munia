import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { FindUserResult, GetUser } from 'types';
import { includeToUser } from '@/lib/prisma/includeToUser';
import { toGetUser } from '@/lib/prisma/toGetUser';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  // The user is only for checking whether the requestee
  // is following the user being rquested.
  const [user] = await useProtectApiRoute();

  const { userId } = params;
  const res: FindUserResult | null = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: includeToUser(user?.id),
  });

  if (res === null) {
    return NextResponse.json(null);
  }

  const userResponse = toGetUser(res);
  return NextResponse.json<GetUser | null>(userResponse);
}
