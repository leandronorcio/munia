import { DiscoverProfile } from '@/components/DiscoverProfile';

import { Gender, RelationshipStatus } from '@prisma/client';
import { Filters } from './Filters';
import { convertKebabToAllCaps } from '@/lib/convertKebabToAllCaps';
import prisma from '@/lib/prisma';

interface DiscoverSearchParams {
  gender?: Gender;
  'relationship-status'?: RelationshipStatus;
  'follow-status'?: 'follower' | 'following';
  limit?: string;
  offset?: string;
}

async function getProfile({
  searchParams,
}: {
  searchParams: DiscoverSearchParams;
}) {
  const gender = convertKebabToAllCaps(searchParams['gender']);
  const relationshipStatus = convertKebabToAllCaps(
    searchParams['relationship-status']
  );
  const limit = parseInt(searchParams['limit'] || '4');
  const offset = parseInt(searchParams['offset'] || '0');

  const res = await prisma.user.findMany({
    where: {
      ...(gender != null && { gender: gender as Gender }),
      ...(relationshipStatus != null && {
        relationshipStatus: relationshipStatus as RelationshipStatus,
      }),
    },
    take: limit,
    skip: offset,
    // orderBy: {
    //   [orderBy]: sort,
    // },
  });

  return res;
}

export default async function Discover({
  searchParams,
}: {
  searchParams: DiscoverSearchParams;
}) {
  const profiles = await getProfile({ searchParams });
  return (
    <div className="mt-8 p-4 md:p-0">
      <h1 className="font-bold text-4xl mb-6">Discover People</h1>
      <Filters />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
        <DiscoverProfile />
        <DiscoverProfile />
        <DiscoverProfile />
      </div>
    </div>
  );
}

/**
 * This getProfile() properly fetches from a route handler,
 * however, there's currently a bug with NextAuth that causes
 * the getServerSession() of the route handler to always return
 * null whem fetching from a server component.
 * https://github.com/nextauthjs/next-auth/discussions/7062
 */
// async function getProfile({
//   searchParams,
// }: {
//   searchParams: DiscoverSearchParams;
// }) {
//   const params = new URLSearchParams([
//     ...Object.entries(searchParams),
//   ]).toString();
//   const url = new URL(`${process.env.URL}/api/users?${params}`);
//   const res = await fetch(url.href, {
//     cache: 'no-store',
//   });
//   if (!res.ok) {
//     return new Error('Failed to fetch profiles.');
//   }
//   return await res.json();
// }
