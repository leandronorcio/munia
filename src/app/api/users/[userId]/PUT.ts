import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sub } from 'date-fns';
import prisma from '@/lib/prisma/prisma';
import { Prisma } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 401 });

  const userAbout = await request.json();

  const nonEmptyStringSchema = z.string().trim().min(1);
  const userAboutSchema = z.object({
    username: nonEmptyStringSchema.optional(),
    name: nonEmptyStringSchema.optional(),
    email: nonEmptyStringSchema.email().optional(),
    bio: nonEmptyStringSchema.optional().nullable(),
    website: nonEmptyStringSchema
      .regex(
        new RegExp(
          /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/[^\s]*)?$/
        ),
        { message: 'Invalid website' }
      )
      .optional()
      .nullable(),
    address: nonEmptyStringSchema.optional().nullable(),
    phoneNumber: nonEmptyStringSchema
      .regex(
        new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
        'Invalid phone number'
      )
      .optional()
      .nullable(),
    gender: z
      .union([z.literal('FEMALE'), z.literal('MALE'), z.literal('NONBINARY')])
      .optional()
      .nullable(),
    relationshipStatus: z
      .union([
        z.literal('SINGLE'),
        z.literal('IN_A_RELATIONSHIP'),
        z.literal('ENGAGED'),
        z.literal('MARRIED'),
      ])
      .optional()
      .nullable(),
    birthDate: z.coerce
      .date()
      .min(new Date('1970-01-01'), {
        message: "Sorry you're too old for this site.",
      })
      .max(sub(new Date(), { years: 7 }), {
        message: 'You must be at least 7 years old',
      })
      .optional()
      .nullable(),
  });

  const validate = userAboutSchema.safeParse(userAbout);
  if (validate.success) {
    try {
      const res = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...validate.data,
        },
      });

      return NextResponse.json({ ...res });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return NextResponse.json(
            { error: 'User ID already taken.' },
            { status: 409 }
          );
        }
      }
    }
  } else {
    console.log(validate.error.issues[0].message);
    return NextResponse.json(
      { error: validate.error.issues[0].message },
      { status: 400 }
    );
  }
}
