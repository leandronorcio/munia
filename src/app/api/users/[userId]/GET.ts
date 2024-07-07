import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { FindUserResult, GetUser } from '@/types/definitions';
import { includeToUser } from '@/lib/prisma/includeToUser';
import { toGetUser } from '@/lib/prisma/toGetUser';
import { getServerUser } from '@/lib/getServerUser';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  // The user is only for checking whether the requestee
  // is following the user being rquested.
  const [user] = await getServerUser();

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
