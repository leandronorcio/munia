/**
 * PATCH /api/users/:userId
 * Allows an authenticated user to update their information.
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { Prisma } from '@prisma/client';
import { getServerUser } from '@/lib/getServerUser';
import { userAboutSchema, UserAboutSchemaType } from '@/lib/validations/userAbout';
import { toGetUser } from '@/lib/prisma/toGetUser';
import { includeToUser } from '@/lib/prisma/includeToUser';

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  const [user] = await getServerUser();
  if (!user || user.id !== params.userId) {
    return NextResponse.json({ errorMessage: 'Unauthorized' }, { status: 401 });
  }

  let userAbout: unknown;
  try {
    userAbout = await request.json();
  } catch {
    return NextResponse.json({ errorMessage: 'Invalid JSON body' }, { status: 400 });
  }

  const validate = userAboutSchema.safeParse(userAbout);
  if (!validate.success) {
    return NextResponse.json({ errorMessage: validate.error.issues[0].message }, { status: 400 });
  }

  const data: UserAboutSchemaType = validate.data;

  try {
    const res = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
      },
      include: includeToUser(user.id),
    });

    return NextResponse.json(toGetUser(res));
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002' && e.meta) {
        const field = (e.meta.target as string[])[0];
        return NextResponse.json({ field, message: `This ${field} is already taken.` }, { status: 409 });
      }
      return NextResponse.json({ errorMessage: 'Database (Prisma) error.' }, { status: 502 });
    }

    return NextResponse.json({ errorMessage: 'Unknown error occurred.' }, { status: 500 });
  }
}
