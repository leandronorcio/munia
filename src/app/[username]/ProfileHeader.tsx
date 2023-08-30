'use client';

import { ProfileActionButtons } from '../../components/ProfileActionButtons';
import ProfilePhoto from './ProfilePhoto';
import CoverPhoto from './CoverPhoto';
import Tabs from './Tabs';
import { GetUser } from 'types';
import { useUserQuery } from '@/hooks/queries/useUserQuery';
import Link from 'next/link';

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
      <div className="relative mb-[72px] md:pt-6">
        <div
          className="h-60 overflow-hidden drop-shadow-xl md:rounded-3xl"
          style={{
            background:
              'linear-gradient(95.08deg, #AF45DB 2.49%, #EB7B96 97.19%)',
          }}
        >
          <CoverPhoto
            isOwnProfile={isOwnProfile}
            photoUrl={profile.coverPhoto}
          />
        </div>
        <ProfilePhoto
          isOwnProfile={isOwnProfile}
          photoUrl={profile.profilePhoto}
        />
        {!isOwnProfile && (
          <div className="absolute -bottom-20 right-2 md:right-0">
            <ProfileActionButtons targetUserId={profile.id} />
          </div>
        )}
      </div>

      <div className="px-4">
        <h1 className="text-lg font-bold">{profile.name}</h1>
        <p className="mb-2 font-mono text-sm text-slate-500">
          @{profile.username}
        </p>
        <p className="text-slate-800">{profile.bio}</p>
        <div className="flex flex-row gap-3">
          <Link href={`/${profile.username}/followers`} className="link">
            <span className="font-semibold">{profile.followerCount}</span>{' '}
            <span className="text-slate-500">Followers</span>
          </Link>
          <Link href={`/${profile.username}/following`} className="link">
            <span className="font-semibold">{profile.followingCount}</span>{' '}
            <span className="text-slate-500">Following</span>
          </Link>
        </div>
        <Tabs isOwnProfile={isOwnProfile} />
      </div>
    </>
  );
}
