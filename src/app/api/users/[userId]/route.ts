import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

  return NextResponse.json({ user });
}
