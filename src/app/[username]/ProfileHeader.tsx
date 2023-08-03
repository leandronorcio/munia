'use client';

import { ProfileActionButtons } from '../../components/ProfileActionButtons';
import ProfilePhoto from './ProfilePhoto';
import CoverPhoto from './CoverPhoto';
import Tabs from './Tabs';
import { GetUser } from 'types';
import { useUserQuery } from '@/hooks/queries/useUserQuery';

export function ProfileHeader({
  isOwnProfile,
  initialProfileData,
}: {
  isOwnProfile: boolean;
  initialProfileData: GetUser;
}) {
  const { data } = useUserQuery(initialProfileData.id);
  // If there is no query of the user data yet, use the
  // `initialProfileData` that was fetched on server.
  const profile = data || initialProfileData;

  return (
    <>
      <div className="relative mb-28 sm:pt-6">
        <div
          className="h-60 overflow-hidden drop-shadow-xl sm:rounded-3xl md:h-72"
          style={{
            background:
              'linear-gradient(95.08deg, #AF45DB 2.49%, #EB7B96 97.19%)',
          }}
        >
          <CoverPhoto
            isOwnProfile={isOwnProfile}
            photoUrl={profile!.coverPhoto}
          />
        </div>
        <ProfilePhoto
          isOwnProfile={isOwnProfile}
          photoUrl={profile!.profilePhoto}
        />
        {!isOwnProfile && (
          <div className="absolute -bottom-20 right-2 md:right-0">
            <ProfileActionButtons targetUserId={profile!.id} />
          </div>
        )}
      </div>

      <div className="px-4">
        <h1 className="mb-1 text-4xl font-bold">{profile!.name}</h1>
        <div className="flex flex-col lg:flex-row">
          <p className="mr-4 text-lg text-gray-600">@{profile!.username}</p>
          <div className="flex flex-row">
            <p className="mr-6 hidden text-lg lg:block">&bull;</p>
            <p className="mr-6 text-lg font-semibold">
              <span>{profile!.followerCount}</span>{' '}
              <span className="text-gray-500">Followers</span>
            </p>
            <p className="mr-6 text-lg">&bull;</p>
            <p className="text-lg font-semibold">
              <span>{profile!.followingCount}</span>{' '}
              <span className="text-gray-500">Following</span>
            </p>
          </div>
        </div>
        <Tabs />
      </div>
    </>
  );
}
