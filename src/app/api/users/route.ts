import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

export async function GET(request: Request) {
  const prisma = new PrismaClient();
  const session = getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const handle = searchParams.get('handle');
  if (id === null && handle === null) {
    return NextResponse.json({}, { status: 400 });
  }
  const identifier = handle !== null ? 'handle' : 'id';
  const identifierValue = id || handle;

  console.log(`identifier: ${identifier} indentifierValue: ${identifierValue}`);
  const data = await prisma.user.findFirst({
    where: {
      [identifier]: identifierValue,
    },
  });

  return NextResponse.json({ user: data }, { status: 200 });
}
