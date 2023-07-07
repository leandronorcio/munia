import { DiscoverProfile } from '@/components/DiscoverProfile';

import { Gender, RelationshipStatus } from '@prisma/client';
import { Filters } from './Filters';

export default async function Discover({
  searchParams,
}: {
  searchParams: {
    gender?: Gender;
    'relationship-status'?: RelationshipStatus;
    'follow-status'?: 'follower' | 'following';
  };
}) {
  console.log(searchParams);
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
