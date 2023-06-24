import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          id: id,
        },
        {
          handle: id,
        },
      ],
    },
  });

  return NextResponse.json({ user });
}
