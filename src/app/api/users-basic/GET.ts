/**
 * GET /api/users-basic
 * - Returns a list of users and their basic information only
 * i.e. <UserSummaryAfterSetUp> type (id, username, name, profilePhoto).
 *
 * Use this endpoint when other complex data are not needed,
 * an example use case is searching for users to mention when
 * typing a comment or reply.
 */
import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { searchUser } from '@/lib/prisma/searchUser';
import { fileNameToUrl } from '@/lib/s3/fileNameToUrl';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const [user] = await getServerUser();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  const res = await prisma.user.findMany({
    where: {
      ...(search && searchUser(search)),
      id: {
        not: user?.id,
      },
      name: {
        not: null,
      },
      username: {
        not: null,
      },
    },
    select: {
      id: true,
      username: true,
      name: true,
      profilePhoto: true,
    },
    take: 10,
  });

  const result = res.map((u) => ({
    ...u,
    // Convert the `profilePhoto` file name to a full S3 URL
    profilePhoto: fileNameToUrl(u.profilePhoto),
  }));

  return NextResponse.json(result);
}
