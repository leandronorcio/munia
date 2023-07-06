import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (user === null)
    return NextResponse.json(
      { message: 'Profile not found,' },
      { status: 401 }
    );
  return NextResponse.json<{ user: User }>({ user });
}
