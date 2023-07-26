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
  // `profile` is guaranteed to be not undefined as it was given an `initialData`
  const { data: profile } = useUserQuery(
    initialProfileData.id,
    initialProfileData
  );

  return (
    <>
      <div className="relative mb-28">
        <div
          className="h-60 md:h-72 md:rounded-b-3xl overflow-hidden drop-shadow-xl"
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
            <ProfileActionButtons profile={profile!} />
          </div>
        )}
      </div>

      <div className="px-4">
        <h1 className="text-4xl font-bold mb-1">{profile!.name}</h1>
        <div className="flex flex-col lg:flex-row">
          <p className="text-lg text-gray-600 mr-4">@{profile!.username}</p>
          <div className="flex flex-row">
            <p className="text-lg mr-6 hidden lg:block">&bull;</p>
            <p className="text-lg mr-6 font-semibold">
              <span>{profile!.followerCount}</span>{' '}
              <span className="text-gray-500">Followers</span>
            </p>
            <p className="text-lg mr-6">&bull;</p>
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
