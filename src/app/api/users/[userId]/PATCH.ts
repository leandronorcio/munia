import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getServerUser } from '@/lib/getServerUser';
import { z } from 'zod';
import { userAboutSchema } from '@/lib/validations/userAbout';
import { toGetUser } from '@/lib/prisma/toGetUser';
import { includeToUser } from '@/lib/prisma/includeToUser';
import { Prisma } from '@prisma/client';

type UserAbout = z.infer<typeof userAboutSchema>;

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

  const data: UserAbout = validate.data;

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
    // Modern runtime-safe Prisma error check
    if (typeof e === 'object' && e !== null && 'code' in e && (e as any).code === 'P2002') {
      const target = (e as any).meta?.target as string[] | undefined;
      const field = target ? target[0] : 'field';
      return NextResponse.json({ field, message: `This ${field} is already taken.` }, { status: 409 });
    }

    return NextResponse.json({ errorMessage: 'Unknown error occurred.' }, { status: 500 });
  }
}
