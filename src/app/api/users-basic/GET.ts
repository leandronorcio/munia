/**
 * GET /api/users-basic
 * - Returns a list of users and their basic information only
 * i.e. <UserSummary> type (id, username, name, profilePhoto).
 *
 * Use this endpoint when other complex data are not needed,
 * an example use case is searching for users to mention when
 * typing a comment or reply.
 */
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { UserSummary } from 'types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  const res: UserSummary[] | null = await prisma.user.findMany({
    where: {
      ...(search && {
        OR: [
          {
            name: {
              search: search?.replaceAll(' ', ' | '),
            },
          },
          {
            name: {
              startsWith: search,
              mode: 'insensitive',
            },
          },
          {
            username: {
              startsWith: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    },
    select: {
      id: true,
      username: true,
      name: true,
      profilePhoto: true,
    },
    take: 10,
  });

  return NextResponse.json(res);
}